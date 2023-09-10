const express = require('express')
const http = require('http')
const cors = require('cors')
const bodyParser = require('body-parser')
const config = require('./config')
const mongoose = require('mongoose')
const socketIo = require('socket.io') // Import socket.io

const app = express()

const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // Replace with the allowed origin(s)
    methods: ['GET', 'POST'], // Specify the allowed methods
    credentials: true // Allow credentials (cookies, authorization headers)
  }
})

const userRoutes = require('./routes/user')
const roomRoutes = require('./routes/room')
const error = require('./middleware/error')

app.use(cors(config.cors))
app.use(bodyParser.json())

app.use((req, res, next) => {
  console.log('Request: ', req.body)
  next()
})

app.use('/user', userRoutes)
app.use('/room', roomRoutes)

app.use(error)

mongoose
  .connect(config.db.url)
  .then(result => {
    console.log('Connected to database')
    server.listen(config.port, () => {
      console.log('Server is running on port 4000')
    })
  })
  .catch(err => console.log(err))

// WebSocket handling
io.on('connection', socket => {
  console.log('A user connected to WebSocket')

  socket.on('message', msg => {
    console.log('message: ' + msg)
    io.emit('message', msg)
  })

  socket.on('room-updated', room => {
    console.log('room-updated: ' + room)
    io.emit('room-updated', room)
  })

  // Add WebSocket event handlers here
  // For example:
  // socket.on('chat message', (msg) => {
  //   console.log('message: ' + msg);
  //   io.emit('chat message', msg);
  // });

  socket.on('disconnect', () => {
    console.log('A user disconnected from WebSocket')
  })
})

module.exports = app
