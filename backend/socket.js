// socket.js
const socketio = require('socket.io')

module.exports = function (server) {
  const io = socketio(server, {
    cors: {
      //origin: 'http://localhost:3000',
      // origin: 'https://collaborative-code-editor-frontend.onrender.com',
      origin:'https://collaborative-code-editor-ig9wvgcfp.vercel.app',
      methods: ['GET', 'POST', 'DELETE']
    }
  })

  // Define WebSocket logic here
  io.on('connection', socket => {
    console.log('A user connected')
  })
  return io
}
