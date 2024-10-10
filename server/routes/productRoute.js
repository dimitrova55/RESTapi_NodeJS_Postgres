import express from "express";
import * as Product from '../controllers/productController.js';

const router = express.Router();

/**
 * 'GET'
 * Product route
*/
router.get('/', Product.getAllProducts);

export default router