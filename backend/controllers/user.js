const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')

const User = require('../models/user')
const Room = require('../models/room')

const config = require('../config')
const multer = require('multer');
const path = require('path');

const upload=require('../middleware/upload')


const signup = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const err = new Error('Validation failed')
    err.message = error.array()
    err.statusCode = 422
    next(err)
  }else{

    const email = req.body.email
    const name = req.body.name
    const password = req.body.password
    console.log(req.body)
  const image = req.file ? req.file.filename : null;  // Get image filename from Multer

  try {
    const user = await User.findOne({ email });
    if (user) {
      const error = new Error('User already exists');
      error.statusCode = 401;
      return next(error);
    }

    const salt = bcrypt.genSaltSync(config.user.password.saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({
      email,
      name,
      password: hash,
      image  // Save the filename of the uploaded image
    });

    await newUser.save();

    return res.json({
      success: true,
      message: 'User created successfully'
    });
  } catch (err) {
    err.statusCode = 500;
    console.log(err);
    return next(err);
  }}
};


const login = async (req, res, next) => {
  const error = validationResult(req)
  if (!error.isEmpty()) {
    const err = new Error('Validation failed')
    err.message = error.array()
    err.statusCode = 422
    next(err)
  } else {
    const email = req.body.email
    const password = req.body.password
    try {
      const user = await User.findOne({ email })
      if (!user) {
        const error = new Error('User not found')
        error.statusCode = 401
        next(error)
      } else {
        const valid = bcrypt.compareSync(password, user.password)
        if (!valid) {
          const error = new Error('Wrong password')
          error.statusCode = 401
          next(error)
        }
        const token = jwt.sign({ id: user._id }, config.jwt.secret)
        return res.json({
          success: true,
          token
        })
      }
    } catch (err) {
      err.statusCode = 500
      next(err)
    }
  }
}

const get = async (req, res, next) => {
  const error = validationResult(req)
  if (!error.isEmpty()) {
    const err = new Error('Validation failed')
    err.message = error.array()
    err.statusCode = 422
    next(err)
  } else {
    const email = req.user.email
    try {
      const user = await User.findOne({ email })
        .populate('room')
        .populate('room.id')
      if (!user) {
        const error = new Error('User not found')
        error.statusCode = 401
        next(error)
      } else {
        return res.json({
          success: true,
          data: {
            name: user.name,
            email: user.email,
            room: user.room
          }
        })
      }
    } catch (err) {
      err.statusCode = 500
      next(err)
    }
  }
}

const deleteUser = async (req, res, next) => {
  const error = validationResult(req)
  if (!error.isEmpty()) {
    const err = new Error('Validation failed')
    err.message = error.array()
    err.statusCode = 422
    next(err)
  } else {
    const email = req.body.email
    const password = req.body.password

    try {
      const user = await User.findOne({ email: email })
      if (!user) {
        const error = new Error('User not found')
        error.statusCode = 401
        next(error)
      } else {
        const valid = bcrypt.compareSync(password, user.password)
        if (!valid) {
          const error = new Error('Wrong password')
          error.statusCode = 401
          next(error)
        } else {
          const result = await User.findByIdAndDelete(user._id)
          const rooms = await Room.find({ owner: user._id })
          for (const room of rooms) {
            await Room.findByIdAndDelete(room._id)
          }
          return res.json({
            success: true
          })
        }
      }
    } catch (err) {
      err.statusCode = 500
      next(err)
    }
  }
}

module.exports = {
  signup,
  login,
  get,
  deleteUser
}
