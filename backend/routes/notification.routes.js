import { Router } from 'express';
import { getNotifications, markRead } from '../controllers/notification.controller.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.use(auth);
router.get('/', getNotifications);
router.post('/read-all', markRead);
export default router;
