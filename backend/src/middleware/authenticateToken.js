const jwt = require('jsonwebtoken')
const SECRET_KEY = 'M!nn3@pol!s2003'

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  console.log('TOKEN....', token)

  if (token == null) return res.sendStatus(401) // if there isn't any token

  jwt.verify(token, SECRET_KEY, (err, user) => {
    // if the token has expired or is invalid
    if (err) {
      console.error('JWT Verification Error:', err.message)
      return res.status(403).json({ error: 'Forbidden', details: err.message })
    }
    req.user = user
    next()
  })
}

module.exports = authenticateToken
