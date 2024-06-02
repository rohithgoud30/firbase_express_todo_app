const { admin, db, bucket } = require('../firebase')
const axios = require('axios')
const { sendResetEmail } = require('../utils/email')

const registerUser = async (req, res) => {
  const { name, email, password } = req.body

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    })

    await db.collection('users').doc(userRecord.uid).set({
      name: userRecord.displayName,
      email: userRecord.email,
      createdAt: new Date(),
    })

    res.status(201).send({ uid: userRecord.uid })
  } catch (error) {
    console.error('Error creating user:', error)
    res.status(500).send(error.message)
  }
}

const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    )

    const idToken = response.data.idToken
    const uid = response.data.localId

    res.status(200).send({ idToken, uid })
  } catch (error) {
    console.error('Error logging in user:', error)
    res.status(500).send(error.response.data.error.message)
  }
}

const sendPasswordResetEmail = async (req, res) => {
  const { email } = req.body

  try {
    const user = await admin.auth().getUserByEmail(email)
    const resetLink = await admin.auth().generatePasswordResetLink(email)

    await sendResetEmail(email, resetLink)

    res.status(200).send('Password reset email sent.')
  } catch (error) {
    console.error('Error sending password reset email:', error)
    res.status(500).send(error.message)
  }
}

const uploadProfilePicture = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.')
  }

  const userId = req.user.uid
  const file = req.file
  const fileName = `profile_pictures/${userId}_${Date.now()}.${file.originalname
    .split('.')
    .pop()}`

  const blob = bucket.file(fileName)

  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
    public: true,
  })

  blobStream.on('error', (err) => {
    console.error('Error uploading file:', err)
    res.status(500).send('Something went wrong while uploading the file.')
  })

  blobStream.on('finish', async () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    await db.collection('users').doc(userId).update({
      profilePicture: publicUrl,
    })
    res.status(200).send({ url: publicUrl })
  })

  blobStream.end(file.buffer)
}

module.exports = {
  registerUser,
  loginUser,
  sendPasswordResetEmail,
  uploadProfilePicture,
}
