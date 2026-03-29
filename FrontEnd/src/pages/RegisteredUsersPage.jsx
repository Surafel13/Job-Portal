import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ChatWindow from '../components/ChatWindow';

export default function RegisteredUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.ok) setUsers(await res.json());
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
          Registered Workers
        </h1>
        {loading ? (
             <div className="flex justify-center p-12">
               <div className="animate-spin h-10 w-10 border-4 border-blue-600 rounded-full border-t-transparent" />
             </div>
        ) : users.length === 0 ? (
             <div className="bg-white p-10 rounded-2xl text-center shadow-sm border border-gray-100 flex flex-col items-center">
               <div className="text-6xl mb-4">👥</div>
               <p className="text-gray-500 font-medium text-lg mb-6">No users registered yet.</p>
             </div>
        ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map(u => (
                  <div key={u._id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-300 hover:shadow-xl transition flex flex-col">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0 border-2 border-white">
                        {u.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 truncate">{u.name}</h3>
                        <p className="text-sm text-gray-500 truncate">{u.email}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 flex-1">
                      {u.phone && (
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                           <span className="mt-0.5">📞</span> <span className="truncate">{u.phone}</span>
                        </div>
                      )}
                      
                      {u.skills && u.skills.length > 0 && (
                        <div className="mt-4">
                           <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Skills</p>
                           <div className="flex flex-wrap gap-1.5 line-clamp-2 overflow-hidden max-h-16">
                             {u.skills.map((s, i) => (
                               <span key={i} className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-md font-medium">{s}</span>
                             ))}
                           </div>
                        </div>
                      )}
                      
                      {u.experience && (
                        <div className="mt-4">
                           <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Experience</p>
                           <p className="text-sm text-gray-700 line-clamp-2">{u.experience}</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-5 pt-4 border-t border-gray-100 flex gap-2">
                       <button 
                         onClick={() => setActiveChatUser(u)}
                         className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl border border-blue-200 transition shadow-lg shadow-blue-100"
                        >
                          Chat Now
                       </button>
                       <a href={`mailto:${u.email}`} className="px-4 text-center bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium py-2.5 rounded-xl border border-gray-200 transition">
                          ✉️
                       </a>
                    </div>
                  </div>
                ))}
             </div>
        )}
      </div>

      {activeChatUser && (
        <ChatWindow 
           otherUser={activeChatUser} 
           onClose={() => setActiveChatUser(null)} 
        />
      )}
    </div>
  );
}
