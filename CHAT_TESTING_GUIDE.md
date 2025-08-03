# Chat Functionality Testing Guide

## 🎯 **Testing the Buyer-Seller Chat System**

### **Prerequisites:**
- Backend server running on port 5000
- Frontend server running on port 3000
- MongoDB database connected
- Cloudinary account configured (for image uploads)

---

## **1. Basic Chat Functionality Testing**

### **Step 1: User Registration & Login**
1. **Register as a Buyer:**
   - Go to `http://localhost:3000/register`
   - Create account with role "buyer"
   - Note down the user ID

2. **Register as a Seller:**
   - Open incognito window
   - Go to `http://localhost:3000/register`
   - Create account with role "seller"
   - Note down the user ID

### **Step 2: Access Chat Interface**
1. **As Buyer:**
   - Login to buyer account
   - Navigate to buyer dashboard
   - Click the chat button in the header (message icon)
   - Chat interface should open

2. **As Seller:**
   - Login to seller account
   - Navigate to seller dashboard
   - Click the chat button in the header
   - Chat interface should open

---

## **2. Real-time Messaging Testing**

### **Test Case 1: Text Messages**
1. **Start a Conversation:**
   - Buyer clicks "Chat with Seller" on any product
   - Chat window opens with seller
   - Type a message: "Hi, I'm interested in this product"
   - Click send or press Enter

2. **Verify Real-time Delivery:**
   - Seller should see message instantly
   - Message should appear in seller's chat list
   - Unread count should increment

3. **Seller Response:**
   - Seller types: "Hello! Thanks for your interest. What would you like to know?"
   - Buyer should see response immediately
   - Typing indicator should show

### **Test Case 2: Typing Indicators**
1. **Start Typing:**
   - Buyer starts typing a message
   - Seller should see "Someone is typing..." indicator
   - Stop typing for 2 seconds
   - Indicator should disappear

### **Test Case 3: Read Receipts**
1. **Message Read Status:**
   - Buyer sends a message
   - Seller opens the chat
   - Message should show "✓✓" (read)
   - Buyer should see read status update

---

## **3. Image Sharing Testing**

### **Test Case 4: Image Upload**
1. **Upload Image:**
   - Click the image icon in chat input
   - Select an image file (JPG, PNG, etc.)
   - Add optional caption: "Product image"
   - Click "Send"

2. **Verify Image Display:**
   - Image should appear in chat
   - Caption should display below image
   - Image should be responsive
   - Click image to view full size

### **Test Case 5: Image Validation**
1. **Test File Types:**
   - Try uploading non-image files (PDF, DOC)
   - Should show error: "Only image files are allowed"
   
2. **Test File Size:**
   - Try uploading image > 5MB
   - Should show file size limit error

---

## **4. Credentials Sharing Testing**

### **Test Case 6: Bank Details**
1. **Share Bank Details:**
   - Click the credentials button (shield icon)
   - Select "Bank Account Details"
   - Fill in:
     - Account Holder: "John Doe"
     - Account Number: "1234567890"
     - IFSC Code: "SBIN0001234"
     - Bank Name: "State Bank of India"
   - Click "Share Bank Account Details"

2. **Verify Display:**
   - Credentials should appear as structured card
   - Should show shield icon
   - Data should be clearly formatted

### **Test Case 7: UPI ID**
1. **Share UPI ID:**
   - Select "UPI ID" template
   - Fill in:
     - UPI ID: "john.doe@okicici"
     - Name: "John Doe"
   - Share credentials

### **Test Case 8: Contact Information**
1. **Share Phone/Email:**
   - Test phone number sharing
   - Test email address sharing
   - Verify all credential types work

---

## **5. Chat Management Testing**

### **Test Case 9: Chat List**
1. **Multiple Conversations:**
   - Create multiple chats with different sellers
   - Verify chat list shows all conversations
   - Check unread counts are accurate
   - Verify last message preview

### **Test Case 10: Chat Navigation**
1. **Switch Between Chats:**
   - Click on different chat items
   - Verify messages load correctly
   - Check unread counts reset
   - Verify typing indicators work per chat

### **Test Case 11: Message History**
1. **Persistent Messages:**
   - Send several messages
   - Refresh the page
   - Login again
   - Verify all messages are still there

