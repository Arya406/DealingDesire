const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/authMiddleware');
const {
  getUserChats,
  getOrCreateChat,
  getChatMessages,
  sendMessage,
  sendImageMessage,
  sendCredentialsMessage,
  markMessagesAsRead,
  deleteMessage,
  getUnreadCount
} = require('../controllers/chatController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/chat-images';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// All routes require authentication
router.use(auth);

// Get all chats for the authenticated user
router.get('/chats', getUserChats);

// Get or create a chat with another user
router.get('/chat/:participantId', getOrCreateChat);

// Get messages for a specific chat
router.get('/chat/:chatId/messages', getChatMessages);

// Send a text message
router.post('/message', sendMessage);

// Send an image message
router.post('/message/image', upload.single('image'), sendImageMessage);

// Send credentials message
router.post('/message/credentials', sendCredentialsMessage);

// Mark messages as read
router.put('/chat/:chatId/read', markMessagesAsRead);

// Delete a message
router.delete('/message/:messageId', deleteMessage);

// Get unread message count
router.get('/unread-count', getUnreadCount);

module.exports = router; 