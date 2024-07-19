const express = require('express')
const {
    check,
    body
} = require('express-validator')

const config = require('../config')
const auth = require('../middleware/auth')
const router = express.Router();


const {
    addComment,
    deleteComment,
    updateComment
} = require('../controllers/comment');

router.post(
    '/comment/add/:id',
    [
        check('comment')
        .isLength({
            min: 1
        })
        .withMessage(
            'Please enter a comment with only text and at least 5 characters'
        )
        .trim()
    ],
    auth,
    addComment
)

router.delete(
    '/comment/remove/:id',
    [
        check('commentId')
        .isLength({
            min: 1
        })
        .withMessage(
            'Please enter a comment with only text and at least 5 characters'
        )
        .trim()
    ],
    auth,
    deleteComment
);

module.exports=router;