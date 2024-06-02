const express = require('express')
const {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
} = require('../controllers/todoController')
const verifyToken = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/', verifyToken, createTodo) // Create todo with authentication
router.get('/', verifyToken, getTodos) // Get all todos with authentication
router.get('/:id', verifyToken, getTodoById) // Get todo by ID with authentication
router.put('/:id', verifyToken, updateTodo) // Update todo with authentication
router.delete('/:id', verifyToken, deleteTodo) // Delete todo with authentication

module.exports = router
