// src/components/EditJobPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Remote", "Internship"];

const EMPTY_FORM = {
  title: "",
  company: "",
  location: "",
  type: "Full-time",
  salary: "",
  experience: "",
  applicants: "0",
  description: "",
  responsibilities: [""],
  requirements: [""],
};

const EditJobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm]       = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");

  const user      = JSON.parse(localStorage.getItem("user"));
  const isAdmin   = user?.role === "admin";
  const token     = localStorage.getItem("token");

  // ── Guard: must be admin
  useEffect(() => {
    if (!isAdmin) navigate("/");
  }, [isAdmin, navigate]);

  // ── Load existing job data
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/jobs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Job not found");
        const job = await res.json();
        setForm({
          title:            job.title            || "",
          company:          job.company          || "",
          location:         job.location         || "",
          type:             job.type             || "Full-time",
          salary:           job.salary           || "",
          experience:       job.experience       || "",
          applicants:       job.applicants       || "0",
          description:      job.description      || "",
          responsibilities: job.responsibilities?.length ? job.responsibilities : [""],
          requirements:     job.requirements?.length     ? job.requirements     : [""],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, token]);

  // ── Generic field handler
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ── Array field handlers (responsibilities / requirements)
  const handleArrayChange = (field, index, value) => {
    setForm((prev) => {
      const updated = [...prev[field]];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };
  const addArrayItem = (field) =>
    setForm((prev) => ({ ...prev, [field]: [...prev[field], ""] }));

  const removeArrayItem = (field, index) =>
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));

  // ── Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      // Strip blank array entries before sending
      const payload = {
        ...form,
        responsibilities: form.responsibilities.filter((r) => r.trim()),
        requirements:     form.requirements.filter((r) => r.trim()),
      };

      const res = await fetch(`http://localhost:5000/api/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      navigate(`/job/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Loading / error states
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </>
    );
  }

  if (!isAdmin) return null;

  // ── Main form
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 lg:py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          <Link
            to={`/job/${id}`}
            className="text-blue-600 hover:text-blue-800 mb-8 inline-flex items-center gap-2 font-semibold transition"
          >
            <span className="text-xl">←</span> Back to Job
          </Link>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Edit Job</h1>
            <p className="text-gray-500 mb-8">Update the details for this job posting.</p>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* ── Row 1: Title & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Job Title *</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Data Analyst"
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Company *</label>
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="e.g. GreenVita"
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* ── Row 2: Location & Job Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location *</label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Berlin (Remote)"
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Job Type</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  >
                    {JOB_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ── Row 3: Salary, Experience, Applicants */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Salary Range</label>
                  <input
                    name="salary"
                    value={form.salary}
                    onChange={handleChange}
                    placeholder="e.g. $500 - $1,800"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Experience</label>
                  <input
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    placeholder="e.g. 2 years"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Applicants</label>
                  <input
                    name="applicants"
                    value={form.applicants}
                    onChange={handleChange}
                    placeholder="e.g. 73"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* ── Description */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description *</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe the role in detail…"
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
                />
              </div>

              {/* ── Responsibilities */}
              <ArrayField
                label="Key Responsibilities"
                field="responsibilities"
                items={form.responsibilities}
                placeholder="e.g. Analyze large datasets…"
                onChange={handleArrayChange}
                onAdd={addArrayItem}
                onRemove={removeArrayItem}
              />

              {/* ── Requirements */}
              <ArrayField
                label="Requirements"
                field="requirements"
                items={form.requirements}
                placeholder="e.g. 2+ years data analysis experience"
                onChange={handleArrayChange}
                onAdd={addArrayItem}
                onRemove={removeArrayItem}
              />

              {/* ── Submit */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#0034D1] text-white py-3 rounded-xl font-bold hover:bg-[#001D75] transition shadow-lg shadow-blue-100 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
                <Link
                  to={`/job/${id}`}
                  className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition text-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

// ── Reusable dynamic list field component
const ArrayField = ({ label, field, items, placeholder, onChange, onAdd, onRemove }) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
      <button
        type="button"
        onClick={() => onAdd(field)}
        className="flex items-center gap-1 text-xs text-blue-600 font-bold hover:text-blue-800 transition"
      >
        <PlusIcon className="h-3.5 w-3.5" /> Add item
      </button>
    </div>
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex gap-2 items-center">
          <input
            value={item}
            onChange={(e) => onChange(field, index, e.target.value)}
            placeholder={placeholder}
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => onRemove(field, index)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default EditJobPage;
