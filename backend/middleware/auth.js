const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const User = require('../models/user')

const config = require('../config')

module.exports = async (req, res, next) => {
  const token = req.headers['authorization']
  if (!token) {
    const err = new Error('Not authorized')
    err.statusCode = 401
    next(err)
  } else {
    const authToken = token
    try {
      const decoded = jwt.verify(authToken, config.jwt.secret)
      const user = await User.findById(decoded.id)
      if (!user) {
        const error = new Error('User not found')
        error.statusCode = 401
        next(error)
      }
      req.user = user
      req.user.id = user._id
      next()
    } catch (err) {
      err.statusCode = 500
      next(err)
    }
  }
}
