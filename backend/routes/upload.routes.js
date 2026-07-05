import { Router } from 'express';
import { auth, requireVerified } from '../middleware/auth.js';
import { uploadImages } from '../controllers/upload.controller.js';

const router = Router();
router.post('/images', auth, requireVerified, uploadImages);
export default router;
