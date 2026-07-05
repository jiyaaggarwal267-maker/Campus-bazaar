import { Router } from 'express';
import {
  createProduct, getProducts, getProduct, getMyProducts,
  reserveProduct, markAsSold, deleteProduct,
} from '../controllers/product.controller.js';
import { auth, requireVerified } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();
router.get('/', getProducts);
router.get('/me', auth, getMyProducts);
router.get('/:id', getProduct);
router.post('/', auth, requireVerified, upload.array('images', 6), createProduct);
router.post('/:id/reserve', auth, requireVerified, reserveProduct);
router.post('/:id/sold', auth, requireVerified, markAsSold);
router.delete('/:id', auth, deleteProduct);
export default router;
