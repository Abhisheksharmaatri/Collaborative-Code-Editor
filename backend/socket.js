// socket.js
const socketio = require('socket.io')

module.exports = function (server) {
  const io = socketio(server, {
    cors: {
      //origin: 'http://localhost:3000',
      origin:'https://collaborative-code-editor-frontend.onrender.com',
      methods: ['GET', 'POST', 'DELETE']
    }
  })

  // Define WebSocket logic here
  io.on('connection', socket => {
    console.log('A user connected')
  })
  return io
}
