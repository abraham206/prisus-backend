exports.validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    let errMessages;
    if (!result.success) {
      errMessages = result?.error?.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
    }
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: errMessages[0].message,
      });
    }

    req.body = result.data;
    next();
  };
};
