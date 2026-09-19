import express from 'express';
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../controllers/categoryControllers.js';

// 1. Import your auth middleware
import authMiddleware from '../middleware/authMiddleware.js'; 

const router = express.Router();

// PUBLIC ROUTE: Anyone can view categories. No middleware here.
router.route('/')
  .get(getCategories);

// PROTECTED ROUTES: Only logged-in users with a valid token can do these.
// We insert authMiddleware right before the controller function.
router.route('/')
  .post(authMiddleware, createCategory);

router.route('/:id')
  .put(authMiddleware, updateCategory)
  .delete(authMiddleware, deleteCategory);

export default router;