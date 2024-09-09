import React, { useState, useEffect, useRef } from 'react';
import Actions from './Actions';

const CodeEditor = (props) => {
  const [code, setCode] = useState(props.code);
  const textareaRef = useRef(null); // Create a ref for the textarea

  useEffect(() => {
    setCode(props.code);
  }, [props.code]);

  const handleCodeChange = (event) => {
    console.log('Code change detected:', event.target.value);
    setCode(event.target.value);
    props.socket.emit('code-updated', { code: event.target.value, id: props.roomId });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault(); // Prevent the default tab behavior
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Insert four spaces (or a tab character) at the cursor position
      textarea.value = textarea.value.substring(0, start) + '    ' + textarea.value.substring(end);

      // Move the cursor after the inserted spaces
      textarea.selectionStart = textarea.selectionEnd = start + 4;

      // Update the code state with the new value
      setCode(textarea.value);
    }
  };

  useEffect(() => {
    const handleCodeUpdate = (data) => {
      console.log('Received code update:', data.code);
      setCode(data.code);
    };

    props.socket.on('code-updated', (data) => {
      console.log('Code update detected:', data.id);
      console.log('Room ID:', props.roomId);
      if (data.id === props.roomId) {
        handleCodeUpdate(data);
      }
    });

    return () => {
      props.socket.off('code-updated', handleCodeUpdate);
    };
  }, [props.socket, props.roomId]);

  return (
    <div className='code__editor'>
      <textarea
        ref={textareaRef} // Attach the ref to the textarea
        className="code__input"
        value={code}
        onChange={handleCodeChange}
        // disable spellCheck
        spellCheck={false}
        // disable autoCapitalize
        autoCapitalize='off'
        // disable autoCorrect
        autoCorrect='off'
        // disable autoComplete
        autoComplete='off'
        // disable autoSave
        autoSave='off'
        // disable autoFill
        autoFill='off'
        // disable the tab switch
        onKeyDown={handleKeyDown}
      />
      <div className='editor__controls'>
        <button onClick={() => props.save(code)} className='btn btn-primary'>Save</button>
        <button onClick={() => props.runCode(code)} className='btn btn-primary'>RUN</button>
        <Actions roomId={props.roomId} setMessage={props.setMessage} handleCodeChange={handleCodeChange} setLanguage={props.setLanguage} />
      </div>
    </div>
  );
};

export default CodeEditor;
