import React, { useState } from 'react'
import '../styles/Signup.css'

function Signup () {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSignup = e => {
    e.preventDefault()
    // Create the request body object
    const requestBody = {
      name: name,
      email: email,
      password: password
    }

    // Make the POST request to the server
    fetch('http://localhost:4000/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        if (data.success) {
          // Signup successful, redirect to login page
          setMessage(data.message)
          window.location.href = '/login'
        } else {
          // Signup failed, display error message
          console.log(data.message)
          setMessage(data.message)
        }
      })
      .catch(error => {
        // Handle any errors that occurred during the fetch
        console.error('Error:', error)
      })
  }

  const passwordSubmit = e => {
    if (e.key === 'Enter') {
      handleSignup(e)
    }
  }

  return (
    <div className='signup-container'>
      <h1 className='signup-heading'>Signup</h1>
      <form className='signup-form'>
        <div className='form-group'>
          <label htmlFor='name' className='form-label'>
            Name:
          </label>
          <input
            type='text'
            id='name'
            className='form-input'
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='email' className='form-label'>
            Email:
          </label>
          <input
            type='text'
            id='email'
            className='form-input'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password' className='form-label'>
            Password:
          </label>
          <input
            type='password'
            id='password'
            className='form-input'
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={passwordSubmit}
          />
        </div>
        <button className='signup-button' onClick={handleSignup}>
          Signup
        </button>
      </form>
      <p className='login-message'>{message}</p>
      <button
        className='signup-button'
        onClick={() => (window.location.href = '/login')}
      >
        Login
      </button>
    </div>
  )
}

export default Signup
