import { Request, Response, NextFunction } from 'express';

export const validateSignup = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, dateOfBirth } = req.body;

  // Check if all required fields are present
  if (!name || !email || !dateOfBirth) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required: name, email, dateOfBirth'
    });
  }

  // Validate name
  if (typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Name must be at least 2 characters long'
    });
  }

  // Validate email format
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email address'
    });
  }

  // Validate dateOfBirth
  if (typeof dateOfBirth !== 'string' || dateOfBirth.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Date of birth is required'
    });
  }

  // Sanitize inputs
  req.body.name = name.trim();
  req.body.email = email.toLowerCase().trim();
  req.body.dateOfBirth = dateOfBirth.trim();

  return next();
};

export const validateSignin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Check if all required fields are present
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  // Validate email format
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email address'
    });
  }

  // Validate password
  if (typeof password !== 'string' || password.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Password is required'
    });
  }

  // Sanitize inputs
  req.body.email = email.toLowerCase().trim();

  return next();
};
