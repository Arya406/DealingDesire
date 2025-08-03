# Chat Functionality Documentation

## Overview
The DesireDeal platform now includes a complete real-time chat system that allows buyers and sellers to communicate seamlessly. The chat system is built with Socket.IO for real-time messaging and includes features like message notifications, typing indicators, and file sharing.

## Features Implemented

### 🔥 **Core Chat Features**
- **Real-time messaging** between buyers and sellers
- **Chat history** with persistent storage
- **Unread message counters** with visual badges
- **Typing indicators** to show when someone is typing
- **Message read receipts** to track message status
- **File and image sharing** capabilities
- **Credential sharing** for secure information exchange

### 🎨 **User Interface**
- **Modern chat interface** with responsive design
- **Chat list sidebar** showing all conversations
- **Message bubbles** with different styles for sent/received
- **Search and filtering** capabilities
- **Notification system** with toast messages
- **Mobile-responsive** design

### 🔒 **Security & Authentication**
- **JWT-based authentication** for all chat operations
- **User verification** to ensure only authenticated users can chat
- **Message encryption** support (can be extended)
- **Secure file uploads** with size and type validation

## Architecture

### Backend Components

#### 1. **Socket.IO Server** (`backend/index.js`)
- Real-time communication hub
- Handles user connections and disconnections
- Manages chat rooms and message broadcasting
- Implements typing indicators and read receipts

#### 2. **Chat Routes** (`backend/routes/chat.js`)
- RESTful API endpoints for chat operations
- File upload handling with Multer
- Authentication middleware integration

#### 3. **Chat Controller** (`backend/controllers/chatController.js`)
- Business logic for chat operations
- Message creation, retrieval, and management
- File upload to Cloudinary
- Unread count calculations

#### 4. **Database Models**
- **Chat Model** (`backend/models/Chat.js`): Manages chat sessions
- **Message Model** (`backend/models/Message.js`): Stores individual messages

### Frontend Components

#### 1. **Chat Service** (`frontend/src/services/chatService.js`)
- Socket.IO client connection management
- API calls for chat operations
- Real-time event handling

#### 2. **Chat Component** (`frontend/src/components/Chat.jsx`)
- Main chat interface
- Message display and input handling
- File upload and credential sharing

#### 3. **Chat Notification** (`frontend/src/components/ChatNotification.jsx`)
- Toast notifications for new messages
- Visual indicators for unread messages

## API Endpoints

### Chat Management
- `GET /api/chat/chats` - Get all user chats
- `GET /api/chat/chat/:participantId` - Get or create chat with user
- `GET /api/chat/chat/:chatId/messages` - Get chat messages
- `PUT /api/chat/chat/:chatId/read` - Mark messages as read

### Messaging
- `POST /api/chat/message` - Send text message
- `POST /api/chat/message/image` - Send image message
- `POST /api/chat/message/credentials` - Share credentials
- `DELETE /api/chat/message/:messageId` - Delete message

### Notifications
- `GET /api/chat/unread-count` - Get unread message count

## Socket.IO Events

### Client to Server
- `join-chat` - Join a chat room
- `leave-chat` - Leave a chat room
- `new-message` - Send a new message
- `typing-start` - Start typing indicator
- `typing-stop` - Stop typing indicator
- `message-read` - Mark messages as read

### Server to Client
- `message-received` - New message received
- `user-typing` - User started typing
- `user-stopped-typing` - User stopped typing
- `messages-read` - Messages marked as read
- `new-message-notification` - Notification for new message

## Usage Examples

### Starting a Chat (Buyer)
```javascript
const handleStartChat = async (sellerId) => {
  try {
    const response = await API.get(`/chat/chat/${sellerId}`);
    const chat = response.data;
    setSelectedChatId(chat._id);
    setShowChat(true);
    toast.success('Chat started successfully!');
  } catch (error) {
    toast.error('Failed to start chat. Please try again.');
  }
};
```

