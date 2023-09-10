const { validationResult } = require('express-validator')
const mongoose = require('mongoose')
const Room = require('../models/room')
const User = require('../models/user')

const config = require('../config')

const socket = require('socket.io-client')('http://localhost:4000') // Replace with your server's URL

const create = async (req, res, next) => {
  const error = validationResult(req)
  if (!error.isEmpty()) {
    const err = new Error('Validation failed')
    err.message = error.array()
    err.statusCode = 422
    next(err)
  } else {
    const name = req.body.name
    const description = req.body.description
    let owner = req.user.id
    try {
      const room = new Room({
        name: name,
        description: description,
        owner: new mongoose.Types.ObjectId(owner),
        code: '',
        users: [],
        requests: []
      })
      const result = await room.save()
      const user = await User.findById(owner)
      user.room.push({
        id: new mongoose.Types.ObjectId(result._id),
        role: 'owner'
      })
      await user.save()
      return res.json({
        success: true
      })
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
    const id = req.params.id
    try {
      const room = await Room.findById(id)
        .populate('owner', 'name email')
        .populate('users', 'name email')

      if (!room) {
        const error = new Error('Room not found')
        error.statusCode = 401
        next(error)
      } else if (
        room.owner._id.toString() !== req.user._id.toString() &&
        !room.users.indexOf(req.user._id)
      ) {
        const error = new Error('Not authorized')
        error.statusCode = 401
        next(error)
      } else {
        return res.json({
          success: true,
          data: room
        })
      }
    } catch (err) {
      err.statusCode = 500
      next(err)
    }
  }
}

const update = async (req, res, next) => {
  const error = validationResult(req)
  if (!error.isEmpty()) {
    const err = new Error('Validation failed')
    err.message = error.array()
    err.statusCode = 422
    next(err)
  } else {
    const name = req.body.name
    const description = req.body.description
    const code = req.body.code
    const id = req.params.id
    try {
      const room = await Room.findById(id)
      if (!room) {
        const error = new Error('Room not found')
        error.statusCode = 401
        next(error)
      } else if (
        room.owner._id.toString() !== req.user._id.toString() &&
        room.users.indexOf(req.user._id) === -1
      ) {
        const error = new Error('Not authorized')
        error.statusCode = 401
        next(error)
      } else {
        room.name = name
        room.description = description
        room.code = code
        await room.save()
        //Send the message on update
        await socket.emit('room-updated', {
          id: room._id,
          name: room.name,
          description: room.description,
          code: room.code,
          message: 'Room updated'
        })
        console.log('Message sent')
        return res.json({
          success: true
        })
      }
    } catch (err) {
      err.statusCode = 500
      next(err)
    }
  }
}

const remove = async (req, res, next) => {
  const error = validationResult(req)
  if (!error.isEmpty()) {
    const err = new Error('Validation failed')
    err.message = error.array()
    err.statusCode = 422
    next(err)
  } else {
    const id = req.params.id
    try {
      const room = await Room.findById(id)
      if (!room) {
        const error = new Error('Room not found')
        error.statusCode = 401
        next(error)
      } else if (
        room.owner._id.toString() !== req.user._id.toString() &&
        room.users.indexOf(req.user._id) === -1
      ) {
        const error = new Error('Not authorized')
        error.statusCode = 401
        next(error)
      } else {
        const result = await Room.findByIdAndDelete(id)
        const owner = await User.findById(room.owner)
        owner.room.pull({ id: id })
        await owner.save()
        room.users.forEach(async user => {
          const owner = await User.findById(user)
          owner.room.pull({ id: id })
          await owner.save()
        })
        return res.json({
          success: true
        })
      }
    } catch (err) {
      err.statusCode = 500
      next(err)
    }
  }
}

const addUser = async (req, res, next) => {
  const error = validationResult(req)
  if (!error.isEmpty()) {
    const err = new Error('Validation failed')
    err.message = error.array()
    err.statusCode = 422
    next(err)
  } else {
    const email = req.body.email
    const roomId = req.params.id
    try {
      const user = await User.findOne({ email: email })
      if (!user) {
        const error = new Error('User not found')
        error.statusCode = 401
        next(error)
      } else {
        const room = await Room.findById(roomId).populate('users')
        if (!room) {
          const error = new Error('Room not found')
          error.statusCode = 401
          next(error)
        } else if (room.owner._id.toString() !== req.user._id.toString()) {
          const error = new Error('Not authorized')
          error.statusCode = 401
          next(error)
        } else if (room.users.find(user => user.email === email)) {
          const error = new Error('User already in room')
          error.statusCode = 401
          next(error)
        } else {
          room.users.push(new mongoose.Types.ObjectId(user._id))
          await room.save()
          user.room.push({
            id: new mongoose.Types.ObjectId(room._id),
            role: 'user'
          })
          await user.save()
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
  create,
  get,
  update,
  remove,
  addUser
}
