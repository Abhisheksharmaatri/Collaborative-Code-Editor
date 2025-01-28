const express = require('express')
const { check, body } = require('express-validator')

const config = require('../config')
const auth = require('../middleware/auth')
const router = express.Router()

const upload=require('../middleware/upload')

const { signup, login, get, deleteUser } = require('../controllers/user')

router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),

    body('password')
      .trim()
      .isLength({ min: config.user.password.length })
      .withMessage(
        'Please enter a password with only numbers and text and at least 5 characters'
      ),

    body('name', 'Please enter a name with only text and at least 3 characters')
      .isAlphanumeric()
      .trim()
  ],
  signup
)

router.post(
  '/login',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),

    body(
      'password',
      'Please enter a password with only numbers and text and at least 5 characters'
    )
      .trim()
      .isLength({ min: config.user.password.length })
      .isAlphanumeric()
  ],
  login
)

router.get('/get-user', auth, get)

router.delete(
  '/delete',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),

    body(
      'password',
      'Please enter a password with only numbers and text and at least 5 characters'
    )
      .trim()
      .isLength({ min: config.user.password.length })
      .isAlphanumeric()
  ],
  deleteUser
)

module.exports = router

//TODO: implement logout
// TODO: implement forgot password
//TODO: implment delete account
