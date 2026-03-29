import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

export default function ProfilePage() {
  const [user, setUser] = useState({ name: '', email: '', phone: '', skills: [], experience: '', education: '' });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [skillsStr, setSkillsStr] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setSkillsStr(data.skills?.join(', ') || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = { ...user, skills: skillsStr.split(',').map(s => s.trim()).filter(s => s) };
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedUser)
      });
      if (res.ok) {
        setSaved(true);
        setEditing(false);
        fetchProfile();
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="min-h-screen"><Navbar/><div className="p-10">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent mb-8">My Profile</h1>
        
        {saved && (
          <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6 shadow-sm border border-green-200 transition-all">
            Profile updated successfully!
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-blue-600 h-32 relative"></div>
          <div className="px-8 py-6 relative">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-blue-600 shadow-xl absolute -top-12 border-4 border-white">
              {user.name?.charAt(0)}
            </div>
            <div className="mt-12 mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
              </div>
              {!editing && (
                <button 
                  onClick={() => setEditing(true)}
                  className="bg-blue-50 text-blue-600 px-6 py-2 rounded-xl font-semibold hover:bg-blue-100 transition shadow-sm border border-blue-200"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input type="text" value={user.name} onChange={e => setUser({...user, name: e.target.value})} className="w-full border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <input type="text" value={user.phone || ''} onChange={e => setUser({...user, phone: e.target.value})} className="w-full border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Skills (comma separated)</label>
                    <input type="text" value={skillsStr} onChange={e => setSkillsStr(e.target.value)} placeholder="React, Node.js, Python" className="w-full border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Experience</label>
                    <textarea value={user.experience || ''} onChange={e => setUser({...user, experience: e.target.value})} className="w-full border-gray-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Education</label>
                    <textarea value={user.education || ''} onChange={e => setUser({...user, education: e.target.value})} className="w-full border-gray-300 rounded-lg p-3 h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
                  </div>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <button type="button" onClick={() => setEditing(false)} className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition shadow-sm">Cancel</button>
                  <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-200">Save Changes</button>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Phone</h3>
                    <p className="text-gray-900 font-medium">{user.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.skills?.length > 0 ? user.skills.map((s, i) => (
                        <span key={i} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">{s}</span>
                      )) : <span className="text-gray-500">Not provided</span>}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2"><span className="text-blue-600">💼</span> Experience</h3>
                  <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm text-gray-700 whitespace-pre-line leading-relaxed">
                    {user.experience || 'Not provided'}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2"><span className="text-blue-600">🎓</span> Education</h3>
                  <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm text-gray-700 whitespace-pre-line leading-relaxed">
                    {user.education || 'Not provided'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
