const config = require('../config')
const mocha = require('mocha')
const chai = require('chai')
const expect = chai.expect
const supertest = require('supertest')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')

const app = require('../app')

const request = supertest(app)

describe('User', () => {
  // Define the "before" hook to connect to the database before running tests
  before(done => {
    // Assuming you're using Mongoose for database connection
    mongoose.connect(config.db.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    mongoose.connection.once('connected', () => {
      console.log('Connected to the database')
      done()
    })

    mongoose.connection.on('error', error => {
      console.error('Database connection error:', error)
      done(error)
    })
  })

  // Your Mocha tests here
  //   describe('POST /user/signup', () => {
  //     it('should create a new user', async () => {
  //       // Your test logic here
  //     });
  //   });

  describe('POST /user/login', () => {
    it('should login a user', async () => {
      const res = await request.post('/user/login').send({
        email: 'test@email.com',
        password: 'password'
      })
      if (res.body.message) {
        console.log('message: ', res.body.message)
      }
      expect(res.statusCode).to.equal(200)
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.property('success').to.equal(true)
      expect(res.body).to.have.property('token')
    })
  })

  describe('DELETE /user/delete', () => {
    it('should delete a user', async () => {
      const res = await request.delete('/user/delete').send({
        email: 'test@email.com',
        password: 'password'
      })
      if (res.body.message) {
        console.log('message: ', res.body.message)
      }
      expect(res.statusCode).to.equal(200)
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.property('success').to.equal(true)
    })
  })

  // Define the "after" hook to disconnect from the database after all tests have completed
  after(done => {
    // Assuming you're using Mongoose for database connection
    const mongoose = require('mongoose')
    mongoose.connection.close(() => {
      console.log('Disconnected from the database')
      done()
    })
  })
})

// const mocha = require('mocha')
// const chai = require('chai')
// const expect = chai.expect
// const supertest = require('supertest')
// const User = require('../models/user')
// const jwt = require('jsonwebtoken')

// const app = require('../app')

// const request = supertest(app)

// describe('User', () => {
//   //describe('POST /user/signup', () => {
//   //     it('should create a new user', async done => {
//   //       this.timeout(5000)
//   //       const res = await request.post('/user/signup').send({
//   //         name: 'testname',
//   //         email: 'test@email.com',
//   //         password: 'password'
//   //       })
//   //       if (res.body.message) {
//   //         console.log('message: ', res.body.message)
//   //       }
//   //       // expect(res.statusCode).to.equal(200)
//   //       expect(res.body).to.be.an('object')
//   //       expect(res.body).to.have.property('success').to.equal(true)
//   //       done()
//   //     })
//   //   })
//   describe('POST /user/login', done => {
//     it('should login a user', async () => {
//       const res = await request.post('/user/login').send({
//         email: 'test@email.com',
//         password: 'password'
//       })
//       if (res.body.message) {
//         console.log('message: ', res.body.message)
//       }
//       expect(res.statusCode).to.equal(200)
//       expect(res.body).to.be.an('object')
//       expect(res.body).to.have.property('success').to.equal(true)
//       expect(res.body).to.have.property('token')
//       done()
//     })
//   })
//   describe('DELETE /user/delete', done => {
//     it('should delete a user', async () => {
//       const res = await request.delete('/user/delete').send({
//         email: 'test@email.com',
//         password: 'password'
//       })
//       if (res.body.message) {
//         console.log('message: ', res.body.message)
//       }
//       expect(res.statusCode).to.equal(200)
//       expect(res.body).to.be.an('object')
//       expect(res.body).to.have.property('success').to.equal(true)
//       done()
//     })
//   })
// })
