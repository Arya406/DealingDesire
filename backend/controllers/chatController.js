const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Get all chats for a user
const getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const chats = await Chat.find({
      participants: userId,
      isActive: true
    })
    .populate('participants', 'name email role')
    .populate('lastMessage')
    .sort({ lastMessageTime: -1 });

    // Get unread counts for each chat
    const chatsWithUnreadCounts = chats.map(chat => {
      const unreadCount = chat.unreadCount.get(userId.toString()) || 0;
      return {
        ...chat.toObject(),
        unreadCount
      };
    });

    res.json(chatsWithUnreadCounts);
  } catch (error) {
    console.error('Error getting user chats:', error);
    res.status(500).json({ message: 'Error fetching chats' });
  }
};

// Get or create a chat between two users
const getOrCreateChat = async (req, res) => {
  try {
    const { participantId } = req.params;
    const userId = req.user.id;

    if (userId === participantId) {
      return res.status(400).json({ message: 'Cannot create chat with yourself' });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [userId, participantId] },
      isActive: true
    }).populate('participants', 'name email role');

    if (!chat) {
      // Create new chat
      chat = new Chat({
        participants: [userId, participantId],
        unreadCount: new Map([[participantId, 0]])
      });
      await chat.save();
      
      // Populate participants after saving
      chat = await Chat.findById(chat._id).populate('participants', 'name email role');
    }

    res.json(chat);
  } catch (error) {
    console.error('Error getting/creating chat:', error);
    res.status(500).json({ message: 'Error creating chat' });
  }
};

// Get messages for a specific chat
const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    // Verify user is participant in the chat
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const messages = await Message.find({ chatId })
      .populate('sender', 'name email role')
      .populate('replyTo')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { 
        chatId, 
        sender: { $ne: userId }, 
        isRead: false 
      },
      { 
        isRead: true,
        $push: { readBy: { user: userId, readAt: new Date() } }
      }
    );

    // Reset unread count for this user
    chat.unreadCount.set(userId.toString(), 0);
    await chat.save();

    res.json(messages);
  } catch (error) {
    console.error('Error getting chat messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

// Send a text message
const sendMessage = async (req, res) => {
  try {
    const { chatId, content, replyTo } = req.body;
    const userId = req.user.id;

    // Verify user is participant in the chat
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const message = new Message({
      chatId,
      sender: userId,
      content,
      messageType: 'text',
      replyTo
    });

    await message.save();

    // Update chat's last message
    chat.lastMessage = message._id;
    chat.lastMessageTime = new Date();
    
    // Increment unread count for other participants
    chat.participants.forEach(participantId => {
      if (participantId.toString() !== userId) {
        const currentCount = chat.unreadCount.get(participantId.toString()) || 0;
        chat.unreadCount.set(participantId.toString(), currentCount + 1);
      }
    });

    await chat.save();

    // Populate sender info for response
    await message.populate('sender', 'name email role');
    if (replyTo) {
      await message.populate('replyTo');
    }

    res.json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
};

// Upload image and send image message
const sendImageMessage = async (req, res) => {
  try {
    const { chatId, caption } = req.body;
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }

    // Verify user is participant in the chat
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'chat-images',
      resource_type: 'image'
    });

    const message = new Message({
      chatId,
      sender: userId,
      content: caption || 'Image',
      messageType: 'image',
      attachments: [{
        type: 'image',
        url: result.secure_url,
        filename: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype
      }]
    });

    await message.save();

    // Update chat's last message
    chat.lastMessage = message._id;
    chat.lastMessageTime = new Date();
    
    // Increment unread count for other participants
    chat.participants.forEach(participantId => {
      if (participantId.toString() !== userId) {
        const currentCount = chat.unreadCount.get(participantId.toString()) || 0;
        chat.unreadCount.set(participantId.toString(), currentCount + 1);
      }
    });

    await chat.save();

    // Populate sender info for response
    await message.populate('sender', 'name email role');

    res.json(message);
  } catch (error) {
    console.error('Error sending image message:', error);
    res.status(500).json({ message: 'Error sending image' });
  }
};

// Send credentials message
const sendCredentialsMessage = async (req, res) => {
  try {
    const { chatId, credentialType, title, data } = req.body;
    const userId = req.user.id;

    // Verify user is participant in the chat
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const message = new Message({
      chatId,
      sender: userId,
      content: `Shared ${credentialType} credentials`,
      messageType: 'credentials',
      credentials: {
        type: credentialType,
        title,
        data,
        isEncrypted: false // You can implement encryption here
      }
    });

    await message.save();

    // Update chat's last message
    chat.lastMessage = message._id;
    chat.lastMessageTime = new Date();
    
    // Increment unread count for other participants
    chat.participants.forEach(participantId => {
      if (participantId.toString() !== userId) {
        const currentCount = chat.unreadCount.get(participantId.toString()) || 0;
        chat.unreadCount.set(participantId.toString(), currentCount + 1);
      }
    });

    await chat.save();

    // Populate sender info for response
    await message.populate('sender', 'name email role');

    res.json(message);
  } catch (error) {
    console.error('Error sending credentials message:', error);
    res.status(500).json({ message: 'Error sending credentials' });
  }
};

// Mark messages as read
const markMessagesAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    // Verify user is participant in the chat
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Mark messages as read
    await Message.updateMany(
      { 
        chatId, 
        sender: { $ne: userId }, 
        isRead: false 
      },
      { 
        isRead: true,
        $push: { readBy: { user: userId, readAt: new Date() } }
      }
    );

    // Reset unread count for this user
    chat.unreadCount.set(userId.toString(), 0);
    await chat.save();

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: 'Error marking messages as read' });
  }
};

// Delete a message (only sender can delete)
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.sender.toString() !== userId) {
      return res.status(403).json({ message: 'Cannot delete others message' });
    }

    await Message.findByIdAndDelete(messageId);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Error deleting message' });
  }
};

// Get unread message count for a user
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const chats = await Chat.find({
      participants: userId,
      isActive: true
    });

    let totalUnread = 0;
    chats.forEach(chat => {
      totalUnread += chat.unreadCount.get(userId.toString()) || 0;
    });

    res.json({ unreadCount: totalUnread });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ message: 'Error fetching unread count' });
  }
};

module.exports = {
  getUserChats,
  getOrCreateChat,
  getChatMessages,
  sendMessage,
  sendImageMessage,
  sendCredentialsMessage,
  markMessagesAsRead,
  deleteMessage,
  getUnreadCount
}; 