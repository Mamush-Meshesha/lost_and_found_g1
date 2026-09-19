import { Request, Response } from 'express';
import Category from '../models/category.js';

// 1. Define the custom interface to include the user object from the JWT
export interface AuthRequest extends Request {
  user?: any; // You can replace 'any' with a stricter type like { id: string, email: string } later
}

// @desc    Get all categories
// @route   GET /api/categories
// (Public route, so we leave it as standard Request)
export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch categories', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// @desc    Create a new category
// @route   POST /api/categories
// 2. Change Request to AuthRequest here
export const createCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, icon } = req.body;

    // Optional: You now have access to the user making the request!
    // console.log("Category being created by user ID:", req.user.id);

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      res.status(400).json({ message: 'Category already exists' });
      return;
    }

    const category = await Category.create({ name, description, icon });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ 
      message: 'Failed to create category', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// 2. Change Request to AuthRequest here
export const updateCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true } 
    );

    if (!updatedCategory) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json({ 
      message: 'Failed to update category', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// 2. Change Request to AuthRequest here
export const deleteCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to delete category', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};