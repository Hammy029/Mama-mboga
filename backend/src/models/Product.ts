import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  category: string;
  images: string[];
  farmer: mongoose.Types.ObjectId;
  isAvailable: boolean;
  location: string;
  harvestedDate?: Date;
  expiryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  unit: {
    type: String,
    required: [true, 'Unit of measurement is required'],
    enum: ['kg', 'g', 'piece', 'bunch', 'crate']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['vegetables', 'fruits', 'herbs', 'tubers', 'cereals', 'other']
  },
  images: [{
    type: String,
    required: [true, 'At least one product image is required']
  }],
  farmer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Farmer reference is required']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  location: {
    type: String,
    required: [true, 'Product location is required']
  },
  harvestedDate: {
    type: Date
  },
  expiryDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for search functionality
productSchema.index({ 
  name: 'text', 
  description: 'text', 
  category: 'text',
  location: 'text'
});

// Add a virtual field for fresh/expired status
productSchema.virtual('isFresh').get(function() {
  if (!this.expiryDate) return true;
  return new Date() < this.expiryDate;
});

// Ensure virtuals are included when converting to JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

export const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;