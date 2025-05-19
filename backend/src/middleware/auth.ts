import { Request, Response, NextFunction } from 'express';
import { AuthError, parseToken } from '../utils/auth';
import { User, UserRole } from '../models/User';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Protect routes middleware
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;

    // Get token from header or cookies
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw new AuthError('Not authorized to access this route');
    }

    // Verify token
    const decoded = parseToken(token);

    // Get user from token
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AuthError('User not found');
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Role authorization middleware
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AuthError('Not authorized to access this route');
    }

    if (!roles.includes(req.user.role)) {
      throw new AuthError('User role not authorized to access this route');
    }

    next();
  };
};

// Check ownership middleware
export const checkOwnership = (field: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AuthError('Not authorized to access this route');
    }

    // Allow admins to bypass ownership check
    if (req.user.role === UserRole.ADMIN) {
      return next();
    }

    const resourceId = req.params[field];
    if (resourceId !== req.user.id.toString()) {
      throw new AuthError('Not authorized to access this resource');
    }

    next();
  };
};

// Error handling middleware
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error(err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val: any) => val.message);
    return res.status(400).json({
      success: false,
      error: message
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Duplicate field value entered'
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expired'
    });
  }

  // Custom AuthError
  if (err.name === 'AuthError') {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  }

  // Default error
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};