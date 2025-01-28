// middleware/upload.js
const multer = require('multer')
const path = require('path')

// Set the storage destination and file naming strategy
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')  // Save images in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))  // Add timestamp to filename to avoid collisions
  }
})

const fileFilter = (req, file, cb) => {
  // Allow only image files
  const filetypes = /jpeg|jpg|png|gif/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, PNG and GIF are allowed!'), false)
  }
}

const upload = multer({ 
  storage,
  fileFilter
})

module.exports = upload
