import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-monokai';
import Actions from './Actions';

const CodeEditor = (props) => {
  const [code, setCode] = useState(props.code);
  const [language, setLanguage] = useState('javascript');

  useEffect(() => {
    setCode(props.code);
  }, [props.code]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    // Emit code update to socket
    props.socket.emit('codeUpdate', { code: newCode });
  };

  useEffect(() => {
    props.socket.on('codeUpdated', (newCode) => {
      setCode(newCode);
    });
    props.socket.on('codeUpdate', (newCode) => {
      console.log('Code updated:', newCode);
      setCode(newCode);
    });

    return () => {}; // No need to clean up socket here
  }, []);

  return (
    <div className='code__editor'>
      <AceEditor
        mode={language}
        theme="monokai"
        onChange={handleCodeChange} // Directly emit socket event on change
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
        value={code}
        style={{
          width: '100%',
          margin: '10px',
          height: '95%',
          borderRadius: '8px',
          fontSize: '16px',
        }}
      />
      <div className="form-actions">
        <select
          value={language}
          onChange={(e) => { setLanguage(e.target.value) }}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
        <button onClick={() => props.save(code)} className='btn-primary'>Save</button>
        <Actions roomId={props.roomId} setMessage={props.setMessage} />
      </div>
    </div>
  );
};

export default CodeEditor;