### Sending a Message
```javascript
const sendMessage = async () => {
  if (!newMessage.trim() || !selectedChat) return;

  try {
    const message = await ChatService.sendTextMessage(selectedChat._id, newMessage.trim());
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  } catch (error) {
    toast.error('Failed to send message. Please try again.');
  }
};
```

### Loading Unread Count
```javascript
const loadUnreadCount = async () => {
  try {
    const response = await API.get('/chat/unread-count');
    setUnreadCount(response.data.unreadCount);
  } catch (error) {
    console.error('Error loading unread count:', error);
  }
};
```

## File Upload Features

### Supported File Types
- **Images**: JPG, PNG, GIF, WebP
- **Documents**: PDF, DOC, DOCX (can be extended)
- **Size Limit**: 5MB per file

### Upload Process
1. File validation on frontend
2. Upload to Cloudinary via backend
3. Store file metadata in database
4. Send message with file attachment

## Security Considerations

### Authentication
- All chat endpoints require valid JWT token
- Socket.IO connections authenticated via token
- User verification before allowing chat access

### Data Protection
- File uploads validated for type and size
- Message content sanitized
- Credential sharing can be encrypted (extensible)

### Rate Limiting
- Can be implemented to prevent spam
- Message frequency limits (extensible)

## Performance Optimizations

### Database
- Indexed queries for chat and message retrieval
- Efficient pagination for large message histories
- Optimized unread count calculations

### Real-time
- Efficient Socket.IO room management
- Minimal data transfer for typing indicators
- Connection pooling and error handling

## Mobile Responsiveness

### Design Features
- Responsive chat interface
- Touch-friendly buttons and inputs
- Optimized for mobile browsers
- Collapsible chat list on smaller screens

## Future Enhancements

### Planned Features
- **Voice messages** - Audio recording and playback
- **Video calls** - Real-time video communication
- **Message reactions** - Emoji reactions to messages
- **Message search** - Search within chat history
- **Chat groups** - Multi-participant conversations
- **Message scheduling** - Send messages at specific times
- **Chat backup** - Export chat history
- **Advanced notifications** - Push notifications for mobile

### Technical Improvements
- **Message encryption** - End-to-end encryption
- **Offline support** - Message queuing when offline
- **Message synchronization** - Cross-device message sync
- **Performance monitoring** - Chat performance metrics
- **Analytics** - Chat usage analytics

## Troubleshooting

### Common Issues

#### 1. **Socket Connection Failed**
- Check if backend server is running
- Verify CORS configuration
- Ensure JWT token is valid

#### 2. **Messages Not Sending**
- Check network connectivity
- Verify user authentication
- Check browser console for errors

#### 3. **File Upload Fails**
- Verify file size (max 5MB)
- Check file type restrictions
- Ensure Cloudinary configuration is correct

#### 4. **Chat Not Loading**
- Check database connection
- Verify user permissions
- Check API endpoint availability

### Debug Mode
Enable debug logging by setting environment variables:
```bash
DEBUG=socket.io:*
NODE_ENV=development
```

## Environment Variables

### Required Variables
```bash
# Database
MONGO_URI=mongodb://localhost:27017/desiredeal

# JWT
JWT_SECRET=your-secret-key

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## Installation & Setup

### Backend Setup
1. Install dependencies: `npm install`
2. Set environment variables
3. Start server: `npm start`

### Frontend Setup
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`

### Database Setup
1. Ensure MongoDB is running
2. Chat and Message collections will be created automatically

## Testing

### Manual Testing
1. Create buyer and seller accounts
2. Start a chat from buyer dashboard
3. Send messages between users
4. Test file uploads and notifications

### Automated Testing
- Unit tests for chat controllers
- Integration tests for Socket.IO events
- E2E tests for chat functionality

---

This chat system provides a robust foundation for buyer-seller communication on the DesireDeal platform, with room for future enhancements and scalability. 