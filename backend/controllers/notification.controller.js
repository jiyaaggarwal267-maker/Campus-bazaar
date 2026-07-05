import Notification from '../models/Notification.js';

export const getNotifications = async (req, res, next) => {
  try {
    const notifs = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifs);
  } catch (err) { next(err); }
};

export const markRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true }
    );
    res.json({ message: 'Marked all read' });
  } catch (err) { next(err); }
};
