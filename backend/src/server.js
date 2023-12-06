const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const cors = require('cors')
const connection = require('./config/connection')
const routes = require('./routes/routes')
const app = express()
const PORT = 4000

app.use(cors())

app.use(bodyParser.json())

app.use(routes)

app.listen(PORT, () => {
  console.log(`<<< Backend MiniTwitter running on port ${PORT} >>>`)
})
