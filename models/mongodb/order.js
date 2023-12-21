import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  items: [
    {
      menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed'],
    default: 'Pending',
  },
  // Add more fields as needed for orders.
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
