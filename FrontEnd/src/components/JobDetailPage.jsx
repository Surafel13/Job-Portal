// src/components/JobDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPinIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import Navbar from "./Navbar";
import RelatedJobs from "./RelatedJobs";
import toast from "react-hot-toast";

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isLoggedIn = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [applyStatus, setApplyStatus] = useState("");
  const [applyLoading, setApplyLoading] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobRes = await fetch(`http://localhost:5000/api/jobs/${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!jobRes.ok) throw new Error('Job not found');
        const jobData = await jobRes.json();
        setJob(jobData);

        if (isLoggedIn) {
          const savedRes = await fetch('http://localhost:5000/api/jobs/saved', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          if (savedRes.ok) {
            const savedData = await savedRes.json();
            setSavedJobs(savedData);
          }

          if (user?.role !== 'admin' && user?.role !== 'company') {
            const appRes = await fetch('http://localhost:5000/api/applications/my-applications', {
              headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (appRes.ok) {
              const appData = await appRes.json();
              if (appData.some(app => app.job?._id === id)) {
                setHasApplied(true);
              }
            }
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isLoggedIn]);

  const handleSaveJob = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to save jobs.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/jobs/save/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const savedRes = await fetch('http://localhost:5000/api/jobs/saved', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (savedRes.ok) {
          const savedData = await savedRes.json();
          setSavedJobs(savedData);
        }
      }
    } catch (err) {
      console.error('Failed to save job');
    }
  };

  const isJobSaved = savedJobs.some(sj => sj._id === id);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!cvFile) return setApplyStatus("Please select a CV file.");
    setApplyLoading(true);
    setApplyStatus("");

    const formData = new FormData();
    formData.append("cv", cvFile);

    try {
      const res = await fetch(`http://localhost:5000/api/applications/apply/${id}`, {
        method: "POST",
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
      });
      if (res.ok) {
        toast.success("Application submitted successfully!");
        setHasApplied(true);
        setTimeout(() => setShowApplyModal(false), 2000);
      } else {
        const errData = await res.json();
        toast.error(errData.message || "Failed to apply.");
      }
    } catch (err) {
      toast.error("An error occurred during application.");
    } finally {
      setApplyLoading(false);
    }
  };


  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  if (error || !job) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-12 px-4 shadow-sm">
          <div className="max-w-3xl mx-auto text-center bg-white p-12 rounded-2xl border border-gray-200 shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Job Not Found</h1>
            <p className="text-gray-600 mb-8 font-medium">Sorry, the job you are looking for does not exist or has been removed.</p>
            <Link to="/" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100">
              Browse All Jobs
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 lg:py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 mb-8 inline-flex items-center gap-2 font-semibold transition"
          >
            <span className="text-xl">←</span> Back to Job Search
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10 border-b pb-8">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                      {job.title}
                    </h1>
                    <p className="text-2xl text-blue-600 mt-2 font-semibold">{job.company}</p>
                    <div className="flex flex-wrap gap-4 mt-6 text-sm">
                       <span className="flex items-center gap-1.5 bg-gray-100 px-4 py-1.5 rounded-full font-medium text-gray-700">
                          <MapPinIcon className="h-5 w-5 text-gray-500" />
                          {job.location}
                       </span>
                       <span className="flex items-center gap-1.5 bg-blue-50 px-4 py-1.5 rounded-full font-medium text-blue-700">
                          <BriefcaseIcon className="h-5 w-5 text-blue-500" />
                          {job.type || 'Full-time'}
                       </span>
                       <button 
                        onClick={handleSaveJob}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-bold transition border ${isJobSaved ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-600 hover:text-blue-600'}`}
                      >
                         {isJobSaved ? '✓ Saved' : 'Save Job'}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    {hasApplied ? (
                      <span className="bg-green-50 text-green-700 px-10 py-4 rounded-xl font-bold text-center border-2 border-green-200 text-lg cursor-not-allowed">
                        ✓ Already Applied
                      </span>
                    ) : (
                      <button 
                        onClick={() => !isAdmin && isLoggedIn ? setShowApplyModal(true) : !isLoggedIn ? toast.error('Please login to apply') : null}
                        className={`${isAdmin ? 'hidden' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200'} px-10 py-4 rounded-xl font-bold transition text-lg`}
                      >
                        Apply Now
                      </button>
                    )}
                    {isAdmin && (
                      <Link
                        to={`/job/${id}/edit`}
                        className="text-center border-2 border-blue-600 text-blue-600 px-10 py-3 rounded-xl font-bold hover:bg-blue-50 transition"
                      >
                        ✏️ Edit Job
                      </Link>
                    )}
                    <p className="text-xs text-center text-gray-400">Posted on {new Date(job.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Quick stats */}
                {(job.salary || job.experience || job.applicants) && (
                  <div className="grid grid-cols-3 gap-4 mb-8 p-5 bg-gray-50 rounded-xl border border-gray-100">
                    {job.salary && (
                      <div className="text-center">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Salary</div>
                        <div className="font-bold text-gray-900 text-sm">{job.salary}</div>
                      </div>
                    )}
                    {job.experience && (
                      <div className="text-center">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Experience</div>
                        <div className="font-bold text-gray-900 text-sm">{job.experience}</div>
                      </div>
                    )}
                    {job.applicants && (
                      <div className="text-center">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Applicants</div>
                        <div className="font-bold text-gray-900 text-sm">{job.applicants}</div>
                      </div>
                    )}
                  </div>
                )}

                <div className="prose prose-blue max-w-none">
                  <h2 className="text-2xl font-bold text-gray-900 mb-5">Job Description</h2>
                  <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                    {job.description}
                  </div>
                </div>

                {job.responsibilities?.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Key Responsibilities</h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      {job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                )}

                {job.requirements?.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                )}

                <div className="mt-10 pt-6 border-t flex items-center justify-between text-gray-500">
                   <div className="flex items-center gap-2">
                       <span className="font-bold text-gray-900">Posted by:</span>
                       <span>{job.createdBy?.name || 'Unknown'}</span>
                   </div>
                   <div className="text-xs text-gray-400">{new Date(job.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            {/* Application Modal */}
            {showApplyModal && !isAdmin && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
                  <button onClick={() => setShowApplyModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-2xl font-bold">&times;</button>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Apply for {job.title}</h2>
                  <p className="text-gray-500 text-sm mb-6">Upload your CV to apply for this position.</p>

                  <form onSubmit={handleApply} className="space-y-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition cursor-pointer relative">
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        onChange={(e) => setCvFile(e.target.files[0])} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        required 
                      />
                      <div className="text-4xl mb-3">📄</div>
                      <p className="font-bold text-gray-800">{cvFile ? cvFile.name : 'Click or drag CV here'}</p>
                      <p className="text-xs text-gray-500 mt-1">Supports PDF, DOC, DOCX</p>
                    </div>
                    <button 
                      type="submit" 
                      disabled={applyLoading}
                      className="w-full bg-[#0034D1] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#001D75] transition shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {applyLoading ? "Submitting..." : "Submit Application"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Sidebar - Related Jobs */}
            <div className="lg:col-span-1">
              <RelatedJobs currentJobId={job._id} />
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default JobDetailPage;
