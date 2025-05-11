import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  thumbnail: { type: String, default: '' },
  status: { type: Boolean, default: true }
});

export const ProductModel = mongoose.model('Product', productSchema);