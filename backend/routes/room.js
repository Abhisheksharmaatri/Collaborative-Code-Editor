const express = require('express')
const { check, body } = require('express-validator')

const config = require('../config')
const auth = require('../middleware/auth')
const router = express.Router()

const { create, get, update, remove, addUser } = require('../controllers/room')

router.post(
  '/create',
  [
    check(
      'name',
      'Please enter a name with only text and at least 5 characters'
    )
      .trim()
      .isLength({ min: config.room.name.length })
      .isAlphanumeric(),
    check('description')
      .isLength({ min: config.room.description.length })
      .withMessage(
        'Please enter a description with only text and at least 10 characters'
      )
      .trim()
  ],
  auth,
  create
)

router.get('/get/:id', auth, get)

router.put(
  '/update/:id',
  [
    check(
      'name',
      'Please enter a name with only text and at least 5 characters'
    )
      .trim()
      .isLength({ min: config.room.name.length })
      .isAlphanumeric(),
    check('description')
      .isLength({ min: config.room.description.length })
      .withMessage(
        'Please enter a description with only text and at least 10 characters'
      )
      .trim()
  ],
  auth,
  update
)

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

router.delete('/delete/:id', auth, remove)

module.exports = router
