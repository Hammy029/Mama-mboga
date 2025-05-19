import { Request, Response, NextFunction } from 'express';
import { User, UserRole, IUser } from '../models/User';
import { AuthError, sendTokenResponse, successResponse, errorResponse } from '../utils/auth';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, role, phone, address } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AuthError('Email already registered');
    }

    // Validate role
    if (!Object.values(UserRole).includes(role)) {
      throw new AuthError('Invalid user role');
    }

    // Create user
    const user = await User.create({
      email,
      password,
      name,
      role,
      phone,
      address
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      throw new AuthError('Please provide email and password');
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AuthError('Invalid credentials');
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AuthError('Invalid credentials');
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
export const logout = (req: Request, res: Response) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  successResponse(res, null, 200, 'User logged out successfully');
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new AuthError('User not found');
    }
    successResponse(res, user, 200);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
export const updateDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    if (!user) {
      throw new AuthError('User not found');
    }

    successResponse(res, user, 200);
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      throw new AuthError('User not found');
    }

    // Check current password
    const isMatch = await user.comparePassword(req.body.currentPassword);
    if (!isMatch) {
      throw new AuthError('Password is incorrect');
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user as IUser, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      throw new AuthError('There is no user with that email');
    }

    // TODO: Implement email sending functionality
    // For now, just return success message
    successResponse(res, null, 200, 'Password reset email sent');
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement actual password reset functionality
    // For now, just return error
    throw new AuthError('Password reset functionality not implemented');
  } catch (error) {
    next(error);
  }
};