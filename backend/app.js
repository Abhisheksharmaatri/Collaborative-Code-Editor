const express = require('express')
const http = require('http')
const cors = require('cors')
const bodyParser = require('body-parser')
const config = require('./config')
const mongoose = require('mongoose')
const socketIo = require('socket.io') // Import socket.io
const socketHandler = require('./middleware/socketHandler')
const app = express()

const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: config.cors.origin, // Replace with the allowed origin(s)
    methods: ['GET', 'POST'], // Specify the allowed methods
    credentials: true // Allow credentials (cookies, authorization headers)
  }
})

const config = {
  db: {
    url: process.env.DB_URL
  },
  port: process.env.PORT
};

const userRoutes = require('./routes/user')
const roomRoutes = require('./routes/room')
const roomUserRoutes = require('./routes/room-user')
const roomCommentRoutes = require('./routes/comment')
const error = require('./middleware/error')

app.use(cors(config.cors))
app.use(bodyParser.json())

app.use((req, res, next) => {
  console.log('Request: ', req.body)
  //Params
  console.log('Params: ', req.params)
  next()
})

app.use('/user', userRoutes)
app.use('/room', roomRoutes)
app.use('/room', roomUserRoutes)
app.use('/room', roomCommentRoutes)

app.use(error)

mongoose
  .connect(config.db.url)
  .then(result => {
    console.log('Connected to database');
    server.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  })
  .catch(err => console.log(err));

// WebSocket handling
socketHandler(server)

module.exports = app
