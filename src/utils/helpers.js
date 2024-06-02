// Function to format Firestore timestamp
const formatTimestamp = (timestamp) => {
  return timestamp.toDate().toISOString()
}

module.exports = formatTimestamp
