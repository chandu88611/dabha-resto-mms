import mongoose from 'mongoose';

const inventoryItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    // Add more details if necessary, e.g., kg, liters, etc.
  },
  // Add more fields as needed for inventory items.
});

const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);

export default InventoryItem;
