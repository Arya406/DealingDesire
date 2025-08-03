import API from './api';
import io from 'socket.io-client';

class ChatService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.messageHandlers = new Map();
    this.typingHandlers = new Map();
    this.readHandlers = new Map();
  }

  // Initialize Socket.IO connection
  connect(token) {
    if (this.socket && this.isConnected) {
      return;
    }

    const serverUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-production-api.com' 
      : 'http://localhost:5000';

    console.log('Connecting to chat server:', serverUrl);

    this.socket = io(serverUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    this.socket.on('connect', () => {
      console.log('Connected to chat server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
      
      // Try to reconnect after a delay
      setTimeout(() => {
        if (!this.isConnected) {
          console.log('Attempting to reconnect to chat server...');
          this.connect(token);
        }
      }, 5000);
    });

    // Handle incoming messages
    this.socket.on('message-received', (data) => {
      const { chatId, message } = data;
      const handlers = this.messageHandlers.get(chatId) || [];
      handlers.forEach(handler => handler(message));
    });

    // Handle typing indicators
    this.socket.on('user-typing', (data) => {
      const { chatId, userId } = data;
      const handlers = this.typingHandlers.get(chatId) || [];
      handlers.forEach(handler => handler(userId, true));
    });

    this.socket.on('user-stopped-typing', (data) => {
      const { chatId, userId } = data;
      const handlers = this.typingHandlers.get(chatId) || [];
      handlers.forEach(handler => handler(userId, false));
    });

    // Handle read receipts
    this.socket.on('messages-read', (data) => {
      const { chatId, readerId, messageIds } = data;
      const handlers = this.readHandlers.get(chatId) || [];
      handlers.forEach(handler => handler(readerId, messageIds));
    });
  }

  // Disconnect from Socket.IO
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Join a chat room
  joinChat(chatId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-chat', chatId);
    }
  }

  // Leave a chat room
  leaveChat(chatId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave-chat', chatId);
    }
  }

  // Send a new message
  sendMessage(chatId, message) {
    if (this.socket && this.isConnected) {
      this.socket.emit('new-message', { chatId, message });
    }
  }

  // Start typing indicator
  startTyping(chatId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing-start', { chatId });
    }
  }

  // Stop typing indicator
  stopTyping(chatId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing-stop', { chatId });
    }
  }

  // Mark messages as read
  markMessagesAsRead(chatId, messageIds) {
    if (this.socket && this.isConnected) {
      this.socket.emit('message-read', { chatId, messageIds });
    }
  }

  // Add message handler
  onMessage(chatId, handler) {
    if (!this.messageHandlers.has(chatId)) {
      this.messageHandlers.set(chatId, []);
    }
    this.messageHandlers.get(chatId).push(handler);
  }

  // Remove message handler
  offMessage(chatId, handler) {
    const handlers = this.messageHandlers.get(chatId) || [];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }

  // Add typing handler
  onTyping(chatId, handler) {
    if (!this.typingHandlers.has(chatId)) {
      this.typingHandlers.set(chatId, []);
    }
    this.typingHandlers.get(chatId).push(handler);
  }

  // Remove typing handler
  offTyping(chatId, handler) {
    const handlers = this.typingHandlers.get(chatId) || [];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }

  // Add read receipt handler
  onRead(chatId, handler) {
    if (!this.readHandlers.has(chatId)) {
      this.readHandlers.set(chatId, []);
    }
    this.readHandlers.get(chatId).push(handler);
  }

  // Remove read receipt handler
  offRead(chatId, handler) {
    const handlers = this.readHandlers.get(chatId) || [];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }

  // API Methods

  // Get all chats for the user
  async getUserChats() {
    try {
      const response = await API.get('/chat/chats');
      return response.data;
    } catch (error) {
      console.error('Error fetching chats:', error);
      throw error;
    }
  }

  // Get or create a chat with another user
  async getOrCreateChat(participantId) {
    try {
      const response = await API.get(`/chat/chat/${participantId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting/creating chat:', error);
      throw error;
    }
  }

  // Get messages for a specific chat
  async getChatMessages(chatId) {
    try {
      const response = await API.get(`/chat/chat/${chatId}/messages`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  // Send a text message
  async sendTextMessage(chatId, content, replyTo = null) {
    try {
      const response = await API.post('/chat/message', {
        chatId,
        content,
        replyTo
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Send an image message
  async sendImageMessage(chatId, imageFile, caption = '') {
    try {
      const formData = new FormData();
      formData.append('chatId', chatId);
      formData.append('image', imageFile);
      formData.append('caption', caption);

      const response = await API.post('/chat/message/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error sending image message:', error);
      throw error;
    }
  }

  // Send credentials message
  async sendCredentialsMessage(chatId, credentialType, title, data) {
    try {
      const response = await API.post('/chat/message/credentials', {
        chatId,
        credentialType,
        title,
        data
      });
      return response.data;
    } catch (error) {
      console.error('Error sending credentials message:', error);
      throw error;
    }
  }

  // Mark messages as read
  async markMessagesAsRead(chatId) {
    try {
      const response = await API.put(`/chat/chat/${chatId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }

  // Delete a message
  async deleteMessage(messageId) {
    try {
      const response = await API.delete(`/chat/message/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  // Get unread message count
  async getUnreadCount() {
    try {
      const response = await API.get('/chat/unread-count');
      return response.data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }
}

export default new ChatService(); 