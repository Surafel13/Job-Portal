import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/applications/my-applications', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
          const data = await res.json();
          setApplications(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-[1200px] mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 w-fit bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
          My Applications
        </h1>
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin h-10 w-10 border-4 border-blue-600 rounded-full border-t-transparent" />
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center text-gray-500">
            <div className="text-6xl mb-6">📂</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No applications yet</h2>
            <p className="mb-8 max-w-md mx-auto">Start browsing open roles and find your next big opportunity!</p>
            <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition shadow-lg shadow-blue-200">
              Browse Jobs Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map(app => (
              <div key={app._id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-300 transition-all hover:shadow-xl group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-700 font-bold text-xl shadow-inner group-hover:bg-blue-600 group-hover:text-white transition">
                    {app.job?.company?.charAt(0) || 'J'}
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${app.status === 'Pending' ? 'bg-orange-100 text-orange-800' : app.status === 'Accepted' ? 'bg-green-100 text-green-800' : app.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                    {app.status}
                  </span>
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-1 group-hover:text-blue-600 transition truncate">{app.job?.title}</h3>
                <p className="text-gray-500 text-sm font-medium mb-4">{app.job?.company}</p>
                
                <div className="flex items-center text-sm text-gray-400 mb-6">
                  <span className="bg-gray-50 px-3 py-1 rounded-md border border-gray-100">Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                </div>
                
                <Link to={`/job/${app.job?._id}`} className="block w-full text-center font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 py-2.5 rounded-xl transition">
                  View Job Listing
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
