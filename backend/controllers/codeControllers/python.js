const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to write Python code to a temporary file
const writeTempPythonFile = (code) => {
    const tempFilePath = path.join(__dirname, 'temp.py');
    fs.writeFileSync(tempFilePath, code);
    return tempFilePath;
};

const runCodePy = async (req, res, next) => {
    let code = req.body.code;
    const input = req.body.input || '';

    try {
        // Write the Python code to a temporary file
        const tempFilePath = writeTempPythonFile(code);

        // Execute the Python file and pass the input to the process
        const pythonCommand = `python ${tempFilePath}`;
        const childProcess = exec(pythonCommand, (err, stdout, stderr) => {
            // Use a callback function to handle process execution and errors
            if (err) {
                console.error("Execution error:", err);
                return res.status(500).json({
                    success: false,
                    error: stderr || err.message,  // Send stderr or the error message to frontend
                });
            }
            
            if (stderr) {
                // In case there's Python runtime error
                console.error("Python error:", stderr);
                return res.status(400).json({
                    success: false,
                    error: stderr,  // Send stderr as the error message
                });
            }

            // No errors, send back the output
            console.log("Command executed successfully. Output:", stdout);
            res.json({
                success: true,
                output: stdout
            });
        });

        // If there's input, write it to the stdin of the child process
        if (input) {
            childProcess.stdin.write(input + '\n');
            childProcess.stdin.end();
        }

    } catch (e) {
        console.error("Caught exception:", e);
        return res.status(500).json({ success:false, error: e.message });
    }
};

module.exports = {
    runCodePy
};
