const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()
const db = require('../config/connection')
const authenticateToken = require('../middleware/authenticateToken')

const SECRET_KEY = 'M!nn3@pol!s2003'

//Register a new user
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body
  if (!(email && password && username)) {
    return res.status(400).json({ message: 'All input is required' })
  }

  // Check if user already exists
  db.query(
    'SELECT * FROM users WHERE username = ? OR email = ?',
    [username, email],
    async (err, results) => {
      if (err) {
        return res.status(500).json({ message: err.message })
      }
      if (results.length > 0) {
        return res
          .status(409)
          .json({ message: 'Username or Email already exists' })
      }

      // If user does not exist, create new user
      const encryptedPassword = await bcrypt.hash(password, 10)
      db.query(
        'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
        [username, encryptedPassword, email],
        (err, result) => {
          if (err) {
            return res.status(500).json({ message: err.message })
          }
          return res.status(201).json({ message: 'User registered' })
        }
      )
    }
  )
})

//User Login
router.post('/login', (req, res) => {
  const { username, password } = req.body
  if (!(username && password)) {
    res.status(400).json({ message: 'userid and password are required' })
  }
  db.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (err, results) => {
      if (
        err ||
        results.length === 0 ||
        !(await bcrypt.compare(password, results[0].password))
      ) {
        res.status(400).json({ message: 'Invalid credentials' })
      } else {
        const token = jwt.sign(
          { user_id: results[0].id, username },
          SECRET_KEY,
          { expiresIn: '2h' }
        )
        res.status(200).json({ token: token })
      }
    }
  )
})

//Create a new post
router.post('/posts', authenticateToken, (req, res) => {
  const { content } = req.body
  const user_id = req.user.user_id
  db.query(
    'INSERT INTO posts (user_id, content) VALUES (?, ?)',
    [user_id, content],
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err.message })
      } else {
        res.status(201).json({ message: 'Post created ' })
      }
    }
  )
})

//Update a post
router.put('/posts/:id', authenticateToken, (req, res) => {
  const { content } = req.body
  const { id } = req.params
  db.query(
    'UPDATE posts SET content = ? WHERE id = ? AND user_id = ?',
    [content, id, req.user.user_id],
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err.message })
      } else if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Post not found' })
      } else {
        res.status(200).json({ message: 'Post updated' })
      }
    }
  )
})

//Delete a post
router.delete('/posts/:id', authenticateToken, (req, res) => {
  const { id } = req.params
  db.query(
    'DELETE FROM posts WHERE id = ? AND user_id = ?',
    [id, req.user.user_id],
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err.message })
      } else if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Post not found' })
      } else {
        res.status(200).json({ message: 'Post deleted' })
      }
    }
  )
})

//Like a post
router.post('/like', authenticateToken, (req, res) => {
  const { post_id } = req.body
  db.query(
    'INSERT INTO likes (user_id, post_id) VALUES (?, ?)',
    [req.user.user_id, post_id],
    (err, result) => {
      if (err) {
        res.status(500).json({ message: err.message })
      } else {
        res.status(200).json({ message: 'Post liked' })
      }
    }
  )
})

//Get posts by user
router.get('/user/:userId/posts', (req, res) => {
  const userId = req.params.userId

  const query = `
    SELECT 
      posts.id,
      posts.content,
      posts.created_at,
      posts.updated_at,
      COUNT(likes.id) as likesCount
    FROM posts
    LEFT JOIN likes ON posts.id = likes.post_id
    WHERE posts.user_id = ?
    GROUP BY posts.id
    ORDER BY posts.created_at DESC`

  db.query(query, [userId], (err, results) => {
    if (err) {
      res.status(500).json({ message: err.message })
    } else {
      res.json(results)
    }
  })
})

//get all posts
router.get('/posts', (req, res) => {
  // Parse query parameters for pagination
  const page = parseInt(req.query.page, 10) || 1 // Default to 1 if not provided
  const limit = parseInt(req.query.limit, 10) || 5 // Default to 5 if not provided
  const offset = (page - 1) * limit

  const query = `
    SELECT 
      posts.id,
      posts.content,
      posts.created_at,
      users.username,
      (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) AS likesCount
    FROM posts
    JOIN users ON posts.user_id = users.id
    ORDER BY posts.created_at DESC
    LIMIT ?
    OFFSET ?`

  db.query(query, [limit, offset], (err, results) => {
    if (err) {
      res.status(500).json({ message: err.message })
    }
    res.json(results)
  })
})

module.exports = router
