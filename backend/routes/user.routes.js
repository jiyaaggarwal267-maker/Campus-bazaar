import { Router } from 'express';
import {
  getUser, updateProfile, getUserProducts, getUserReviews, rateUser,
} from '../controllers/user.controller.js';
import { auth, requireVerified } from '../middleware/auth.js';

const router = Router();
router.get('/:id', getUser);
router.get('/:id/products', getUserProducts);
router.get('/:id/reviews', getUserReviews);
router.put('/me', auth, updateProfile);
router.post('/rate', auth, requireVerified, rateUser);
export default router;
