const mysql = require('mysql')

// Database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Sebastian',
  database: 'minitwitter',
})

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack)
    return
  }
  console.log('<<< Connected to MySQL Database Minitwitter >>>')
})

module.exports = connection
