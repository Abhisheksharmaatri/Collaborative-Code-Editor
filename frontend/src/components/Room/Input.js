// A place to write input and set it

import React from 'react';

function Input(props) {
    return (
        <div className="input__container">
            <h4>Input</h4>
            <textarea onChange={(e) => props.setInput(e.target.value)} value={props.input}></textarea>
        </div>
    )
}

export default Input;