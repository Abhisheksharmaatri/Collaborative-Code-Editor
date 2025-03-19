const express = require('express')
const http = require('http')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const socketIo = require('socket.io') // Import socket.io
const socketHandler = require('./middleware/socketHandler')
const app = express()
const config = require('./config')
const path=require('path')

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: '*', // Replace with the allowed origin(s)
    methods: ['GET', 'POST'], // Specify the allowed methods
    credentials: true // Allow credentials (cookies, authorization headers)
  }
})

const userRoutes = require('./routes/user')
const roomRoutes = require('./routes/room')
const roomUserRoutes = require('./routes/room-user')
const roomCommentRoutes = require('./routes/comment')
const codeRoutes = require('./routes/code')
const error = require('./middleware/error');
const multer = require('multer');

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', '*'); // Replace with frontend URL for security
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).json({});
  }
  next();
});


app.use(cors(config.cors))
app.use(bodyParser.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

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
app.use('/code', codeRoutes)

app.use(error)
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log('Connected to database');
    server.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.log(err));
// WebSocket handling
socketHandler(server)

module.exports = app
