import { Request, Response, NextFunction } from 'express';
import { Product, IProduct } from '../models/Product';
import { AuthError, successResponse } from '../utils/auth';
import { UserRole } from '../models/User';
import { SortOrder } from 'mongoose';

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Farmers only)
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Ensure user is a farmer
    if (req.user.role !== UserRole.FARMER) {
      throw new AuthError('Only farmers can create products');
    }

    // Add farmer to request body
    req.body.farmer = req.user.id;

    const product = await Product.create(req.body);
    successResponse(res, product, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      search, 
      category, 
      minPrice, 
      maxPrice, 
      location,
      available,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    let query: any = {};

    // Search by name or description
    if (search) {
      query.$text = { $search: search as string };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location as string, $options: 'i' };
    }

    // Filter by availability
    if (available !== undefined) {
      query.isAvailable = available === 'true';
    }

    // Execute query with pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Create sort object with proper typing
    const sortOptions: { [key: string]: SortOrder } = {
      [sortBy as string]: (order as string === 'desc' ? -1 : 1) as SortOrder
    };

    const products = await Product.find(query)
      .populate('farmer', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    successResponse(res, {
      products,
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id).populate('farmer', 'name email');
    
    if (!product) {
      throw new AuthError('Product not found', 404);
    }

    successResponse(res, product);
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Product owner or Admin)
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      throw new AuthError('Product not found', 404);
    }

    // Make sure user is product owner or admin
    if (product.farmer.toString() !== req.user.id && req.user.role !== UserRole.ADMIN) {
      throw new AuthError('Not authorized to update this product');
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    successResponse(res, product);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Product owner or Admin)
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new AuthError('Product not found', 404);
    }

    // Make sure user is product owner or admin
    if (product.farmer.toString() !== req.user.id && req.user.role !== UserRole.ADMIN) {
      throw new AuthError('Not authorized to delete this product');
    }

    await product.deleteOne();
    successResponse(res, null, 200, 'Product removed');
  } catch (error) {
    next(error);
  }
};

// @desc    Get farmer's products
// @route   GET /api/products/farmer/:id
// @access  Public
export const getFarmerProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({ farmer: req.params.id });
    successResponse(res, products);
  } catch (error) {
    next(error);
  }
};

// @desc    Update product availability
// @route   PUT /api/products/:id/availability
// @access  Private (Product owner or Admin)
export const updateProductAvailability = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new AuthError('Product not found', 404);
    }

    // Make sure user is product owner or admin
    if (product.farmer.toString() !== req.user.id && req.user.role !== UserRole.ADMIN) {
      throw new AuthError('Not authorized to update this product');
    }

    product.isAvailable = !product.isAvailable;
    await product.save();

    successResponse(res, product);
  } catch (error) {
    next(error);
  }
};