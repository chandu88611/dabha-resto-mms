import mongoose from 'mongoose';
import validator from 'validator';

const foodCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => {
        // Use the isAlphanumeric validator from the validator library
        return validator.isAlphanumeric(value, 'en-US', { ignore: ' ' });
      },
      message: (props) => `${props.value} is not a valid alphanumeric name!`,
    },
  },
});

const FoodCategory = mongoose.model('FoodCategory', foodCategorySchema);

export default FoodCategory;
