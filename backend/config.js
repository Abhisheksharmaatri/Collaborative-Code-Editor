module.exports = {
  db: {
    url: 'mongodb+srv://Abhishek:abhaykush@article.40hpefr.mongodb.net/?retryWrites=true&w=majority'
  },
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
    origin: 'http://localhost:3000'
  }
}
