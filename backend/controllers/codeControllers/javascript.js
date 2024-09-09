const vm = require('vm');

const runCodeJS = async (req, res, next) => {
    let code = req.body.code;
    const input = req.body.input || '';

    try {
        // Replace 'print' with 'console.log'
        code = code.replace(/\bprint\b/g, 'console.log');

        // Prepare input by splitting it into an array of lines
        const inputArray = input.split('\n');

        // Create a script with injected input as an array
        const inputPlaceholder = `
            const input = ${JSON.stringify(inputArray)};
            (function run() {
                ${code}
            })();
        `;

        console.log('Running code:', inputPlaceholder);

        // Create a new sandboxed context
        const sandbox = { console, inputArray }; // You can add more global variables to the context if needed

        // Run the code using the VM module
        const script = new vm.Script(inputPlaceholder);
        const context = new vm.createContext(sandbox); // Create a sandbox environment

        console.log('Running script in sandbox...');

        // Capture the output
        let output = '';
        const log = (...args) => {
            output += args.join(' ') + '\n';
        };

        // Override console.log within the sandbox to capture output
        sandbox.console = { log };

        console.log('Sandbox:', sandbox.console);

        // Run the script in the sandbox
        script.runInContext(context);

        console.log('Script executed successfully.');
        console.log('Output:', output);

        // Return the output to the client
        return res.json({ success:true, output:output });
    } catch (e) {
        console.error("Caught exception:", e);
        return res.status(500).json({ error: e.message });
    }
};

module.exports = {
    runCodeJS
};