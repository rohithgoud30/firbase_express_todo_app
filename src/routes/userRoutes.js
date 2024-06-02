const express = require('express')
const {
  registerUser,
  loginUser,
  sendPasswordResetEmail,
  uploadProfilePicture,
} = require('../controllers/userController')
const verifyToken = require('../middlewares/authMiddleware')
const upload = require('../middlewares/uploadMiddleware')

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/reset-password', sendPasswordResetEmail)
router.post(
  '/profile-picture',
  verifyToken,
  upload.single('profilePicture'),
  uploadProfilePicture
)

module.exports = router
