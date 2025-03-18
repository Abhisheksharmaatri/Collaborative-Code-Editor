import { useState } from 'react';
import { user, backend } from '../config.js';
import '../styles/Login.css';

function Signup(props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);  // State to handle the uploaded image
  const [message, setMessage] = useState(' ');
  const [nameError, setNameError] = useState('Name must be at least ' + user.name.length + ' characters long.');
  const [emailError, setEmailError] = useState('Email address should be properly formatted.');
  const [passwordError, setPasswordError] = useState('Password must be at least ' + user.password.length + ' characters long.');

  const checkName = () => {
    if (name.length < user.name.length) {
      setNameError('Name must be at least ' + user.name.length + ' characters long.');
      setMessage('Name Incorrect');
    } else {
      setNameError('');
    }
  };

  const checkEmail = () => {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValid) {
      setEmailError('Invalid email address.');
      setMessage('Email Incorrect');
    } else {
      setEmailError('');
    }
  };

  const checkPassword = () => {
    if (password.length < user.password.length) {
      setPasswordError('Password must be at least ' + user.password.length + ' characters long.');
      setMessage('Password Incorrect');
    } else {
      setPasswordError('');
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    checkName();
    checkEmail();
    checkPassword();

    // Only proceed if there are no errors
    if (nameError === '' && emailError === '' && passwordError === '') {
      const requestBody = {
        name: name,
        email: email,
        password: password
      }

      const url = backend.url + '/user/signup';
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(requestBody)
      })
      .then(response => {
        return response.json()
        })
        .then((data) => {
          if (data.success) {
            console.log(data.message);
            window.location.href = '/login';
          } else {
            setMessage(data.message);
          }
        })
        .catch((error) => {
          setMessage(error.message);
        });
    } else {
      setMessage('Please correct the errors above and try again.');
    }
  };
  const updateName = (e) => { 
    setName(e.target.value);
    setMessage('');
    setNameError('');
  }
  const updateEmail = (e) => { 
    setEmail(e.target.value);
    setMessage('');
    setEmailError('');
  }
  const updatePassword = (e) => {
    setPassword(e.target.value);
    setMessage('');
    setPasswordError('');
  }
  return (
    <div className="login__container">
      <h1>Signup</h1>
      <form onSubmit={handleSignup} className="login__form">
        <div className="form__group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={(e) => updateName(e)}
            onBlur={checkName}
          />
          <text className="message__danger">{nameError}</text>
        </div>
        <div className="form__group">
          <label htmlFor="email">Email address</label>
          <input
            type="text"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => updateEmail(e)}
            onBlur={checkEmail}
          />
          <text className="message__danger">{emailError}</text>
        </div>
        <div className="form__group">
          <label htmlFor="password">Password</label>
          <input
            type="text"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => updatePassword(e)}
            onBlur={checkPassword}
          />
          <text className="message__danger">{passwordError}</text>
        </div>
        <div className="form__message">
          <text className='message__danger'>{message}</text>
        </div>
        <div className="form__actions">
          <button type="submit" className="btn btn-primary">
            Signup
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              window.location.href = '/login';
            }}
          >
            To Log In Page
          </button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
