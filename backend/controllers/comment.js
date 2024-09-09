const {
    validationResult
} = require('express-validator')
const mongoose = require('mongoose')
const Room = require('../models/room')
const User = require('../models/user')

const config = require('../config')

const socket = require('socket.io-client')(config.socket.url) // Replace with your server's URL


const addComment = async (req, res, next) => {
    console.log("error")
    const error = validationResult(req)
    if (!error.isEmpty()) {
        const err = new Error('Validation failed')
        err.message = error.array()
        err.statusCode = 422
        next(err)
    } else {
        const comment = req.body.comment
        const roomId = req.params.id
        try {
            const room = await Room.findById(roomId)
            if (!room) {
                const error = new Error('Room not found')
                console.log("error room not found")
                error.statusCode = 401
                next(error)
            } else if (
                room.owner._id.toString() !== req.user._id.toString() &&
                room.users.indexOf(req.user._id) === -1
            ) {
                const error = new Error('Not authorized')
                console.log("error not authorized")
                error.statusCode = 401
                next(error)
            } else {
                room.chat.push({
                    sender: new mongoose.Types.ObjectId(req.user._id),
                    comment: comment
                })
                await room.save()
                await socket.emit('comment-added', {
                    id: room._id,
                    comment: comment,
                    sender: {
                        name: req.user.name,
                        email: req.user.email
                    },
                    message: 'Comment added'
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

const deleteComment = async (req, res, next) => {
    const error = validationResult(req)
    if (!error.isEmpty()) {
        const err = new Error('Validation failed')
        err.message = error.array()
        err.statusCode = 422
        next(err)
    } else {
        const commentId = req.body.commentId
        const roomId = req.params.id
        try {
            const room = await Room.findById(roomId)
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
                const comment = room.chat.id(commentId)
                if (!comment) {
                    const error = new Error('Comment not found')
                    error.statusCode = 401
                    next(error)
                } else if (comment.sender.toString() !== req.user._id.toString()) {
                    const error = new Error('Not authorized')
                    error.statusCode = 401
                    next(error)
                } else {
                    room.chat.pull(commentId)
                    await room.save()
                    await socket.emit('comment-deleted', {
                        id: room._id,
                        commentId: commentId,
                        message: 'Comment deleted'
                    })
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
};


const updateComment = async (req, res, next) => {
    const error = validationResult(req)
    if (!error.isEmpty()) {
        const err = new Error('Validation failed')
        err.message = error.array()
        err.statusCode = 422
        next(err)
    } else {
        const commentId = req.body.commentId
        const roomId = req.params.id
        try {
            const room = await Room.findById(roomId)
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
                const comment = room.chat.id(commentId)
                if (!comment) {
                    const error = new Error('Comment not found')
                    error.statusCode = 401
                    next(error)
                } else if (comment.sender.toString() !== req.user._id.toString()) {
                    const error = new Error('Not authorized')
                    error.statusCode = 401
                    next(error)
                } else {
                    comment.comment = req.body.comment
                    await room.save()
                    await socket.emit('comment-updated', {
                        id: room._id,
                        commentId: commentId,
                        comment: req.body.comment,
                        message: 'Comment updated'
                    })
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
    addComment,
    deleteComment,
    updateComment
}
