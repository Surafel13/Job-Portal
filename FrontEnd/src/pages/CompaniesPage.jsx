import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';


export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';
  const [newCompany, setNewCompany] = useState({ name: '', industry: '', location: '', website: '', description: '', contactEmail: '', password: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/companies');
      if (res.ok) setCompanies(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `http://localhost:5000/api/companies/${editingId}` : 'http://localhost:5000/api/companies';
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newCompany)
      });
      if (res.ok) {
        setNewCompany({ name: '', industry: '', location: '', website: '', description: '', contactEmail: '', password: '' });
        setEditingId(null);
        fetchCompanies();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (c) => {
    setEditingId(c._id);
    setNewCompany({
      name: c.name,
      industry: c.industry || '',
      location: c.location || '',
      website: c.website || '',
      description: c.description || '',
      contactEmail: c.contactEmail || '',
      password: '' // Keep empty to not update unless backend handles it
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this company?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/companies/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) fetchCompanies();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-[1200px] mx-auto py-10 px-4 flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 w-fit bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
            Registered Companies
          </h1>
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin h-10 w-10 border-4 border-blue-600 rounded-full border-t-transparent" />
            </div>
          ) : companies.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl text-center shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="text-6xl mb-4">🏢</div>
              <p className="text-gray-500 font-medium text-lg mb-6">No companies registered yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {companies.map(c => (
                <div key={c._id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-300 hover:shadow-xl transition group flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-700 font-bold text-3xl shadow-inner group-hover:bg-blue-600 group-hover:text-white transition">
                      {c.name.charAt(0)}
                    </div>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(c)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition" title="Edit Company">
                          ✏️
                        </button>
                        <button onClick={() => handleDelete(c._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Delete Company">
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                  <Link to={`/company/${c._id}`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 truncate hover:text-blue-600 transition">{c.name}</h3>
                  </Link>
                  <div className="text-sm text-gray-500 space-y-1.5 mb-5 flex-1 line-clamp-3 leading-relaxed">
                    {c.description ? c.description : 'No description provided.'}
                  </div>
                  <div className="mt-auto border-t border-gray-100 pt-4 space-y-2 mt-4">
                    <span className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg w-fit">📍 {c.location || 'N/A'}</span>
                    {c.website && (
                      <a href={c.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition py-1">
                        🔗 Visit Website
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {isAdmin && (
          <div className="lg:w-[350px] flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-blue-600 text-xl">{editingId ? '✏️' : '+'}</span> {editingId ? 'Edit Company' : 'Add Company'}
              </h2>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setNewCompany({ name: '', industry: '', location: '', website: '', description: '', contactEmail: '', password: '' }); }} className="text-xs text-blue-600 hover:underline mb-4 block">
                  Cancel Edit
                </button>
              )}
              <form onSubmit={handleAddCompany} className="space-y-4">
                {[
                  { label: 'Name', key: 'name', type: 'text', placeholder: 'Tech Corp' },
                  { label: 'Login Email', key: 'contactEmail', type: 'email', placeholder: 'info@techcorp.com', readOnly: !!editingId },
                  { label: 'Login Password', key: 'password', type: 'text', placeholder: editingId ? 'Leave blank to keep same' : 'Initial password' },
                  { label: 'Industry', key: 'industry', type: 'text', placeholder: 'Software' },
                  { label: 'Location', key: 'location', type: 'text', placeholder: 'City, Country' },
                  { label: 'Website', key: 'website', type: 'url', placeholder: 'https://example.com' },
                ].map(({ label, key, type, placeholder, readOnly }) => (
                  <div key={key}>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{label}</label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={newCompany[key]}
                      onChange={(e) => setNewCompany({ ...newCompany, [key]: e.target.value })}
                      disabled={readOnly}
                      className={`w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      required={key === 'name' || (!editingId && key === 'contactEmail')}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                  <textarea
                    placeholder="Short description..."
                    value={newCompany.description}
                    onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm h-28 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#0034D1] text-white py-3 rounded-xl font-bold hover:bg-[#001D75] transition shadow-lg shadow-blue-100 mt-2"
                >
                  {editingId ? 'Update Company' : 'Add Company'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
