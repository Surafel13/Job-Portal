import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';

const ChatWindow = ({ otherUser, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { socket, setActiveChatId, fetchUnreadCount } = useChat();
  const currentUserId = JSON.parse(localStorage.getItem('user'))?.id;
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setActiveChatId(otherUser._id);
    fetchMessages();
    markAsRead();
    
    if (socket) {
      socket.on('receiveMessage', (message) => {
        if (
          (message.senderId === currentUserId && message.receiverId === otherUser._id) ||
          (message.senderId === otherUser._id && message.receiverId === currentUserId)
        ) {
          setMessages((prev) => [...prev, message]);
          
          if (message.senderId === otherUser._id) {
             markAsRead(); // Real-time read if visible
          }
        }
      });
    }

    return () => {
      setActiveChatId(null);
      if (socket) socket.off('receiveMessage');
    };
  }, [otherUser._id, socket, currentUserId, setActiveChatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/chat/messages/${otherUser._id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) setMessages(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/chat/read/${otherUser._id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) fetchUnreadCount();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    socket.emit('sendMessage', {
      senderId: currentUserId,
      receiverId: otherUser._id,
      content: newMessage
    });

    setNewMessage('');
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-[600px] h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col border border-blue-100 z-50 animate-in slide-in-from-bottom-5 duration-300">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-700 to-blue-500 rounded-t-2xl flex items-center justify-between text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">
            {otherUser.name?.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-sm leading-none mb-1">{otherUser.name}</h3>
            <p className="text-[10px] opacity-80 uppercase tracking-widest font-semibold">{otherUser.role === 'user' ? 'Worker' : 'Company'}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 scrollbar-thin scrollbar-thumb-gray-200">
        {loading ? (
          <div className="h-full flex items-center justify-center italic text-gray-400 text-sm">Loading chat...</div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
             <div className="text-4xl mb-2 opacity-50">👋</div>
             <p className="text-sm font-medium">Say hello to {otherUser.name}!</p>
             <p className="text-[10px] mt-1 opacity-70">Start a conversation to discuss this role.</p>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m._id} className={`flex ${m.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm relative group ${m.senderId === currentUserId ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}`}>
                <p className="text-sm leading-relaxed">{m.content}</p>
                <span className={`text-[9px] mt-1.5 block opacity-50 ${m.senderId === currentUserId ? 'text-white' : 'text-gray-400'}`}>
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {m.senderId === currentUserId && m.read && (
                    <span className="text-[8px] absolute -bottom-4 right-0 text-blue-400 font-bold uppercase tracking-tighter">Read</span>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white rounded-b-2xl border-t border-gray-100 flex gap-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 transition transform active:scale-95 shadow-lg shadow-blue-100 group"
        >
          <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
