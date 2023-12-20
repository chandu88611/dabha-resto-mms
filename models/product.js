import mongoose from 'mongoose';

// Define Category Schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomUser',
    required: false,
  },
});

export const Category = mongoose.model('Category', categorySchema);

// Define PharmacyProduct Schema
const pharmacyProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: false,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  expiration_date: {
    type: Date,
    required: true,
  },
  batch_number: {
    type: String,
    required: true,
  },
  serial_number: {
    type: String,
    required: true,
  },
  barcode: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomUser',
    required: false,
  },
});

export const PharmacyProduct = mongoose.model('PharmacyProduct', pharmacyProductSchema);
