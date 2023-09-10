import React, { useEffect, useState } from 'react'

function ShowRoom (props) {
  return (
    <div className='show-room-container'>
      <div className='room'>
        <div className='room-fields'>
          <h3 className='room-name'>Name: {props.room.name}</h3>
          <p className='room-description'>
            Description: {props.room.description}
          </p>
        </div>
      </div>
      <div className='room-code'>
        <h3 className='room-code-heading'>Code</h3>
        <pre className='room-code-text'>{props.room.code}</pre>
      </div>
    </div>
  )
}

export default ShowRoom
