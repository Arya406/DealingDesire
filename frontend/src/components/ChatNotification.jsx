import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiMessageSquare } from 'react-icons/fi';

const ChatNotification = ({ newMessage, senderName, messageContent }) => {
  useEffect(() => {
    if (newMessage && senderName) {
      toast.info(
        <div className="chat-notification">
          <div className="notification-header">
            <FiMessageSquare className="notification-icon" />
            <span className="notification-sender">{senderName}</span>
          </div>
          <div className="notification-content">
            {messageContent.length > 50 
              ? `${messageContent.substring(0, 50)}...` 
              : messageContent
            }
          </div>
        </div>,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
  }, [newMessage, senderName, messageContent]);

  return null;
};

export default ChatNotification; 