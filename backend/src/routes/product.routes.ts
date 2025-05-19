import express from 'express';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getFarmerProducts,
  updateProductAvailability
} from '../controllers/product.controller';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);
router.get('/farmer/:id', getFarmerProducts);

// Protected routes
router.use(protect);

// Farmer and admin only routes
router.post('/', authorize(UserRole.FARMER), createProduct);
router.put('/:id', authorize(UserRole.FARMER, UserRole.ADMIN), updateProduct);
router.delete('/:id', authorize(UserRole.FARMER, UserRole.ADMIN), deleteProduct);
router.put('/:id/availability', authorize(UserRole.FARMER, UserRole.ADMIN), updateProductAvailability);

export default router;