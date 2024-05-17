// Import required modules
const express = require('express');
const multer = require('multer');

// Create Express application
const app = express();
const port = 3003; // Change port to 3003

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Specify the directory where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // Use the original file name
  }
});
const upload = multer({ storage: storage });

// Endpoint to handle file uploads
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.status(200).send('File uploaded successfully.');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

/// http://localhost:3003/api/upload