import express from 'express';
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder
} from '../controllers/order.controller';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = express.Router();

// Protect all routes
router.use(protect);

// Customer routes
router.post('/', authorize(UserRole.CUSTOMER), createOrder);

// Routes for authorized users (different roles have different access levels handled in controllers)
router.get('/', getOrders);
router.get('/:id', getOrder);

// Farmer and admin routes
router.put('/:id/status', authorize(UserRole.FARMER, UserRole.ADMIN), updateOrderStatus);

// Admin only routes
router.put('/:id/payment', authorize(UserRole.ADMIN), updatePaymentStatus);

// Customer and admin routes
router.put('/:id/cancel', authorize(UserRole.CUSTOMER, UserRole.ADMIN), cancelOrder);

export default router;