import { Request, Response, NextFunction } from 'express';
import { Order, OrderStatus, IOrder } from '../models/Order';
import { Product } from '../models/Product';
import { User, UserRole } from '../models/User';
import { AuthError, successResponse } from '../utils/auth';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Customers only)
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items, deliveryAddress, paymentMethod, deliveryInstructions } = req.body;

    // Verify customer role
    if (req.user.role !== UserRole.CUSTOMER) {
      throw new AuthError('Only customers can create orders');
    }

    // Validate items array
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new AuthError('Please add items to your order');
    }

    // Process order items and calculate total
    let totalAmount = 0;
    const processedItems = [];
    let currentFarmer = null;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new AuthError(`Product not found: ${item.product}`);
      }

      if (!product.isAvailable) {
        throw new AuthError(`Product not available: ${product.name}`);
      }

      if (item.quantity > product.quantity) {
        throw new AuthError(`Insufficient quantity for product: ${product.name}`);
      }

      // Ensure all products are from the same farmer
      if (!currentFarmer) {
        currentFarmer = product.farmer;
      } else if (currentFarmer.toString() !== product.farmer.toString()) {
        throw new AuthError('All products must be from the same farmer');
      }

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      processedItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        subtotal
      });
    }

    // Create order
    const order = await Order.create({
      customer: req.user.id,
      farmer: currentFarmer,
      items: processedItems,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      deliveryInstructions,
      status: OrderStatus.PENDING,
      paymentStatus: 'pending'
    });

    // Populate farmer and product details
    const populatedOrder = await Order.findById(order._id)
      .populate('farmer', 'name email')
      .populate('items.product', 'name');

    successResponse(res, populatedOrder, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let query = {};

    // Filter orders based on user role
    if (req.user.role === UserRole.CUSTOMER) {
      query = { customer: req.user.id };
    } else if (req.user.role === UserRole.FARMER) {
      query = { farmer: req.user.id };
    }

    const orders = await Order.find(query)
      .populate('customer', 'name email')
      .populate('farmer', 'name email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });

    successResponse(res, orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('farmer', 'name email')
      .populate('items.product', 'name price');

    if (!order) {
      throw new AuthError('Order not found', 404);
    }

    // Check authorization
    if (
      req.user.role !== UserRole.ADMIN &&
      order.customer.toString() !== req.user.id &&
      order.farmer.toString() !== req.user.id
    ) {
      throw new AuthError('Not authorized to access this order');
    }

    successResponse(res, order);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Farmer or Admin only)
export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;

    if (!Object.values(OrderStatus).includes(status)) {
      throw new AuthError('Invalid order status');
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new AuthError('Order not found', 404);
    }

    // Check authorization
    if (
      req.user.role !== UserRole.ADMIN &&
      order.farmer.toString() !== req.user.id
    ) {
      throw new AuthError('Not authorized to update this order');
    }

    order.status = status;
    
    // If order is delivered, update actual delivery date
    if (status === OrderStatus.DELIVERED) {
      order.actualDeliveryDate = new Date();
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email')
      .populate('farmer', 'name email')
      .populate('items.product', 'name price');

    successResponse(res, updatedOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order payment status
// @route   PUT /api/orders/:id/payment
// @access  Private (Admin only)
export const updatePaymentStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user.role !== UserRole.ADMIN) {
      throw new AuthError('Only admins can update payment status');
    }

    const { paymentStatus } = req.body;

    if (!['pending', 'completed', 'failed'].includes(paymentStatus)) {
      throw new AuthError('Invalid payment status');
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new AuthError('Order not found', 404);
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    successResponse(res, order);
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private (Order customer or Admin only)
export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new AuthError('Order not found', 404);
    }

    // Check authorization
    if (
      req.user.role !== UserRole.ADMIN &&
      order.customer.toString() !== req.user.id
    ) {
      throw new AuthError('Not authorized to cancel this order');
    }

    // Can only cancel pending orders
    if (order.status !== OrderStatus.PENDING) {
      throw new AuthError('Cannot cancel order that is not pending');
    }

    order.status = OrderStatus.CANCELLED;
    await order.save();

    // Return quantities to products
    for (const item of order.items) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { quantity: item.quantity } }
      );
    }

    successResponse(res, order);
  } catch (error) {
    next(error);
  }
};