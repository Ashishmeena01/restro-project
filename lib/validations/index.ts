import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  categoryId: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  price: z.number().int().positive('Price must be a positive integer in paise'),
  isVeg: z.boolean().default(true),
  isAvailable: z.boolean().default(true),
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const tableSchema = z.object({
  tableNumber: z.string().min(1, 'Table number is required (e.g. Table 1, T-01)'),
  capacity: z.number().int().min(1).default(4),
  isActive: z.boolean().default(true),
});

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const checkoutSchema = z.object({
  businessSlug: z.string().default('vrindavan-sweets'),
  tableNumber: z.string().optional(),
  customerName: z.string().min(2, 'Please enter your name'),
  customerPhone: z.string().min(10, 'Please enter a valid 10-digit phone number'),
  paymentMethod: z.enum(['ONLINE_RAZORPAY', 'CASH', 'TEST']),
  notes: z.string().optional(),
  items: z.array(cartItemSchema).min(1, 'Cart cannot be empty'),
});

export const businessSettingsSchema = z.object({
  name: z.string().min(2),
  tagline: z.string().optional(),
  address: z.string().min(5),
  phone: z.string().min(8),
  email: z.string().email(),
  openingHours: z.string().min(3),
  taxRatePercent: z.number().min(0).max(100),
  fssaiNumber: z.string().optional(),
  upiId: z.string().optional(),
  razorpayKeyId: z.string().optional(),
  razorpayKeySecret: z.string().optional(),
  enableCash: z.boolean().default(true),
  enableOnline: z.boolean().default(true),
  receiptFooter: z.string().optional(),
});

export const paymentVerifySchema = z.object({
  orderId: z.string().min(1),
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});
