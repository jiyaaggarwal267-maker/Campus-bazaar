import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket | null => socket;

export const connectSocket = (token: string): Socket => {
  if (socket?.connected) return socket;
  socket = io(import.meta.env.VITE_SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
  });
  socket.on('connect', () => console.log('🟢 Socket connected'));
  socket.on('disconnect', () => console.log('🔴 Socket disconnected'));
  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
