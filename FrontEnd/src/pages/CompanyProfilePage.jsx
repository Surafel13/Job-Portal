import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';

export default function CompanyProfilePage() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/companies/${id}`);
        if(res.ok) setCompany(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [id]);

  if(loading) return <div className="min-h-screen"><Navbar/><div className="p-10">Loading...</div></div>;
  if(!company) return <div className="min-h-screen"><Navbar/><div className="p-10">Company not found.</div></div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-[1000px] w-full mx-auto py-12 px-4">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-blue-600 h-32 relative"></div>
          <div className="px-8 py-6 relative">
             <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center text-5xl font-bold text-blue-600 shadow-xl absolute -top-12 border-4 border-white">
                {company.name.charAt(0)}
             </div>
             <div className="mt-12 mb-8">
               <h1 className="text-3xl font-extrabold text-gray-900">{company.name}</h1>
               <p className="text-gray-500 font-medium text-lg mt-1">{company.industry}</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
               <div className="space-y-4">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">📍</div>
                   <div>
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Location</p>
                     <p className="font-medium text-gray-900">{company.location || 'N/A'}</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">✉️</div>
                   <div>
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contact Email</p>
                     <p className="font-medium text-gray-900">{company.contactEmail || 'N/A'}</p>
                   </div>
                 </div>
                 {company.website && (
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">🔗</div>
                   <div>
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Website</p>
                     <a href={company.website} target="_blank" rel="noreferrer" className="font-bold text-blue-600 hover:underline">{company.website}</a>
                   </div>
                 </div>
                 )}
               </div>
               
               <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">About Us</h2>
                  <div className="bg-gray-50 p-6 rounded-2xl text-gray-700 leading-relaxed border border-gray-100 text-sm">
                    {company.description || 'This company has not provided a description yet.'}
                  </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
