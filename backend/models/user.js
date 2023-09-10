const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    req: true
  },
  email: {
    type: String,
    req: true
  },
  password: {
    type: String,
    req: true
  },
  room: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
      },
      role: {
        type: String,
        enum: ['owner', 'user']
      }
    }
  ]
})

module.exports = mongoose.model('User', userSchema)
