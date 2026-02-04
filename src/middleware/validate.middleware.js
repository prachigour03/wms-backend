export const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body); 
      next();
    } catch (err) {
      const errors = Array.isArray(err.errors)
        ? err.errors.map(e => ({
            path: Array.isArray(e.path) ? e.path.join(".") : e.path,
            message: e.message,
          }))
        : [{ path: "", message: err.message }];

      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }
  };
};
 