import express from "express";
import * as Product from '../controllers/productController.js';

const router = express.Router();


router.get('/', Product.getAllProducts);
router.get('/:id', Product.getProductByID);
router.get('/category/:categoryId', Product.getProductsByCategoryID);
router.post('/', Product.createProduct);
router.put('/:id', Product.updateProduct);
router.delete('/:id', Product.deleteProduct);

export default router