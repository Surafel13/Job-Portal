import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

export default function CompanyDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [editingId, setEditingId] = useState(null);
  const [newJob, setNewJob] = useState({ title: '', company: '', location: '', description: '', type: 'Full-time', salary: '', experience: '', status: 'active' });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/jobs/my-jobs', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) setJobs(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `http://localhost:5000/api/jobs/${editingId}` : 'http://localhost:5000/api/jobs';
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newJob)
      });
      if (res.ok) {
        setNewJob({ title: '', company: '', location: '', description: '', type: 'Full-time', salary: '', experience: '', status: 'active' });
        setEditingId(null);
        setShowForm(false);
        fetchJobs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (job) => {
    setEditingId(job._id);
    setNewJob({
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      type: job.type || 'Full-time',
      salary: job.salary || '',
      experience: job.experience || '',
      status: job.status || 'active'
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this job post?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (job) => {
    const newStatus = job.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${job._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-[1200px] w-full mx-auto py-10 px-4">
        <div className="flex items-center justify-between mb-8">
           <h1 className="text-3xl font-bold text-gray-900 w-fit bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
             Company Dashboard
           </h1>
           <button 
             onClick={() => { setShowForm(!showForm); setEditingId(null); setNewJob({ title: '', company: '', location: '', description: '', type: 'Full-time', salary: '', experience: '', status: 'active' }); }} 
             className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-200 transition"
           >
             {showForm ? 'Cancel Form' : '+ Post New Job'}
           </button>
        </div>

        {showForm && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 animate-in fade-in slide-in-from-top-4">
            <h2 className="text-xl font-bold mb-6">{editingId ? 'Edit Job Posting' : 'Create New Job'}</h2>
            <form onSubmit={handleSaveJob} className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {[
                 { label: 'Job Title', key: 'title', type: 'text' },
                 { label: 'Company Name', key: 'company', type: 'text' },
                 { label: 'Location', key: 'location', type: 'text' },
                 { label: 'Salary (Optional)', key: 'salary', type: 'text' },
                 { label: 'Experience (Optional)', key: 'experience', type: 'text' },
               ].map(f => (
                 <div key={f.key}>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{f.label}</label>
                   <input type={f.type} value={newJob[f.key]} onChange={e => setNewJob({...newJob, [f.key]: e.target.value})} className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-blue-500 outline-none" required={['title', 'company', 'location'].includes(f.key)} />
                 </div>
               ))}
               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Job Type</label>
                 <select value={newJob.type} onChange={e => setNewJob({...newJob, type: e.target.value})} className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-blue-500 outline-none">
                   <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Remote</option>
                 </select>
               </div>
               <div className="md:col-span-2">
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Job Description</label>
                 <textarea value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} className="w-full border border-gray-200 rounded-lg p-3 text-sm h-32 focus:border-blue-500 outline-none" required />
               </div>
               <div className="md:col-span-2">
                 <button type="submit" className="w-full bg-[#0034D1] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#001D75] transition shadow-lg shadow-blue-200">
                   {editingId ? 'Update Job Posting' : 'Publish Job'}
                 </button>
               </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
           <div className="p-6 border-b border-gray-100 bg-gray-50">
             <h2 className="text-xl font-bold flex items-center gap-2"><span>📋</span> Posted Jobs</h2>
           </div>
           
           {loading ? (
             <div className="p-10 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent" /></div>
           ) : jobs.length === 0 ? (
             <div className="p-10 text-center text-gray-500">You haven't posted any jobs yet.</div>
           ) : (
             <div className="divide-y divide-gray-100">
                {jobs.map(job => (
                  <div key={job._id} className="p-6 hover:bg-gray-50 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                     <div>
                       <div className="flex items-center gap-3 mb-1">
                          <Link to={`/job/${job._id}`} className="text-lg font-bold text-gray-900 hover:text-blue-600 transition">{job.title}</Link>
                          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg ${job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                            {job.status || 'active'}
                          </span>
                       </div>
                       <div className="text-sm text-gray-500 flex gap-4">
                         <span>📍 {job.location}</span>
                         <span>👥 {job.applicants || 0} Applicants</span>
                       </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <Link to="/company-applications" className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold hover:bg-blue-100 transition">
                          View Applicants
                        </Link>
                        <button onClick={() => toggleStatus(job)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition">
                          {job.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => handleEdit(job)} className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">✏️</button>
                        <button onClick={() => handleDelete(job._id)} className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">🗑️</button>
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
