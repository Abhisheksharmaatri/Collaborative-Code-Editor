import React, { useState, useEffect } from 'react'

function CreateRoom () {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')

  function createRoom (e) {
    const token = localStorage.getItem('token')
    e.preventDefault()
    const name = e.target.name.value
    const description = e.target.description.value
    const request = new Request('http://localhost:4000/room/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name, description })
    })
    fetch(request)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        // If the response is JSON, use .json()
        if (response.headers.get('content-type').includes('application/json')) {
          return response.json()
        } else {
          // If the response is plain text, use .text()
          return response.text()
        }
      })
      .then(data => {
        console.log(data)
        if (data.success) {
          setMessage('success')
        } else {
          setMessage(data.message)
          console.log('Error creating room:', data.message)
        }
      })
      .catch(error => {
        console.error('Error creating room:', error)
      })
  }

  return (
    <div className='create-room-container'>
      <h3 className='create-room-heading'>Create Room</h3>
      <form className='create-room-form' onSubmit={createRoom}>
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
          <label htmlFor='description' className='form-label'>
            Description:
          </label>
          <input
            type='text'
            id='description'
            className='form-input'
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <button type='submit' className='form-submit'>
          Create Room
        </button>
      </form>
      <p className='create-room-message'>{message}</p>
    </div>
  )
}

export default CreateRoom
