import React, { useState } from 'react';
import Navbar from '../components/Navbar';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');
    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus('Message sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus(''), 5000);
      } else {
        setStatus('Failed to send message.');
      }
    } catch (err) {
      console.error(err);
      setStatus('Failed to send message.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-[1200px] w-full mx-auto py-12 px-4 flex flex-col lg:flex-row gap-12">
        
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500">Touch</span>
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-lg leading-relaxed">
            Have questions about our job portal, need help with your application, or want to partner with us? Our team is here to help and will respond as soon as possible.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition hover:shadow-md">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold shadow-inner">📍</div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Headquarters</h3>
                <p className="text-gray-500">123 Business Avenue, Tech District</p>
              </div>
            </div>
            
            <div className="flex items-center gap-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition hover:shadow-md">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold shadow-inner">📞</div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Phone</h3>
                <p className="text-gray-500">+1 (555) 123-4567</p>
              </div>
            </div>
            
            <div className="flex items-center gap-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition hover:shadow-md">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold shadow-inner">✉️</div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Email</h3>
                <p className="text-gray-500">contact@jobsphere.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
             {status && (
               <div className={`p-4 rounded-xl mb-6 text-sm font-bold border ${status.includes('successfully') ? 'bg-green-50 text-green-800 border-green-200' : 'bg-blue-50 text-blue-800 border-blue-200'} transition-all`}>
                 {status}
               </div>
             )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3.5 focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white outline-none transition" required placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3.5 focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white outline-none transition" required placeholder="john@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                <input type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3.5 focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white outline-none transition" required placeholder="How can we help?" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                <textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3.5 h-36 focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white outline-none transition resize-none" required placeholder="Your message here..." />
              </div>
              <button type="submit" className="w-full bg-[#0034D1] hover:bg-[#001D75] text-white py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-blue-200 mt-2">
                Send Message
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
