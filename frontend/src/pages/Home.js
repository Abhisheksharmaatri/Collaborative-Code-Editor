import React from 'react'

import '../styles/Home.css'

import User from '../components/User'
import CreateRoom from '../components/CreateRoom'

function Home () {
  return (
    <div className='Home-container'>
      <h1 className='Home-heading'>Home</h1>
      <User />
    </div>
  )
}

export default Home
