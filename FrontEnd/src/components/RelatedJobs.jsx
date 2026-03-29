// src/components/RelatedJobs.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MapPinIcon from '@heroicons/react/24/outline/MapPinIcon';
import BriefcaseIcon from '@heroicons/react/24/outline/BriefcaseIcon';

export default function RelatedJobs({ currentJobId }) {
    const [relatedJobs, setRelatedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentJobId) {
            setLoading(false);
            return;
        }
        const fetchRelated = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/jobs/related/${currentJobId}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setRelatedJobs(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRelated();
    }, [currentJobId]);

    if (loading) {
        return (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Related Jobs</h2>
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse flex gap-3 p-3 rounded-xl bg-gray-50">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-gray-200 rounded w-3/4"/>
                                <div className="h-2 bg-gray-200 rounded w-1/2"/>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                Related Jobs
            </h2>
            <p className="text-sm text-gray-500 mb-5">
                {relatedJobs.length === 0 ? 'No related jobs found.' : `${relatedJobs.length} similar position${relatedJobs.length > 1 ? 's' : ''} found`}
            </p>

            {relatedJobs.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-4xl mb-3">🔍</div>
                    <p className="text-gray-500 text-sm">No similar jobs at the moment.</p>
                    <Link to="/" className="mt-4 inline-block text-sm font-bold text-blue-600 hover:underline">
                        Browse all jobs →
                    </Link>
                </div>
            ) : (
                <>
                    <div className="space-y-3">
                        {relatedJobs.map((job) => (
                            <Link
                                to={`/job/${job._id}`}
                                key={job._id}
                                className="block bg-gray-50 border border-gray-100 rounded-xl p-4 hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-sm transition-all group"
                            >
                                <div className="flex items-start gap-3">
                                    {/* Company letter avatar */}
                                    <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold text-base">
                                        {job.company.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors truncate leading-tight">
                                            {job.title}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-0.5 truncate">
                                            {job.company}
                                        </div>
                                        <div className="mt-2 flex items-center gap-3 text-[11px] text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <MapPinIcon className="h-3 w-3" />
                                                {job.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <BriefcaseIcon className="h-3 w-3" />
                                                {job.type || 'Full-time'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <Link
                        to="/"
                        className="mt-5 block text-center text-sm font-bold text-blue-600 hover:text-blue-800 transition border border-blue-100 rounded-xl py-2.5 hover:bg-blue-50"
                    >
                        View All Jobs →
                    </Link>
                </>
            )}
        </div>
    );
}