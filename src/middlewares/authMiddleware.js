const admin = require('firebase-admin')

const verifyToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1]
  if (!idToken) {
    return res.status(401).send('Unauthorized: No token provided')
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    req.user = decodedToken
    next()
  } catch (error) {
    console.error('Error verifying token:', error)
    if (error.code === 'auth/id-token-expired') {
      return res
        .status(401)
        .send('Unauthorized: Token has expired. Please log in again.')
    }
    res.status(401).send('Unauthorized: Invalid token')
  }
}

module.exports = verifyToken
