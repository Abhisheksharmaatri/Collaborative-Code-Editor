const {
    validationResult
} = require('express-validator')
const mongoose = require('mongoose')
const Room = require('../models/room')
const User = require('../models/user')

const config = require('../config')

const socket = require('socket.io-client')(config.socket.url) // Replace with your server's URL


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
            const user = await User.findOne({
                email: email
            })
            if (!user) {
                const error = new Error('User not found')
                error.statusCode = 401
                next(error)
            } else {
                const room = await Room.findById(roomId)
                    .populate('users')
                    .populate('owner')
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
                    const updatedRoom = await Room.findById(roomId)
                        .populate('users', 'name email')
                        .populate('owner', 'name email')
                    console.log('Updated room: ', updatedRoom)
                    await user.save()
                    await socket.emit('user-added', {
                        roomId: updatedRoom._id,
                        user: {
                            id: user._id,
                            name: user.name,
                            email: user.email
                        },
                        message: 'User added'
                    })
                    return res.json({
                        success: true,
                        user: {
                            id: user._id,
                            name: user.name,
                            email: user.email
                        }
                    })
                }
            }
        } catch (err) {
            err.statusCode = 500
            next(err)
        }
    }
};

const removeUser = async (req, res, next) => {
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
            const room = await Room.findById(roomId)
                .populate('users')
                .populate('owner');
            if (!room) {
                const error = new Error('Room not found');
                error.statusCode = 401;
                next(error);
            } else if (room.owner._id.toString() !== req.user._id.toString()) {
                const error = new Error('Not authorized');
                error.statusCode = 401;
                next(error);
            } else if (!room.users.find(user => user.email === email)) {
                const error = new Error('User is not in room');
                error.statusCode = 401;
                next(error);
            } else {
                const user = await User.findOne({
                    email: email
                });
                if (!user) {
                    const error = new Error('User not found');
                    error.statusCode = 401;
                    next(error);
                }
                console.log(user)
                room.users.pull({id:user._id})
                await room.save()
                user.room.pull(roomId)
                await user.save()
                await socket.emit('user-removed', {
                    roomId: room._id,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email
                    },
                    message: 'User removed'
                })
                return res.json({
                    success: true
                })

            }
        } catch (err) {
            err.statusCode = 500;
            console.log(err)
            next(err);
        }
    }
}

module.exports = {
    addUser,
    removeUser
};
