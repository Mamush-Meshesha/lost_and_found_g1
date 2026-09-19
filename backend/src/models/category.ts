import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    unique: true, // Prevents duplicate categories (e.g., two "Electronics" categories)
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
 
}, {
  timestamps: true // Adds createdAt and updatedAt
});

module.exports = mongoose.model('Category', categorySchema);