import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeChatId, setActiveChatId] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user && !socket) {
      const newSocket = io('http://localhost:5000', {
        withCredentials: true,
        transports: ['websocket', 'polling'] // Try websocket first
      });
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Connected to socket', newSocket.id);
        newSocket.emit('join', user.id);
      });

      newSocket.on('receiveMessage', (message) => {
        if (message.receiverId === user.id && message.senderId !== activeChatId) {
          setUnreadCount(prev => prev + 1);
        }
      });

      return () => newSocket.close();
    }
  }, [user, socket]);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/chat/unread-count', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (user) fetchUnreadCount();
  }, [user, fetchUnreadCount]);

  return (
    <ChatContext.Provider value={{ socket, unreadCount, setUnreadCount, fetchUnreadCount, activeChatId, setActiveChatId }}>
      {children}
    </ChatContext.Provider>
  );
};
