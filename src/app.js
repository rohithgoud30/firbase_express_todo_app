const functions = require('firebase-functions')
const express = require('express')
const dotenv = require('dotenv')

// Load environment variables from .env file
dotenv.config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const userRoutes = require('./routes/userRoutes')
const todoRoutes = require('./routes/todoRoutes')

app.use('/users', userRoutes)
app.use('/todos', todoRoutes)

app.get('/', (req, res) => {
  res.send('Todo API is running.')
})

// Function to start the server locally
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app)
