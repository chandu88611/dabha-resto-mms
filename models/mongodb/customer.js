import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomUser', // Assuming 'CustomUser' is the name of your user model
    required: false, // Set to true if you want to make it required
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple documents to have no email value (null or undefined)
  },
  phone_number: {
    type: String,
    validate: {
      validator: function (v) {
        // Validate phone number using a regular expression or other method if needed
        // Example: /^\d{10}$/ - checks if it's a 10-digit number
        return /^\d{10}$/.test(v);
      },
      message: 'Phone number must be a 10-digit number',
    },
  },
  address: {
    type: String,
  },
  date_of_birth: {
    type: Date,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
