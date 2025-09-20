// middleware/validate.js
import { validationResult } from 'express-validator';

export function runValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: 'Validation failed',
      details: errors.array().map(e => ({ field: e.path, msg: e.msg })),
    });
  }
  next();
}
