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
      'https://collaborative-code-editor-frontend.onrender.com',
      'https://collaborative-code-editor-frontend-code.onrender.com',
      'https://collaborative-code-editor-frontend.onrender.com',
      'https://collaborative-code-editor-ig9wvgcfp.vercel.app'
    ]
  },
  socket:{
    // url:'https://collaborative-code-editor-bdy7.onrender.com'
    // url:'https://collaborative-code-editor-frontend.onrender.com',
    url: 'http://localhost:4000'
  },
  db: {
    url: "mongodb+srv://alexwolfdog:alexwolfdog@code-collabortator.licgrid.mongodb.net/?retryWrites=true&w=majority&appName=Code-Collabortator",
    port:4000
  }
}
