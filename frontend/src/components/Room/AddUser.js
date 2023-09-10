import React, { useEffect, useState } from 'react'

function AddUser (props) {
  function add (e) {
    e.preventDefault()
    const email = e.target.email.value
    const token = localStorage.getItem('token')
    const id = window.location.pathname.split('/')[3]

    const request = new Request(`http://localhost:4000/room/add-USER/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        email
      })
    })
    fetch(request)
      .then(response => {
        return response.json()
      })
      .then(data => {
        if (data.success) {
          //Set message
          props.setMessage('User added')
        } else {
          console.log('Error saving message:', data.message)
          props.setMessage(data.message)
        }
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }
  return (
    <div className='add-room-container'>
      <h3 className='add-room-heading'>Add User</h3>
      <form className='add-room-form' onSubmit={add}>
        <div className='add-room-form-email'>
          <label htmlFor='email'>Email </label>
          <input type='text' name='email' />
        </div>
        <div className='add-room-form-submit'>
          <input type='submit' value='Add' />
        </div>
      </form>
    </div>
  )
}

export default AddUser
