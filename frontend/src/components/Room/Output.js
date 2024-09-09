// A Place to output the output of code recived from the backend

import React, { useEffect } from 'react';

function Output(props) {
    // Add such that it auto updates when the output changes
    useEffect(() => {
        console.log(props.output);
    }, [props.output]);


    return (
        <div className="output__container">
            <h4>Output</h4>
            <pre>{props.output}</pre>
        </div>
    )
}

export default Output;