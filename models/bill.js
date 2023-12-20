import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Define BillProduct Schema
const billProductSchema = new mongoose.Schema({
  bill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bill',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const BillProduct = mongoose.model('BillProduct', billProductSchema);

// Define Bill Schema
const billSchema = new mongoose.Schema({
  // ... other fields ...
  invoice_number: {
    type: String,
    unique: true,
    default: () => `INV-${uuidv4()}`, // Use a unique value for invoice_number
  },
  is_invoice: {
    type: Boolean,
    default: false,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PharmacyProduct',
      through: 'BillProduct',
    },
  ],
});

billSchema.pre('save', async function (next) {
  // Calculate total amount based on product prices
  if (!this.amount && this.products.length > 0) {
    this.amount = this.products.reduce((total, product) => total + product.price, 0);
  }

  // Set invoice number if not already set
  if (!this.invoice_number && this.is_invoice) {
    const lastInvoice = await this.constructor.findOne({ is_invoice: true }).sort('-invoice_number').exec();
    const lastNumber = lastInvoice ? parseInt(lastInvoice.invoice_number.split('-')[1]) : 0;
    this.invoice_number = `INV-${String(lastNumber + 1).padStart(4, '0')}`;
  }

  next();
});

const Bill = mongoose.model('Bill', billSchema);

export { Bill, BillProduct };
