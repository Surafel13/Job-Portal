import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ChatWindow from '../components/ChatWindow';

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const currentUserId = JSON.parse(localStorage.getItem('user'))?.id;

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/chat/conversations', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) setConversations(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-[1200px] w-full mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 w-fit bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
          Your Conversations
        </h1>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin h-10 w-10 border-4 border-blue-600 rounded-full border-t-transparent" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="bg-white p-20 rounded-2xl text-center shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-gray-500 font-medium text-lg mb-2">No conversations yet.</p>
            <p className="text-sm text-gray-400">Reach out to candidates or companies to start chatting!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conversations.map((c) => (
              <div 
                key={c.user._id} 
                onClick={() => setSelectedUser(c.user)}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-300 hover:shadow-xl transition flex flex-col cursor-pointer relative"
              >
                {!c.lastMessage.read && c.lastMessage.receiverId === currentUserId && (
                   <span className="absolute top-4 right-4 bg-blue-600 w-3 h-3 rounded-full animate-pulse shadow-md shadow-blue-200" />
                )}
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                    {c.user.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900 truncate">{c.user.name}</h3>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">{c.user.role === 'user' ? 'Worker' : 'Company'}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl border border-gray-50 flex-1">
                  <p className="text-sm text-gray-600 line-clamp-2 italic">
                    {c.lastMessage.senderId === currentUserId ? 'You: ' : ''}{c.lastMessage.content}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-2 text-right">
                    {new Date(c.lastMessage.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedUser && (
        <ChatWindow 
          otherUser={selectedUser} 
          onClose={() => {
            setSelectedUser(null);
            fetchConversations(); // refresh list to update unread status
          }} 
        />
      )}
    </div>
  );
}
