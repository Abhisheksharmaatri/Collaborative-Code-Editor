const handler = (err, req, res, next) => {
  console.log('error: ', { ...err })
  const statusCode = err.statusCode || 500
  let message
  if (typeof err.message === 'array') {
    message = err.message[0]
  } else if (typeof err.message === 'string') {
    message = err.message || 'Internal Server Error'
  } else {
    message = 'Internal Server Error'
  }
  res.status(statusCode).send({ success: false, message })
}

module.exports = handler
