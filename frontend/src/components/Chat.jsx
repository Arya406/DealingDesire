import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';
import ChatService from '../services/chatService';
import { toast } from 'react-toastify';
import { 
  FiSend, 
  FiImage, 
  FiFile, 
  FiUser, 
  FiMessageSquare, 
  FiX, 
  FiMoreVertical,
  FiTrash2,
  FiCopy,
  FiEye,
  FiEyeOff,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import { 
  FaRupeeSign, 
  FaCreditCard, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaShieldAlt,
  FaCrown
} from 'react-icons/fa';
import './Chat.css';

const Chat = ({ isOpen, onClose, selectedProduct = null, initialChatId = null }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageCaption, setImageCaption] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [showChatList, setShowChatList] = useState(true);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Initialize chat service connection
  useEffect(() => {
    if (user && isOpen) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          ChatService.connect(token);
          loadChats();
          loadUnreadCount();
        } catch (error) {
          console.error('Failed to initialize chat service:', error);
          toast.error('Chat service is currently unavailable. Please try again later.');
        }
      }
    }

    return () => {
      if (selectedChat) {
        ChatService.leaveChat(selectedChat._id);
      }
    };
  }, [user, isOpen]);

  // Handle initial chat selection
  useEffect(() => {
    if (initialChatId && chats.length > 0) {
      const chat = chats.find(c => c._id === initialChatId);
      if (chat) {
        selectChat(chat);
      }
    }
  }, [initialChatId, chats]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load user's chats
  const loadChats = async () => {
    try {
      setLoading(true);
      const chatsData = await ChatService.getUserChats();
      setChats(chatsData);
      
      // If no chat is selected and we have chats, select the first one
      if (!selectedChat && chatsData.length > 0) {
        selectChat(chatsData[0]);
      }
    } catch (error) {
      console.error('Error loading chats:', error);
      toast.error('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  // Load unread count
  const loadUnreadCount = async () => {
    try {
      const { unreadCount } = await ChatService.getUnreadCount();
      setUnreadCount(unreadCount);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  // Load messages for selected chat
  const loadMessages = async (chatId) => {
    try {
      setLoading(true);
      const messagesData = await ChatService.getChatMessages(chatId);
      setMessages(messagesData);
      
      // Join chat room for real-time updates
      ChatService.joinChat(chatId);
      
      // Set up real-time message handlers
      ChatService.onMessage(chatId, handleNewMessage);
      ChatService.onTyping(chatId, handleTypingUpdate);
      ChatService.onRead(chatId, handleReadUpdate);
      
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle new message from real-time updates
  const handleNewMessage = useCallback((message) => {
    setMessages(prev => [...prev, message]);
    loadUnreadCount(); // Update unread count
  }, []);

  // Handle typing indicators
  const handleTypingUpdate = useCallback((userId, isTyping) => {
    setTypingUsers(prev => {
      const newSet = new Set(prev);
      if (isTyping) {
        newSet.add(userId);
      } else {
        newSet.delete(userId);
      }
      return newSet;
    });
  }, []);

  // Handle read receipts
  const handleReadUpdate = useCallback((readerId, messageIds) => {
    setMessages(prev => prev.map(msg => 
      messageIds.includes(msg._id) 
        ? { ...msg, isRead: true, readBy: [...(msg.readBy || []), { user: readerId, readAt: new Date() }] }
        : msg
    ));
  }, []);

  // Select a chat
  const selectChat = async (chat) => {
    if (selectedChat) {
      ChatService.leaveChat(selectedChat._id);
    }
    
    setSelectedChat(chat);
    setShowChatList(false);
    await loadMessages(chat._id);
  };

  // Send text message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const message = await ChatService.sendTextMessage(selectedChat._id, newMessage.trim());
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Send real-time update
      ChatService.sendMessage(selectedChat._id, message);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  // Handle typing
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    // Send typing indicator
    if (selectedChat) {
      ChatService.startTyping(selectedChat._id);
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        ChatService.stopTyping(selectedChat._id);
      }, 2000);
    }
  };

  // Handle image upload
  const handleImageUpload = async () => {
    if (!selectedImage || !selectedChat) return;

    try {
      const message = await ChatService.sendImageMessage(selectedChat._id, selectedImage, imageCaption);
      setMessages(prev => [...prev, message]);
      setSelectedImage(null);
      setImageCaption('');
      setShowImageUpload(false);
      
      // Send real-time update
      ChatService.sendMessage(selectedChat._id, message);
      toast.success('Image sent successfully!');
    } catch (error) {
      console.error('Error sending image:', error);
      toast.error('Failed to send image. Please try again.');
    }
  };

  // Handle credentials sharing
  const handleCredentialsShare = async (credentialType, title, data) => {
    if (!selectedChat) return;

    try {
      const message = await ChatService.sendCredentialsMessage(selectedChat._id, credentialType, title, data);
      setMessages(prev => [...prev, message]);
      setShowCredentialsModal(false);
      
      // Send real-time update
      ChatService.sendMessage(selectedChat._id, message);
      toast.success('Credentials shared successfully!');
    } catch (error) {
      console.error('Error sending credentials:', error);
      toast.error('Failed to share credentials. Please try again.');
    }
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get other participant in chat
  const getOtherParticipant = (chat) => {
    return chat.participants.find(p => p._id !== user.id);
  };

  // Render message content based on type
  const renderMessageContent = (message) => {
    switch (message.messageType) {
      case 'image':
        return (
          <div className="message-image">
            <img src={message.attachments[0].url} alt="Shared image" />
            {message.content !== 'Image' && <p>{message.content}</p>}
          </div>
        );
      
      case 'credentials':
        return (
          <div className="message-credentials">
            <div className="credentials-header">
              <FaShieldAlt className="credentials-icon" />
              <span>{message.credentials.title}</span>
            </div>
            <div className="credentials-content">
              {Object.entries(message.credentials.data).map(([key, value]) => (
                <div key={key} className="credential-item">
                  <span className="credential-label">{key}:</span>
                  <span className="credential-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return <p>{message.content}</p>;
    }
  };

  // Credentials templates
  const credentialTemplates = [
    {
      type: 'bank_details',
      title: 'Bank Account Details',
      icon: FaCreditCard,
      fields: ['Account Holder', 'Account Number', 'IFSC Code', 'Bank Name']
    },
    {
      type: 'upi_id',
      title: 'UPI ID',
      icon: FaRupeeSign,
      fields: ['UPI ID', 'Name']
    },
    {
      type: 'phone',
      title: 'Phone Number',
      icon: FaPhone,
      fields: ['Phone Number', 'Name']
    },
    {
      type: 'email',
      title: 'Email Address',
      icon: FaEnvelope,
      fields: ['Email', 'Name']
    },
    {
      type: 'address',
      title: 'Address',
      icon: FaMapMarkerAlt,
      fields: ['Full Address', 'City', 'State', 'Pincode']
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="chat-container">
      <div className="chat-overlay" onClick={onClose}></div>
      <div className="chat-modal">
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-header-left">
            <button 
              className="back-btn"
              onClick={() => setShowChatList(true)}
              style={{ display: selectedChat && !showChatList ? 'block' : 'none' }}
            >
              <FiChevronDown />
            </button>
            <h2>Messages</h2>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount}</span>
            )}
          </div>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="chat-content">
          {/* Chat List */}
          {showChatList && (
            <div className="chat-list">
              {loading ? (
                <div className="loading">Loading chats...</div>
              ) : chats.length === 0 ? (
                <div className="no-chats">
                  <FiMessageSquare className="no-chats-icon" />
                  <p>No conversations yet</p>
                  <p>Start chatting with sellers to discuss products</p>
                </div>
              ) : (
                chats.map(chat => {
                  const otherUser = getOtherParticipant(chat);
                  return (
                    <div 
                      key={chat._id} 
                      className={`chat-item ${selectedChat?._id === chat._id ? 'active' : ''}`}
                      onClick={() => selectChat(chat)}
                    >
                      <div className="chat-item-avatar">
                        <FiUser />
                      </div>
                      <div className="chat-item-content">
                        <div className="chat-item-header">
                          <h4>{otherUser.name}</h4>
                          <span className="chat-time">
                            {chat.lastMessageTime ? formatTime(chat.lastMessageTime) : ''}
                          </span>
                        </div>
                        <div className="chat-item-message">
                          <p>{chat.lastMessage?.content || 'No messages yet'}</p>
                          {chat.unreadCount > 0 && (
                            <span className="unread-count">{chat.unreadCount}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Chat Messages */}
          {selectedChat && !showChatList && (
            <div className="chat-messages">
              {/* Chat Info Header */}
              <div className="chat-info-header">
                <div className="chat-participant">
                  <div className="participant-avatar">
                    <FiUser />
                  </div>
                  <div className="participant-info">
                    <h3>{getOtherParticipant(selectedChat).name}</h3>
                    <span className="participant-role">
                      {getOtherParticipant(selectedChat).role === 'seller' ? 'Seller' : 'Buyer'}
                    </span>
                  </div>
                </div>
                <div className="chat-actions">
                  <button className="action-btn">
                    <FiMoreVertical />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="messages-area">
                {loading ? (
                  <div className="loading">Loading messages...</div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <div 
                        key={message._id} 
                        className={`message ${message.sender._id === user.id ? 'sent' : 'received'}`}
                      >
                        <div className="message-content">
                          {renderMessageContent(message)}
                          <div className="message-meta">
                            <span className="message-time">{formatTime(message.createdAt)}</span>
                            {message.sender._id === user.id && (
                              <span className="message-status">
                                {message.isRead ? '✓✓' : '✓'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Typing Indicator */}
                    {typingUsers.size > 0 && (
                      <div className="typing-indicator">
                        <div className="typing-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        <span>Someone is typing...</span>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <div className="message-input">
                <div className="input-actions">
                  <button 
                    className="action-btn"
                    onClick={() => setShowImageUpload(true)}
                    title="Send Image"
                  >
                    <FiImage />
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => setShowCredentialsModal(true)}
                    title="Share Credentials"
                  >
                    <FaShieldAlt />
                  </button>
                </div>
                
                <div className="input-container">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={handleTyping}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <button className="send-btn" onClick={sendMessage}>
                    <FiSend />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Image Upload Modal */}
        {showImageUpload && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Send Image</h3>
                <button onClick={() => setShowImageUpload(false)}>
                  <FiX />
                </button>
              </div>
              <div className="modal-content">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => setSelectedImage(e.target.files[0])}
                  style={{ display: 'none' }}
                />
                <button 
                  className="upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {selectedImage ? selectedImage.name : 'Choose Image'}
                </button>
                <input
                  type="text"
                  placeholder="Add caption (optional)"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                />
              </div>
              <div className="modal-actions">
                <button onClick={() => setShowImageUpload(false)}>Cancel</button>
                <button 
                  onClick={handleImageUpload}
                  disabled={!selectedImage}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Credentials Modal */}
        {showCredentialsModal && (
          <div className="modal-overlay">
            <div className="modal credentials-modal">
              <div className="modal-header">
                <h3>Share Credentials</h3>
                <button onClick={() => setShowCredentialsModal(false)}>
                  <FiX />
                </button>
              </div>
              <div className="modal-content">
                <div className="credentials-templates">
                  {credentialTemplates.map((template) => (
                    <CredentialsForm
                      key={template.type}
                      template={template}
                      onShare={handleCredentialsShare}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Credentials Form Component
const CredentialsForm = ({ template, onShare }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    onShare(template.type, template.title, formData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="credential-template">
      <div 
        className="template-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <template.icon className="template-icon" />
        <span>{template.title}</span>
        {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
      </div>
      
      {isExpanded && (
        <form onSubmit={handleSubmit} className="template-form">
          {template.fields.map(field => (
            <div key={field} className="form-field">
              <label>{field}</label>
              <input
                type="text"
                value={formData[field] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                required
              />
            </div>
          ))}
          <button type="submit" className="share-btn">
            Share {template.title}
          </button>
        </form>
      )}
    </div>
  );
};

export default Chat; 