import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Offer from '../models/Offer.js';
import Product from '../models/Product.js';
import Notification from '../models/Notification.js';
import { getIO } from '../sockets/chat.socket.js';

export const getOrCreateConversation = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.seller.equals(req.user._id)) return res.status(400).json({ error: 'Cannot message yourself' });

    let convo = await Conversation.findOne({
      product: productId, buyer: req.user._id, seller: product.seller,
    }).populate('product', 'title images price')
      .populate('buyer', 'name avatar')
      .populate('seller', 'name avatar');

    if (!convo) {
      convo = await Conversation.create({
        product: productId, buyer: req.user._id, seller: product.seller,
      });
      convo = await convo.populate(['product', 'buyer', 'seller']);
    }
    res.json(convo);
  } catch (err) { next(err); }
};

export const getConversations = async (req, res, next) => {
  try {
    const convos = await Conversation.find({
      $or: [{ buyer: req.user._id }, { seller: req.user._id }],
    })
      .populate('product', 'title images price status')
      .populate('buyer', 'name avatar')
      .populate('seller', 'name avatar')
      .sort({ updatedAt: -1 });

    res.json(convos.map((c) => {
      const other = c.buyer._id.equals(req.user._id) ? c.seller : c.buyer;
      const unread = c.buyer._id.equals(req.user._id) ? c.buyerUnread : c.sellerUnread;
      return { ...c.toObject(), other, unread };
    }));
  } catch (err) { next(err); }
};

export const getMessages = async (req, res, next) => {
  try {
    const convo = await Conversation.findById(req.params.id);
    if (!convo) return res.status(404).json({ error: 'Not found' });
    if (!convo.buyer.equals(req.user._id) && !convo.seller.equals(req.user._id)) {
      return res.status(403).json({ error: 'Not your conversation' });
    }
    if (convo.buyer.equals(req.user._id)) convo.buyerUnread = 0;
    else convo.sellerUnread = 0;
    await convo.save();

    const messages = await Message.find({ conversation: convo._id })
      .populate('offer')
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) { next(err); }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    const convo = await Conversation.findById(req.params.id);
    if (!convo) return res.status(404).json({ error: 'Not found' });
    if (!convo.buyer.equals(req.user._id) && !convo.seller.equals(req.user._id)) {
      return res.status(403).json({ error: 'Not your conversation' });
    }

    const message = await Message.create({
      conversation: convo._id, sender: req.user._id,
      type: 'text', content,
    });

    const recipient = convo.buyer.equals(req.user._id) ? convo.seller : convo.buyer;
    if (convo.buyer.equals(req.user._id)) convo.sellerUnread += 1;
    else convo.buyerUnread += 1;
    convo.lastMessage = message._id;
    await convo.save();

    await message.populate('sender', 'name avatar');

    const notif = await Notification.create({
      user: recipient, type: 'message',
      title: `New message from ${req.user.name}`,
      body: content.slice(0, 80), link: `/chat/${convo._id}`,
    });

    const io = getIO();
    io.to(convo._id.toString()).emit('newMessage', message);
    io.to(recipient.toString()).emit('notification', notif);

    res.status(201).json(message);
  } catch (err) { next(err); }
};

export const sendOffer = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const convo = await Conversation.findById(req.params.id);
    if (!convo) return res.status(404).json({ error: 'Not found' });
    if (!convo.buyer.equals(req.user._id) && !convo.seller.equals(req.user._id)) {
      return res.status(403).json({ error: 'Not your conversation' });
    }

    const offer = await Offer.create({
      conversation: convo._id, product: convo.product,
      fromUser: req.user._id, amount,
    });
    const message = await Message.create({
      conversation: convo._id, sender: req.user._id,
      type: 'offer', offer: offer._id,
    });

    const recipient = convo.buyer.equals(req.user._id) ? convo.seller : convo.buyer;
    convo.lastMessage = message._id;
    if (convo.buyer.equals(req.user._id)) convo.sellerUnread += 1;
    else convo.buyerUnread += 1;
    await convo.save();

    await message.populate('offer');
    await message.populate('sender', 'name avatar');

    const notif = await Notification.create({
      user: recipient, type: 'offer',
      title: `New offer: ₹${amount.toLocaleString()}`,
      body: `${req.user.name} made an offer`, link: `/chat/${convo._id}`,
    });

    const io = getIO();
    io.to(convo._id.toString()).emit('newOffer', message);
    io.to(recipient.toString()).emit('notification', notif);

    res.status(201).json(message);
  } catch (err) { next(err); }
};

export const respondOffer = async (req, res, next) => {
  try {
    const { action, counterAmount } = req.body;
    const offer = await Offer.findById(req.params.offerId);
    if (!offer) return res.status(404).json({ error: 'Not found' });

    const convo = await Conversation.findById(offer.conversation);
    if (!convo.buyer.equals(req.user._id) && !convo.seller.equals(req.user._id)) {
      return res.status(403).json({ error: 'Not allowed' });
    }

    offer.status = action;
    if (action === 'countered') offer.counterAmount = counterAmount;
    await offer.save();

    const recipient = offer.fromUser;
    const notif = await Notification.create({
      user: recipient, type: `offer-${action}`,
      title: action === 'accepted' ? 'Offer accepted! 🎉' : action === 'rejected' ? 'Offer rejected' : 'Counter offer received',
      body: action === 'countered' ? `Counter: ₹${counterAmount.toLocaleString()}` : `On your offer of ₹${offer.amount.toLocaleString()}`,
      link: `/chat/${convo._id}`,
    });

    const io = getIO();
    io.to(convo._id.toString()).emit('offerUpdate', offer);
    io.to(recipient.toString()).emit('notification', notif);

    res.json(offer);
  } catch (err) { next(err); }
};
