// Code executor for cpp
const {exec}=require('child_process')
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// Async code execution

const runCodeCpp = async (req, res, next) => {

    let code = req.body.code;
    const language = req.body.language;
    const input = req.body.input || '';  // Get input from the request body

    try {
        const cppFilePath = path.join(__dirname, 'temp.cpp');
        const outputFilePath = path.join(__dirname, 'output.exe'); // Ensure .exe for Windows

        console.log("Creating C++ temp file");
        fs.writeFileSync(cppFilePath, code);
        console.log("C++ file written successfully");

        // Compile C++ code first
        const compileCommand = `g++ ${cppFilePath.replace(/\\/g, '/')} -o ${outputFilePath.replace(/\\/g, '/')}`;
        console.log("Compile Command:", compileCommand);

        exec(compileCommand, (compileErr, stdout, stderr) => {
            if (compileErr || stderr) {
                console.error("Compilation Error:", compileErr, stderr);
                return res.status(500).json({ success:false, error: stderr || compileErr.message });
            }

            console.log("Compilation successful. Now executing the file.");
            // Execute the compiled output and send input via stdin
            const execProcess = exec(outputFilePath, (execErr, execStdout, execStderr) => {
                if (execErr || execStderr) {
                    console.error("Execution Error:", execErr, execStderr);
                    return res.status(500).json({success:false,  error: execStderr || execErr.message });
                }

                console.log("Execution successful. Output:", execStdout);
                res.json({ success: true, output: execStdout });

                // Cleanup files
                console.log("Deleting temp files...");
                fs.unlinkSync(cppFilePath);
                fs.unlinkSync(outputFilePath);
            });

            // Provide input to the C++ program
            if (input) {
                execProcess.stdin.write(input);
                execProcess.stdin.end(); // Close stdin after providing the input
            }
        });
    }
    
    catch (e) {
        console.error("Caught exception:", e);
        return res.status(500).json({ success:false, error: e.message });
    }

    
};



// Handle command execution callback
const handleCommandExecution = (err, stdout, stderr, res) => {
    console.log(stderr)
    console.log(stdout)
    if (err) {
        console.error("Error:", err);
        return res.status(500).json({ error: err.message });  // Pass back the error message
    }
    
    if (stderr) {
        console.error("Standard Error:", stderr);
        return res.status(400).json({ error: stderr });  // Pass back the stderr if there is any
    }

    console.log("Command executed successfully. Output:", stdout);
    res.json({ success: true, output: stdout });
};

module.exports = {
    runCodeCpp
}