const express = require('express');
const router = express.Router();
const {
    check,
    body
} = require('express-validator');

const {
    runCode
} = require('../controllers/code');

router.post('/', [
    check('code')
        .trim()
        .isLength({
            min: 1
        })
        .withMessage('Please enter a code snippet'),
    check('language')
        .isIn(['javascript', 'python', 'cpp'])
        .withMessage('Unsupported language')
], runCode);

module.exports = router;