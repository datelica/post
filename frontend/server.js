const express = require('express')
const app = express()
const PORT = 3000

// Set Pug as the view engine
app.set('view engine', 'pug')
app.set('views', './views')

// Serve static files from 'public' directory
app.use(express.static('public'))

// Define a route for the root URL
app.get('/', (req, res) => {
  res.render('index')
})
app.get('/register', (req, res) => {
  res.render('register')
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.get('/create', (req, res) => {
  res.render('create')
})

// Start the server
app.listen(PORT, () => {
  console.log(`Mini Twitter Frontend App is running on port ${PORT}`)
})
