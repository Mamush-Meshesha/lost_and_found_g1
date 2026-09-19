import { Router } from 'express';
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../controllers/categoryControllers.js';

const router = Router();

// Routes for /api/categories
router.route('/')
  .get(getCategories)
  .post(createCategory);

// Routes for /api/categories/:id
router.route('/:id')
  .put(updateCategory)
  .delete(deleteCategory);

export default router;