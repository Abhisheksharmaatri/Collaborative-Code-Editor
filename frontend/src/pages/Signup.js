import {
    react,
    useState
} from 'react';

import {
    user,
    room,
    backend
} from '../config.js';

import '../styles/Login.css';

function Signup(props) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [nameError, setNameError] = useState('Name must be at least '+user.name.length+' characters long.')
    const [emailError, setEmailError] = useState('Email address should be properly formatted.')
    const [passwordError, setPasswordError] = useState('Password must be at least'+user.password.length+' characters long.')

    const checkName = () => {
        if (name.length < user.name.length) {
            setNameError('Name must be at least '+user.name.length+' characters long..')
            setMessage('Name Incorrect')
        } else {
            setNameError('')
        }
    };

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
            setPasswordError('Password must be at least '+user.password.length+' characters long.')
            setMessage('Password Incorrect')
        } else {
            setPasswordError('')
        }
    }

    const handleSignup = e => {
        checkName()
        checkEmail()
        checkPassword()

        if (nameError === '' && emailError === '' && passwordError === '') { 
            const requestBody = {
                name: name,
                email: email,
                password: password
            }
            const url = backend.url + 'user/signup'
            fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                })
                .then(response => {
                    console.log(response)
                    return response.json()
                })
                .then(data => {
                    if (data.success) {
                        console.log(data.message)
                        window.location.href = '/login'
                    } else {
                        setMessage(data.message)
                    }
                })
            .catch(error => {
                setMessage(error.message)
            })
        }
    }

    return (
        <div className="container">
            <h1>Signup</h1>
            <form onSubmit={handleSignup}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" className="form-control" value={name} onChange={e => setName(e.target.value)} onBlur={checkName} />
                    <small className="text-danger">{nameError}</small>
                </div>
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
                    <button type="submit" className="btn btn-primary">Signup</button>
                    <button className="btn btn-primary" onClick={()=>{window.location.href='/login'}}>To Log In Page</button>
                </div>
                <div className='form-info'>
                    <p className="text-danger">{message}</p>
                    <h1>Project Developer: Abhishek Sharma</h1>
                    <h2>Contact: abhiatriat2004@gmail.com</h2>
                </div>
            </form>
            <p className="text-danger">{message}</p>
        </div>
    )
}

export default Signup;