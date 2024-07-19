import {
    react,
    useState
} from 'react';

import {
    user,
    room,
    backend
} from '../config.js';

//add Css
import '../styles/Login.css';

function Login(props) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [emailError, setEmailError] = useState('Email address should be properly formatted.')
    const [passwordError, setPasswordError] = useState('Password must be at least '+user.password.length+' characters long.')

    const checkEmail = () => {
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        if (!emailValid) {
            setEmailError('Invalid email address.')
            setMessage('Email Incorrect')
        } else {
            setEmailError('')
        }
    }

    const checkPassword = () => {
        if (password.length < user.password.length) {
            setPasswordError('Password must be at least 8 characters long.')
            setMessage('Password Incorrect')
        } else {
            setPasswordError('')
        }
    }

    const handleLogin = (e) => {
        e.preventDefault()
        checkEmail()
        checkPassword()

        if (emailError === '' && passwordError === '') {
            const requestBody = {
                email: email,
                password: password
            }
            const url = backend.url + 'user/login'
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
                .then(data => {
                    if (data.success) {
                        localStorage.setItem('token', data.token)
                        setMessage(data.message)
                        window.location.href = '/home'
                    } else {
                        setMessage(data.message)
                    }
                })
                .catch(error => {
                    setMessage('An error occurred, please try again.')
                })
        }
    }

    return (
        <div className="container">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input type="text" id="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} onBlur={checkEmail} />
                    <small className="text-danger">{emailError}</small>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="text" id="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} onBlur={checkPassword} />
                    <small className="text-danger">{passwordError}</small>
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">Login</button>
                    <button className="btn btn-primary" onClick={()=>{window.location.href='/signup'}}>To Sign Up Page</button>
                </div>
                <div className='form-info'>
                    <p className="text-danger">{message}</p>
                    <h1>Project Developer: Abhishek Sharma</h1>
                    <h2>Contact: abhiatriat2004@gmail.com</h2>
                </div>
            </form>
        </div>
    )
}

export default Login;