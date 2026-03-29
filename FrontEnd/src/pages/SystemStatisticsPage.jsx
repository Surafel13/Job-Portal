import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

export default function SystemStatisticsPage() {
  const [stats, setStats] = useState({ users: 0, companies: 0, jobs: 0, applications: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.ok) setStats(await res.json());
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
          System Statistics
        </h1>
        {loading ? (
             <div className="flex justify-center p-12">
               <div className="animate-spin h-10 w-10 border-4 border-blue-600 rounded-full border-t-transparent" />
             </div>
        ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Total Workers", count: stats.users, icon: "👥", color: "bg-blue-600" },
                  { label: "Total Companies", count: stats.companies, icon: "🏢", color: "bg-purple-600" },
                  { label: "Total Jobs", count: stats.jobs, icon: "💼", color: "bg-indigo-600" },
                  { label: "Total Applications", count: stats.applications, icon: "📄", color: "bg-green-600" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                    <div className="relative">
                      <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg mb-6`}>
                        {stat.icon}
                      </div>
                      <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">{stat.label}</h3>
                      <p className="text-4xl font-extrabold text-gray-900">{stat.count}</p>
                    </div>
                  </div>
                ))}
             </div>
        )}
      </div>
    </div>
  );
}