---

## **6. Error Handling Testing**

### **Test Case 12: Network Issues**
1. **Disconnect Internet:**
   - Send message while offline
   - Should show error message
   - Reconnect and verify message sends

### **Test Case 13: Authentication**
1. **Token Expiry:**
   - Let JWT token expire
   - Try to send message
   - Should redirect to login

### **Test Case 14: Invalid Data**
1. **Empty Messages:**
   - Try to send empty message
   - Should be prevented
   
2. **Large Messages:**
   - Try to send very long message
   - Should handle gracefully

---

## **7. Performance Testing**

### **Test Case 15: Multiple Users**
1. **Concurrent Users:**
   - Open multiple browser tabs
   - Login as different users
   - Send messages simultaneously
   - Verify no conflicts

### **Test Case 16: Message Volume**
1. **High Message Count:**
   - Send 50+ messages in one chat
   - Verify performance remains good
   - Check memory usage

---

## **8. Mobile Responsiveness Testing**

### **Test Case 17: Mobile View**
1. **Responsive Design:**
   - Open chat on mobile device
   - Test touch interactions
   - Verify layout adapts correctly
   - Test image upload on mobile

### **Test Case 18: Tablet View**
1. **Tablet Optimization:**
   - Test on tablet screen size
   - Verify chat layout works well
   - Test split-screen functionality

---

## **9. Security Testing**

### **Test Case 19: Access Control**
1. **Unauthorized Access:**
   - Try to access chat without login
   - Try to access other user's chat
   - Should be denied access

### **Test Case 20: Data Validation**
1. **Input Sanitization:**
   - Send messages with HTML/script tags
   - Should be properly escaped
   - No XSS vulnerabilities

---

## **10. API Testing**

### **Test Case 21: REST API Endpoints**
1. **Chat Endpoints:**
   ```bash
   # Get user chats
   GET /api/chat/chats
   
   # Get or create chat
   GET /api/chat/chat/:participantId
   
   # Get messages
   GET /api/chat/chat/:chatId/messages
   
   # Send message
   POST /api/chat/message
   
   # Send image
   POST /api/chat/message/image
   
   # Send credentials
   POST /api/chat/message/credentials
   ```

### **Test Case 22: Socket.IO Events**
1. **Real-time Events:**
   - Test `join-chat` event
   - Test `new-message` event
   - Test `typing-start/stop` events
   - Test `message-read` event

---

## **Expected Results**

### **✅ Success Criteria:**
- Real-time message delivery within 1 second
- Image uploads work correctly
- Credentials display properly formatted
- Typing indicators show/hide correctly
- Read receipts update in real-time
- Chat history persists across sessions
- Mobile responsive design works
- Error handling provides clear feedback
- Security measures prevent unauthorized access

### **❌ Failure Criteria:**
- Messages don't deliver in real-time
- Images fail to upload
- Credentials don't display correctly
- Typing indicators don't work
- Chat history is lost
- Mobile layout is broken
- Security vulnerabilities exist

---

## **Troubleshooting Common Issues**

### **Issue 1: Messages Not Sending**
- Check Socket.IO connection
- Verify JWT token is valid
- Check browser console for errors

### **Issue 2: Images Not Uploading**
- Verify Cloudinary credentials
- Check file size limits
- Ensure file type is supported

### **Issue 3: Real-time Not Working**
- Check backend server is running
- Verify CORS configuration
- Check network connectivity

### **Issue 4: Chat Not Loading**
- Check MongoDB connection
- Verify user authentication
- Check API endpoints are accessible

---

## **Performance Benchmarks**

### **Target Metrics:**
- Message delivery: < 1 second
- Image upload: < 5 seconds
- Chat load time: < 2 seconds
- Memory usage: < 100MB per user
- Concurrent users: 100+

### **Monitoring:**
- Use browser dev tools
- Check network tab
- Monitor memory usage
- Test on different devices

---

## **Next Steps After Testing**

1. **Fix any issues found**
2. **Optimize performance if needed**
3. **Add additional features**
4. **Deploy to production**
5. **Monitor in production**

This comprehensive testing guide ensures your chat functionality works perfectly for buyers and sellers! 🚀 