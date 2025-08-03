# Chat Feature Setup Guide

## Overview
This guide will help you set up the comprehensive chat feature that allows buyers and sellers to connect, share credentials, and exchange images in real-time.

## Features Implemented

### 🚀 **Real-time Chat Features:**
- **Instant Messaging**: Real-time text messages with Socket.IO
- **Image Sharing**: Upload and share images with captions
- **Credentials Sharing**: Secure sharing of payment details, contact info, etc.
- **Typing Indicators**: See when someone is typing
- **Read Receipts**: Know when messages are read
- **Unread Count**: Track unread messages
- **Chat History**: Persistent message storage

### 🔐 **Security Features:**
- **JWT Authentication**: Secure user authentication
- **File Upload Security**: Image validation and size limits
- **Credential Encryption**: Ready for encryption implementation
- **Access Control**: Users can only access their own chats

### 📱 **User Experience:**
- **Responsive Design**: Works on all devices
- **Modern UI**: Premium Indian-inspired design
- **Easy Navigation**: Intuitive chat interface
- **Quick Actions**: Fast access to common features

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install socket.io multer cloudinary
```

### 2. Environment Variables
Create a `.env` file in the backend directory:

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/desiredeal

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### 3. Cloudinary Setup
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your cloud name, API key, and API secret
3. Add them to your `.env` file

### 4. Start Backend Server
```bash
npm run dev
```

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install socket.io-client
```

### 2. Start Frontend Server
```bash
npm run dev
```

## Database Models

### Chat Model
- **participants**: Array of user IDs
- **lastMessage**: Reference to last message
- **lastMessageTime**: Timestamp of last message
- **unreadCount**: Map of user ID to unread count
- **isActive**: Boolean for chat status

### Message Model
- **chatId**: Reference to chat
- **sender**: Reference to user
- **content**: Message text
- **messageType**: 'text', 'image', 'credentials', 'file'
- **attachments**: Array of file attachments
- **credentials**: Structured credential data
- **isRead**: Boolean for read status
- **readBy**: Array of read receipts
- **replyTo**: Reference to replied message

## API Endpoints

### Chat Management
- `GET /api/chat/chats` - Get user's chats
- `GET /api/chat/chat/:participantId` - Get or create chat
- `GET /api/chat/chat/:chatId/messages` - Get chat messages
- `PUT /api/chat/chat/:chatId/read` - Mark messages as read
- `GET /api/chat/unread-count` - Get unread count

### Messaging
- `POST /api/chat/message` - Send text message
- `POST /api/chat/message/image` - Send image message
- `POST /api/chat/message/credentials` - Send credentials
- `DELETE /api/chat/message/:messageId` - Delete message

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
- `new-message-notification` - Message notification
- `user-typing` - User started typing
- `user-stopped-typing` - User stopped typing
- `messages-read` - Messages marked as read

## Usage Guide

### For Buyers:
1. **Start Chat**: Click the chat button in the header or on product cards
2. **Send Messages**: Type and send text messages
3. **Share Images**: Click the image icon to upload and share photos
4. **Share Credentials**: Use the credentials button to share payment details
5. **View History**: All conversations are saved and accessible

### For Sellers:
1. **Receive Messages**: Get real-time notifications of new messages
2. **Respond**: Reply to buyer inquiries instantly
3. **Share Details**: Send product information, pricing, and credentials
4. **Manage Chats**: View all active conversations

### Credential Types Supported:
- **Bank Account Details**: Account holder, number, IFSC, bank name
- **UPI ID**: UPI ID and name
- **Phone Number**: Phone and name
- **Email Address**: Email and name
- **Address**: Full address, city, state, pincode

## Security Considerations

### Implemented:
- JWT token authentication
- User access control
- File type validation
- File size limits (5MB for images)
- Secure file uploads to Cloudinary

### Recommended Additions:
- Message encryption for sensitive data
- Rate limiting for message sending
- File virus scanning
- Message retention policies
- GDPR compliance features

## Troubleshooting

### Common Issues:

1. **Socket Connection Failed**
   - Check if backend server is running
   - Verify JWT token is valid
   - Check CORS configuration

2. **Image Upload Fails**
   - Verify Cloudinary credentials
   - Check file size (max 5MB)
   - Ensure file is an image

3. **Messages Not Sending**
   - Check user authentication
   - Verify chat permissions
   - Check database connection

4. **Real-time Updates Not Working**
   - Check Socket.IO connection
   - Verify event handlers are set up
   - Check browser console for errors

## Performance Optimization

### Implemented:
- Message pagination
- Efficient database queries
- Image compression
- Connection pooling

### Recommended:
- Message caching with Redis
- Image CDN optimization
- Database indexing
- Load balancing for Socket.IO

## Future Enhancements

### Planned Features:
- **Voice Messages**: Audio recording and sharing
- **Video Calls**: Integrated video calling
- **File Sharing**: Document and file uploads
- **Message Reactions**: Emoji reactions to messages
- **Message Search**: Search through chat history
- **Chat Groups**: Group conversations
- **Message Scheduling**: Schedule messages for later
- **Chat Export**: Export chat history

### Advanced Features:
- **AI Chatbot**: Automated responses
- **Message Translation**: Multi-language support
- **Voice-to-Text**: Speech recognition
- **Chat Analytics**: Message insights and analytics
- **Custom Themes**: Personalized chat appearance

## Support

For technical support or questions about the chat feature:
1. Check the troubleshooting section
2. Review the API documentation
3. Check browser console for errors
4. Verify all environment variables are set correctly

## License

This chat feature is part of the DesireDeal marketplace and follows the same licensing terms. 