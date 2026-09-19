import { Request, Response } from 'express';
import Category from '../models/category';

// @desc    Get all categories
// @route   GET /api/categories
export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Fetch all categories and sort them so the newest ones appear first
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
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, icon } = req.body;

    // Check if a category with this name already exists
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      res.status(400).json({ message: 'Category already exists' });
      return;
    }

    // Create and save the new category
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
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Find the category by ID and update it. 
    // { new: true } ensures it returns the updated document, not the old one.
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
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
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