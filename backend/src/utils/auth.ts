import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { IUser } from '../models/User';

// Custom error class for authentication errors
export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number = 401
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// Generate JWT token
export const generateToken = (user: IUser): string => {
  return jwt.sign(
    { 
      id: user._id,
      email: user.email,
      role: user.role 
    },
    process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    {
      expiresIn: process.env.JWT_EXPIRE || '24h'
    }
  );
};

// Send token response
export const sendTokenResponse = (user: IUser, statusCode: number, res: Response): void => {
  const token = generateToken(user);

  const options = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
};

// Error response helper
export const errorResponse = (res: Response, error: any, defaultMessage: string = 'Server Error'): void => {
  const statusCode = error.statusCode || 500;
  const message = error.message || defaultMessage;

  res.status(statusCode).json({
    success: false,
    error: message
  });
};

// Success response helper
export const successResponse = (
  res: Response, 
  data: any, 
  statusCode: number = 200, 
  message: string = 'Success'
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

// Parse JWT token
export const parseToken = (token: string): any => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
  } catch (error) {
    throw new AuthError('Invalid token');
  }
};

// Check if user has required role
export const checkRole = (user: IUser, requiredRole: string | string[]): boolean => {
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(user.role);
  }
  return user.role === requiredRole;
};