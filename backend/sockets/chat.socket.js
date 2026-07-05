import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

let io;

export const setupSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('No token'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return next(new Error('User not found'));
      socket.user = user;
      next();
    } catch (e) {
      next(new Error('Auth failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 ${socket.user.name} connected`);
    socket.join(socket.user._id.toString());

    socket.on('joinConversation', (convoId) => socket.join(convoId));

    socket.on('typing', ({ conversationId, isTyping }) => {
      socket.to(conversationId).emit('userTyping', {
        userId: socket.user._id,
        name: socket.user.name,
        isTyping,
      });
    });

    socket.on('disconnect', () => console.log(`❌ ${socket.user.name} disconnected`));
  });

  return io;
};

export const getIO = () => io;
