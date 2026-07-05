import { upload } from '../middleware/upload.js';

export const uploadImages = [
  upload.array('images', 6),
  (req, res) => {
    if (!req.files || !req.files.length) return res.status(400).json({ error: 'No files' });
    const urls = req.files.map((f) => f.path);
    res.json({ urls });
  },
];
