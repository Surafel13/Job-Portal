import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Screenshot 2026-03-12 120942.jpg';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <nav className="flex items-center justify-between px-10 py-6 bg-white shadow-sm">
        <div className="flex items-center gap-2 ml-6 text-2xl font-bold text-blue-600">
          <Link to="/">
            <img src={logo} alt="logo" className="h-12" />
          </Link>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-full font-bold transition-all shadow-md">
            Login
          </Link>
          <Link to="/signup" className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-2.5 rounded-full font-bold transition-all">
            Register
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center py-20 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 -m-32 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-0 left-0 -m-32 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-8">
            Find Your Dream Job <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Faster Than Ever.</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            The #1 modern portal designed to instantly connect top global companies with exceptionally skilled workers. Start applying today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link to="/signup" className="bg-[#0034D1] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#001D75] transition-all shadow-xl shadow-blue-200 hover:-translate-y-1">
               Get Started as Candidate
             </Link>
             <Link to="/login" className="bg-white text-gray-800 border-2 border-gray-100 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-50 hover:border-gray-200 transition-all">
               Browse Platform
             </Link>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full z-10">
           {[
             { title: "Thousands of Jobs", desc: "Access verified openings across multiple industries.", icon: "💼" },
             { title: "Company Connect", desc: "Interact directly with verified company employers.", icon: "🏢" },
             { title: "Secure CV Upload", desc: "Fast and secure document tracking for your career.", icon: "📄" },
           ].map((feat, i) => (
             <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-left hover:shadow-xl transition-shadow">
               <div className="text-4xl mb-4">{feat.icon}</div>
               <h3 className="text-xl font-bold text-gray-900 mb-2">{feat.title}</h3>
               <p className="text-gray-500 leading-relaxed">{feat.desc}</p>
             </div>
           ))}
        </div>
      </main>
    </div>
  );
}
