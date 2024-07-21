module.exports = {
  user: {
    name: {
      length: 5
    },
    password: {
      saltRounds: 10,
      length: 8
    }
  },
  room: {
    name: {
      length: 5
    },
    description: {
      length: 5
    }
  },
  jwt: {
    secret: 'secret'
  },
  port: 4000,
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://86s0767f-3000.inc1.devtunnels.ms',
<<<<<<< HEAD
      'https://collaborative-code-editor-frontend.onrender.com/'
=======
      'https://collaborative-code-editor-frontend.onrender.com'
>>>>>>> ba246cf07a0242f05b010549eebd8724da2b06b6
    ]
  }
}
