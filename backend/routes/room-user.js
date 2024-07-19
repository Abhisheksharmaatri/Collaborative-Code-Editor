
const express = require('express')
const {
  check,
  body
} = require('express-validator')

const config = require('../config')
const auth = require('../middleware/auth')
const router = express.Router();
const {
    addUser,
    removeUser
} = require('../controllers/room-user');


router.put(
    '/add-user/:id',
    [
        check('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail()
    ],
    auth,
    addUser
)

router.put(
    '/remove-user/:id',
    [
        check('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail()
    ],
    auth,
    removeUser
);

module.exports=router;