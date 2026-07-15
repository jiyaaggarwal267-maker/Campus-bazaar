import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { connectDB } from './config/db.js';
import { setupSocket } from './sockets/chat.socket.js';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import chatRoutes from './routes/chat.routes.js';
import userRoutes from './routes/user.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import { errorHandler } from './middleware/error.js';

const app = express();

// Fix Render proxy + express-rate-limit issue
app.set("trust proxy", 1);

const server = http.createServer(app);

app.use(helmet({ crossOriginResourcePolicy: false }));

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://campus-bazaar-1.vercel.app"
  ],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300
}));

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Campus Bazaar API'
  });
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);

app.use(errorHandler);

const start = async () => {
  await connectDB();
  await setupSocket(server);

  const PORT = process.env.PORT || 5002;

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

start().catch((e) => {
  console.error(e);
  process.exit(1);
});