import React, { useEffect, useState } from 'react'

function EditRoom (props) {
  const save = e => {
    e.preventDefault()

    const name = e.target.name.value
    const description = e.target.description.value
    const code = e.target.code.value

    const token = localStorage.getItem('token')
    const id = window.location.pathname.split('/')[3]
    const request = new Request(`http://localhost:4000/room/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name,
        description,
        code
      })
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
        if (data.success) {
          props.setIsEditing(false)
        } else {
          console.log('Error saving message:', data.message)
        }
      })
  }

  return (
    <div className='edit-room-container'>
      <form className='room-form' onSubmit={save}>
        <div className='room-form-fields'>
          <div className='room-form-name'>
            <label htmlFor='name'>Name</label>
            <input type='text' name='name' defaultValue={props.room.name} />
          </div>
          <div className='room-form-description'>
            <label htmlFor='description'>Description</label>
            <input
              type='text'
              name='description'
              defaultValue={props.room.description}
            />
          </div>
        </div>
        <div className='room-form-code'>
          <label htmlFor='code'>Code</label>
          <textarea
            name='code'
            defaultValue={props.room.code}
            rows={40} // Adjust the number of rows as needed
          />
        </div>
        <div className='room-form-submit'>
          <input type='submit' defaultValue='save' />
        </div>
      </form>
    </div>
  )
}

export default EditRoom
