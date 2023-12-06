const mysql = require('mysql')

// Database connection configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: 'Sebastian', // Replace with your MySQL password
  database: 'MiniTwitter', // Replace with your database name
})

connection.connect((err) => {
  if (err) {
    return console.error('error: ' + err.message)
  }

  console.log('Connected to the MySQL server.')

  // Create users table
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`

  connection.query(createUsersTable, (err, results, fields) => {
    if (err) {
      return console.error(err.message)
    }
    console.log('Users table created')
  })

  // Create posts table
  const createPostsTable = `
    CREATE TABLE IF NOT EXISTS posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`

  connection.query(createPostsTable, (err, results, fields) => {
    if (err) {
      return console.error(err.message)
    }
    console.log('Posts table created')
  })

  // Create likes table
  const createLikesTable = `
    CREATE TABLE IF NOT EXISTS likes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      post_id INT,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (post_id) REFERENCES posts(id),
      UNIQUE (user_id, post_id)
    )`

  connection.query(createLikesTable, (err, results, fields) => {
    if (err) {
      return console.error(err.message)
    }
    console.log('Likes table created')
  })

  // Insert Data into Users (example)
  const insertIntoUsers = `INSERT INTO users (username, password, email) VALUES 
    ('sebycolo', 'admin', 'sebycolo32@gmail.com'),
    ('camoren', 'test123', 'camoren777@gmail.com'),
    ('daniela', 'test123', 'dani01@gmail.com')`

  connection.query(insertIntoUsers, (err, results, fields) => {
    if (err) {
      return console.error(err.message)
    }
    console.log('Data inserted into Users table')
  })

  // Close the connection
  connection.end((err) => {
    if (err) {
      return console.error(err.message)
    }
    console.log('Closed the database connection.')
  })
})
