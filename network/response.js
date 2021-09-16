const statusMessage = {
  '200': 'Ok',
  '201': 'Created',
  '202': 'Accepted',
  '203': 'Non-authoritative Information',
  '204': 'No content',
  '301': 'moved-permanently',
  '400': 'Bad Request',
  '401': 'Unautorized',
  '403': 'Forbidden',
  '404': 'Not Found',
  '500': 'Internal Server Error',
}


exports.success = function (req, res, message, statusCode = 200){

  res.status(statusCode).send({
    error: false,
    status: statusMessage[statusCode],
    body: message,
  })
}

exports.error = function (req, res, message = 'Internal server error', statusCode = 500){

  res.status(statusCode).send({
    error: false,
    status: statusMessage[statusCode],
    body: message,
  })

}




