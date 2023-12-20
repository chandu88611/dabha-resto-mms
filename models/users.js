import mongoose from 'mongoose';
import validator from 'validator';

const customUserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: validator.isEmail,
      message: 'Invalid email address',
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        return value.length >= 8;
      },
      message: 'Password must be at least 8 characters long',
    },
  },
  first_name: {
    type: String,
    maxlength: 30,
    default: '',
  },
  last_name: {
    type: String,
    maxlength: 30,
    default: '',
  },
  roles: {
    type: [String],
    enum: ['user', 'admin'],
    default: ['user'],
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  is_staff: {
    type: Boolean,
    default: false,
  },
  registration_date: {
    type: Date,
    default: Date.now,
  },
});

customUserSchema.virtual('expiration_date').get(function () {
  const oneYearInMillis = 365 * 24 * 60 * 60 * 1000; // milliseconds in a year
  return this.registration_date.getTime() + oneYearInMillis;
});

customUserSchema.methods.isAccountExpired = function () {
  const currentDate = new Date().getTime();
  return currentDate >= this.expiration_date;
};

const CustomUser = mongoose.model('CustomUser', customUserSchema);

export default CustomUser;
