// src/components/JobSearchPage.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import BookmarkIcon from "@heroicons/react/24/outline/BookmarkIcon";
import MapPinIcon from "@heroicons/react/24/outline/MapPinIcon";
import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import BuildingOfficeIcon from "@heroicons/react/24/outline/BuildingOfficeIcon";
import BriefcaseIcon from "@heroicons/react/24/outline/BriefcaseIcon";
import CurrencyDollarIcon from "@heroicons/react/24/outline/CurrencyDollarIcon";
import toast from "react-hot-toast";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Remote", "Internship"];

const JobSearchPage = () => {
  // ── Search bar state (title)
  const [searchInput, setSearchInput] = useState("");

  // ── Sidebar filter state
  const [filters, setFilters] = useState({
    location: "",
    company: "",
    jobType: "",   // single selection via radio for cleanness
    experience: "",
    salary: "",
  });

  // ── Data
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Admin form state
  const [newJob, setNewJob] = useState({ title: "", company: "", location: "", description: "" });

  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!localStorage.getItem("token");

  // ── Debounce timer ref
  const debounceTimer = useRef(null);

  // ────────────────────────────────────────────────────
  // Fetch jobs from backend (with query params)
  // ────────────────────────────────────────────────────
  const fetchJobs = useCallback(async (title, location, company, jobType, experience, salary) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (title)      params.append("title",      title.trim());
      if (location)   params.append("location",   location.trim());
      if (company)    params.append("company",    company.trim());
      if (jobType)    params.append("type",       jobType);
      if (experience) params.append("experience", experience.trim());
      if (salary)     params.append("salary",     salary.trim());

      const url = `http://localhost:5000/api/jobs${params.toString() ? `?${params}` : ""}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSavedJobs = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/jobs/saved", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.ok) setSavedJobs(await response.json());
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchMyApplications = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/applications/my-applications", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.ok) setMyApplications(await response.json());
    } catch (err) {
      console.error(err);
    }
  }, []);

  // ── Initial load
  useEffect(() => {
    if (isLoggedIn) {
      fetchJobs("", "", "", "", "", "");
      fetchSavedJobs();
      if (user?.role !== 'admin' && user?.role !== 'company') {
        fetchMyApplications();
      }
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  // ── Debounced re-fetch when filters/search changes
  useEffect(() => {
    if (!isLoggedIn) return;
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchJobs(searchInput, filters.location, filters.company, filters.jobType, filters.experience, filters.salary);
    }, 400);
    return () => clearTimeout(debounceTimer.current);
  }, [searchInput, filters, isLoggedIn, fetchJobs]);

  // ────────────────────────────────────────────────────
  // Handlers
  // ────────────────────────────────────────────────────
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setFilters({ location: "", company: "", jobType: "", experience: "", salary: "" });
  };

  const hasActiveFilters =
    searchInput || filters.location || filters.company || filters.jobType || filters.experience || filters.salary;

  const handleSaveJob = async (jobId) => {
    if (!isLoggedIn) { toast.error("Please login to save jobs."); return; }
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/save/${jobId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) fetchSavedJobs();
    } catch (err) { console.error("Failed to save job"); }
  };

  const isJobSaved = (jobId) => savedJobs.some((sj) => sj._id === jobId);
  const isJobApplied = (jobId) => myApplications.some((app) => app.job?._id === jobId);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newJob),
      });
      if (response.ok) {
        setNewJob({ title: "", company: "", location: "", description: "" });
        fetchJobs(searchInput, filters.location, filters.company, filters.jobType, filters.experience, filters.salary);
        toast.success("Job created successfully!");
      } else {
        const err = await response.json();
        toast.error("Failed to create job: " + err.message);
      }
    } catch (err) {
      toast.error("Failed to create job");
    }
  };

  // ────────────────────────────────────────────────────
  // Not logged in
  // ────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-gray-50 py-20 px-4">
        <div className="text-center p-12 bg-white rounded-2xl shadow-xl border border-gray-100 max-w-lg">
          <div className="text-6xl mb-6">💼</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">No jobs available</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Please log in or create an account to see the latest job opportunities.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200">Login</Link>
            <Link to="/signup" className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition">Sign Up</Link>
          </div>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────
  // Main render
  // ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ── Top search bar (title search) */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Job title, keywords…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
            />
          </div>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-100 transition"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* ── Main 3-column layout */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── LEFT SIDEBAR – Filters */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-blue-600 hover:underline font-medium"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Location */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="City, state, or remote"
                    value={filters.location}
                    onChange={(e) => handleFilterChange("location", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Company */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Company</label>
                <div className="relative">
                  <BuildingOfficeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g. Google, Microsoft…"
                    value={filters.company}
                    onChange={(e) => handleFilterChange("company", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Experience */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Experience Level</label>
                <div className="relative">
                  <BriefcaseIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g. 2 years, Entry..."
                    value={filters.experience}
                    onChange={(e) => handleFilterChange("experience", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Salary Range */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Salary Range</label>
                <div className="relative">
                  <CurrencyDollarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g. 5000, 100k..."
                    value={filters.salary}
                    onChange={(e) => handleFilterChange("salary", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Job Type */}
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                <div className="space-y-1.5">
                  {JOB_TYPES.map((t) => (
                    <label key={t} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="radio"
                        name="jobType"
                        value={t}
                        checked={filters.jobType === t}
                        onChange={() =>
                          handleFilterChange("jobType", filters.jobType === t ? "" : t)
                        }
                        className="h-4 w-4 text-blue-600 cursor-pointer"
                      />
                      <span className={`text-sm transition-colors ${filters.jobType === t ? "text-blue-700 font-semibold" : "text-gray-700 group-hover:text-blue-600"}`}>
                        {t}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── CENTER – Job listings */}
          <div className="flex-1 space-y-4">
            {/* Results count */}
            {!loading && (
              <div className="flex items-center justify-between px-1 mb-1">
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-800">{jobs.length}</span> job{jobs.length !== 1 ? "s" : ""} found
                  {hasActiveFilters && <span className="text-blue-600 font-medium"> (filtered)</span>}
                </p>
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
                <div className="text-gray-500">Loading jobs…</div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-600 shadow-sm">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                <p className="mb-6">Try adjusting your search or filters.</p>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <Link
                        to={`/job/${job._id}`}
                        className="text-xl font-bold text-gray-900 hover:text-blue-600 transition"
                      >
                        {job.title}
                      </Link>
                      <p className="text-gray-600 mt-1 font-medium italic">{job.company}</p>
                    </div>
                    <button
                      onClick={() => handleSaveJob(job._id)}
                      className="p-2 hover:bg-gray-100 rounded-full transition group"
                      title={isJobSaved(job._id) ? "Unsave Job" : "Save Job"}
                    >
                      <BookmarkIcon
                        className={`h-6 w-6 transition-colors ${
                          isJobSaved(job._id)
                            ? "fill-blue-600 text-blue-600"
                            : "text-gray-400 group-hover:text-blue-500"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4 text-sm">
                    <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                      <MapPinIcon className="h-4 w-4" />
                      {job.location}
                    </span>
                    {job.type && (
                       <span className="flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-full text-blue-700">
                         {job.type}
                       </span>
                    )}
                    {job.salary && (
                       <span className="flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-full text-green-700">
                         <CurrencyDollarIcon className="h-4 w-4" />
                         {job.salary}
                       </span>
                    )}
                    {job.experience && (
                       <span className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full text-amber-700">
                         <BriefcaseIcon className="h-4 w-4" />
                         {job.experience}
                       </span>
                    )}
                  </div>

                  <p className="mt-4 text-gray-600 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-xs text-gray-400">
                      Posted on {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveJob(job._id)}
                        className={`text-sm font-bold px-4 py-2 rounded-lg transition ${
                          isJobSaved(job._id)
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {isJobSaved(job._id) ? "✓ Saved" : "Save Job"}
                      </button>
                      <Link
                        to={`/job/${job._id}`}
                        className="bg-white border border-blue-600 text-blue-600 px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 transition"
                      >
                        Details
                      </Link>
                      {isJobApplied(job._id) ? (
                        <span className="bg-green-50 text-green-700 px-6 py-2 rounded-lg text-sm font-bold border border-green-200 cursor-not-allowed">
                          ✓ Already Applied
                        </span>
                      ) : (
                        <Link
                          to={`/job/${job._id}`}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition shadow-md shadow-blue-200"
                        >
                          Apply Now
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ── RIGHT SIDEBAR – Admin Post Job or Saved Jobs */}
          <div className="lg:w-72 flex-shrink-0 hidden lg:block">
            {user?.role === "admin" ? (
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6 sticky top-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-blue-600 text-xl">+</span> Post a New Job
                </h2>
                <form onSubmit={handleCreateJob} className="space-y-4">
                  {[
                    { label: "Title",    key: "title",    placeholder: "e.g. Senior React Developer" },
                    { label: "Company",  key: "company",  placeholder: "Your Company Name" },
                    { label: "Location", key: "location", placeholder: "e.g. Remote, NY, London" },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{label}</label>
                      <input
                        type="text"
                        placeholder={placeholder}
                        value={newJob[key]}
                        onChange={(e) => setNewJob({ ...newJob, [key]: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        required
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                    <textarea
                      placeholder="Describe the role in detail…"
                      value={newJob.description}
                      onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#0034D1] text-white py-3 rounded-lg font-bold hover:bg-[#001D75] transition shadow-lg shadow-blue-100"
                  >
                    Post Job Now
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 sticky top-6 border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
                  <BookmarkIcon className="h-5 w-5 text-blue-600 fill-blue-600" />
                  Saved Jobs
                </h2>
                {savedJobs.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="text-3xl mb-2 opacity-40">📂</div>
                    <p className="text-gray-500 text-sm">No saved jobs yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {savedJobs.map((sj) => (
                      <Link
                        key={sj._id}
                        to={`/job/${sj._id}`}
                        className="block p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition shadow-sm group"
                      >
                        <h3 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition truncate">{sj.title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{sj.company}</p>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1.5">
                          <MapPinIcon className="h-3 w-3" />
                          {sj.location}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                <p className="mt-5 text-xs text-gray-400 leading-relaxed border-t pt-4">
                  Saved jobs help you track positions you're interested in.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearchPage;
