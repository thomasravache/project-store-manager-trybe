const joiStatusCodes = {
  'any.required': 400,
  'string.min': 422,
  'number.base': 422,
  'string.base': 422,
  'number.min': 422,
};

const statusCodes = {
  'Product already exists': 409,
};

module.exports = (err, _req, res, _next) => {
  if (err.isJoi) {
    const { details } = err;
    const { type, message } = details[0];
    console.log(type);

    const joiStatusCode = joiStatusCodes[type] || 422;
    return res.status(joiStatusCode).json({ message });
  }

  const statusCode = statusCodes[err.message] || 404;

  if (err.message) return res.status(statusCode).json({ message: err.message });

  console.error(err);
  return res.status(500).json({ message: 'Erro inesperado!' });
};
