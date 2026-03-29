import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ChatWindow from '../components/ChatWindow';

export default function CompanyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChatUser, setActiveChatUser] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/applications/company-applications', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) setApplications(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    if(!window.confirm(`Are you sure you want to mark this application as ${status}?`)) return;
    try {
      const res = await fetch(`http://localhost:5000/api/applications/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchApplications();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-[1200px] w-full mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 w-fit bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
          Job Applications
        </h1>
        {loading ? (
             <div className="flex justify-center p-12">
               <div className="animate-spin h-10 w-10 border-4 border-blue-600 rounded-full border-t-transparent" />
             </div>
        ) : applications.length === 0 ? (
             <div className="bg-white p-10 rounded-2xl text-center shadow-sm border border-gray-100 flex flex-col items-center">
               <div className="text-6xl mb-4">Inbox</div>
               <p className="text-gray-500 font-medium text-lg mb-6">No applications received yet.</p>
             </div>
        ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {applications.map(app => (
                  <div key={app._id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-300 hover:shadow-xl transition flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 truncate">{app.user?.name || 'Unknown User'}</h3>
                        <p className="text-sm text-gray-500 truncate">Applied for: <span className="font-semibold text-gray-800">{app.job?.title || 'Unknown Job'}</span></p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${app.status === 'Accepted' ? 'bg-green-100 text-green-700' : app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {app.status || 'Pending'}
                      </span>
                    </div>
                    
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                         <span>✉️</span> <span className="truncate">{app.user?.email || 'N/A'}</span>
                      </div>
                      {app.user?.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                           <span>📞</span> <span className="truncate">{app.user?.phone}</span>
                        </div>
                      )}
                      
                      {app.user?.skills && app.user?.skills.length > 0 && (
                        <div className="mt-4">
                           <div className="flex flex-wrap gap-1.5 line-clamp-2 overflow-hidden max-h-16">
                             {app.user?.skills.map((s, i) => (
                               <span key={i} className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-md font-medium">{s}</span>
                             ))}
                           </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-5 space-y-3">
                      {app.cvPath && (
                        <a href={`http://localhost:5000/${app.cvPath.replace(/\\/g, '/')}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-2.5 rounded-xl border border-blue-200 transition">
                           📄 View Original CV
                        </a>
                      )}
                      
                      {app.status === 'Pending' && (
                        <div className="flex gap-3">
                           <button onClick={() => updateStatus(app._id, 'Accepted')} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 shadow-md shadow-green-200 rounded-xl transition">
                             Accept
                           </button>
                           <button onClick={() => updateStatus(app._id, 'Rejected')} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 shadow-md shadow-red-200 rounded-xl transition">
                             Reject
                           </button>
                           <button onClick={() => setActiveChatUser(app.user)} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl shadow-md shadow-blue-200 transition" title="Chat with Candidate">
                              💬
                           </button>
                         </div>
                       )}
                       {app.status === 'Accepted' && (
                          <button onClick={() => setActiveChatUser(app.user)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl shadow-md shadow-blue-200 transition flex items-center justify-center gap-2">
                             💬 Chat with Applicant
                          </button>
                       )}
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
