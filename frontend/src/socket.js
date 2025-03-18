import { io } from 'socket.io-client';
import { backend } from './config';

// Replace with your backend's WebSocket URL
const socket = io(backend.url, {
  withCredentials: true, // To support credentials
  transports: ['websocket'], // Optional: Ensures WebSocket is used
});

export default socket;
