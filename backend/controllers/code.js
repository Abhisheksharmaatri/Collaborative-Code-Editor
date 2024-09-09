const { exec } = require('child_process');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

//Importing the code run function
const { runCodeJS } = require('./codeControllers/javascript')
const { runCodeCpp } = require('./codeControllers/cpp')
const {runCodePy}=require('./codeControllers/python')

// Async code execution
const runCode = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const language = req.body.language;
    if (language === 'cpp') {
        runCodeCpp(req, res, next);
    }
    else if (language === 'javascript') {
        runCodeJS(req,res,next)
    }
    else if (language === 'python') {
        runCodePy(req, res, next);
    }
    else {
        res.status(500).json({message:'Unknown Error'})
    }
};


module.exports = {
    runCode
};
