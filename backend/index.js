const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// CORS Configuration - Allow all origins for development
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'DesireDeal API is running'
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/giftcards', require('./routes/giftcard'));
app.use('/api/chat', require('./routes/chat'));

// Socket.IO connection handling
const connectedUsers = new Map();

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    return next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userId}`);
  
  // Store connected user
  connectedUsers.set(socket.userId, socket.id);
  
  // Join user to their personal room
  socket.join(`user_${socket.userId}`);

  // Handle joining chat rooms
  socket.on('join-chat', (chatId) => {
    socket.join(`chat_${chatId}`);
    console.log(`User ${socket.userId} joined chat ${chatId}`);
  });

  // Handle leaving chat rooms
  socket.on('leave-chat', (chatId) => {
    socket.leave(`chat_${chatId}`);
    console.log(`User ${socket.userId} left chat ${chatId}`);
  });

  // Handle new message
  socket.on('new-message', (data) => {
    const { chatId, message } = data;
    
    // Broadcast to all users in the chat room except sender
    socket.to(`chat_${chatId}`).emit('message-received', {
      chatId,
      message
    });
    
    // Send notification to other participants
    socket.to(`chat_${chatId}`).emit('new-message-notification', {
      chatId,
      senderId: socket.userId,
      message: message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '')
    });
  });

  // Handle typing indicators
  socket.on('typing-start', (data) => {
    const { chatId } = data;
    socket.to(`chat_${chatId}`).emit('user-typing', {
      chatId,
      userId: socket.userId
    });
  });

  socket.on('typing-stop', (data) => {
    const { chatId } = data;
    socket.to(`chat_${chatId}`).emit('user-stopped-typing', {
      chatId,
      userId: socket.userId
    });
  });

  // Handle message read receipts
  socket.on('message-read', (data) => {
    const { chatId, messageIds } = data;
    socket.to(`chat_${chatId}`).emit('messages-read', {
      chatId,
      readerId: socket.userId,
      messageIds
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userId}`);
    connectedUsers.delete(socket.userId);
  });
});

// Helper function to emit to specific user
const emitToUser = (userId, event, data) => {
  const socketId = connectedUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit(event, data);
  }
};

// Helper function to emit to chat room
const emitToChat = (chatId, event, data) => {
  io.to(`chat_${chatId}`).emit(event, data);
};

// Make io available to other modules
app.set('io', io);
app.set('emitToUser', emitToUser);
app.set('emitToChat', emitToChat);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));
