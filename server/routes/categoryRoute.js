import express from "express";
import * as Category from '../controllers/categoryController.js';

const router = express.Router();


router.get('/', Category.getAllCategories);
router.post('/', Category.createCategory);
router.put('/:id', Category.updateCategory);
router.delete('/:id', Category.deleteCategory);

export default router