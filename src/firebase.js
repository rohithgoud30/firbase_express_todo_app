const admin = require('firebase-admin')
const serviceAccount = require('./fir-practice-9e919-firebase-adminsdk-53e14-6ba7814ab3.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://fir-practice-9e919.appspot.com',
  databaseURL: 'https://fir-practice-9e919-default-rtdb.firebaseio.com',
})

const db = admin.firestore()
const bucket = admin.storage().bucket()

module.exports = { admin, db, bucket }
