import React, { useEffect, useState } from 'react'

function Users (props) {
  return (
    <div className='users-container'>
      <h3 className='users-heading'>Users</h3>
      <div className='owner-container'>
        <h3 className='users-heading'>Owner</h3>
        <div className='user' key={props.owner._id}>
          <p className='user-name'>Name: {props.owner.name}</p>
          <p className='user-email'>Email: {props.owner.email}</p>
        </div>
      </div>
      {props.users.length > 0 ? (
        props.users.map(user => (
          <div className='user' key={user._id}>
            <p className='user-name'>Name: {user.name}</p>
            <p className='user-email'>Email: {user.email}</p>
          </div>
        ))
      ) : (
        <p>No other users in this room</p>
      )}
    </div>
  )
}

export default Users
