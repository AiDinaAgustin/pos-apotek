const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      next(); 
    } catch (error) {

      res.status(400).json({ errors: formatYupErrors(error) });
    }
  };
};

function formatYupErrors(error) {
  const formattedErrors = {};

  error.inner.forEach(err => {
    const field = err.path; 
    if (!formattedErrors[field]) {
      formattedErrors[field] = err.message;
    }
  });

  return formattedErrors;
}

module.exports = validateRequest;
