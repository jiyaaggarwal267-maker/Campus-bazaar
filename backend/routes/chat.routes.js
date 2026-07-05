import { Router } from 'express';
import {
  getOrCreateConversation, getConversations, getMessages,
  sendMessage, sendOffer, respondOffer,
} from '../controllers/chat.controller.js';
import { auth, requireVerified } from '../middleware/auth.js';

const router = Router();
router.use(auth, requireVerified);
router.post('/conversations', getOrCreateConversation);
router.get('/conversations', getConversations);
router.get('/conversations/:id/messages', getMessages);
router.post('/conversations/:id/messages', sendMessage);
router.post('/conversations/:id/offers', sendOffer);
router.post('/offers/:offerId/respond', respondOffer);
export default router;
