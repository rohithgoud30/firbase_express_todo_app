const admin = require('firebase-admin')
const formatTimestamp = require('../utils/helpers')
const db = admin.firestore()

// Create a new todo
const createTodo = async (req, res) => {
  try {
    const todo = {
      ...req.body,
      userId: req.user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const newTodoRef = db.collection('todos').doc()
    await newTodoRef.set(todo)
    res.status(201).send({ id: newTodoRef.id })
  } catch (error) {
    console.error('Error creating todo:', error.message)
    res.status(500).send(error.message)
  }
}

// Get all todos for the authenticated user
const getTodos = async (req, res) => {
  try {
    const todosSnapshot = await db
      .collection('todos')
      .where('userId', '==', req.user.uid)
      .get()
    const todos = todosSnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: formatTimestamp(data.createdAt),
        updatedAt: formatTimestamp(data.updatedAt),
      }
    })
    res.status(200).send(todos)
  } catch (error) {
    console.error('Error getting todos:', error.message)
    res.status(500).send(error.message)
  }
}

// Get a todo by ID for the authenticated user
const getTodoById = async (req, res) => {
  try {
    const todoId = req.params.id
    const todoRef = db.collection('todos').doc(todoId)
    const doc = await todoRef.get()

    if (!doc.exists || doc.data().userId !== req.user.uid) {
      return res.status(404).send('Todo not found or unauthorized')
    }

    const data = doc.data()
    const todo = {
      id: doc.id,
      ...data,
      createdAt: formatTimestamp(data.createdAt),
      updatedAt: formatTimestamp(data.updatedAt),
    }

    res.status(200).send(todo)
  } catch (error) {
    console.error('Error getting todo by ID:', error.message)
    res.status(500).send(error.message)
  }
}

// Update a todo (partial update)
const updateTodo = async (req, res) => {
  try {
    const todoId = req.params.id
    const updatedData = {
      ...req.body,
      updatedAt: Timestamp.now(),
    }
    const todoRef = db.collection('todos').doc(todoId)

    // Check if the authenticated user is the owner of the todo
    const doc = await todoRef.get()
    if (!doc.exists || doc.data().userId !== req.user.uid) {
      return res.status(403).send('Unauthorized')
    }

    await todoRef.update(updatedData)
    res.status(200).send({ id: todoId })
  } catch (error) {
    console.error('Error updating todo:', error.message)
    res.status(500).send(error.message)
  }
}

// Delete a todo
const deleteTodo = async (req, res) => {
  try {
    const todoId = req.params.id
    const todoRef = db.collection('todos').doc(todoId)

    // Check if the authenticated user is the owner of the todo
    const doc = await todoRef.get()
    if (!doc.exists || doc.data().userId !== req.user.uid) {
      return res.status(403).send('Unauthorized')
    }

    await todoRef.delete()
    res.status(200).send({ id: todoId })
  } catch (error) {
    console.error('Error deleting todo:', error.message)
    res.status(500).send(error.message)
  }
}

module.exports = {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
}
