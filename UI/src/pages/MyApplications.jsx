import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { FileText, Briefcase, MapPin, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useLoader } from "@/contexts/LoaderContext";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { Button } from "@/components/ui/button";

const MyApplications = () => {
    const { showLoader, hideLoader } = useLoader();
    const { toast } = useToast();
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const token = useMemo(() => sessionStorage.getItem("token"), []);

    const loadApplications = useCallback(async () => {
        setError("");
        if (!token) {
            setApplications([]);
            setError("Please log in to view your applications.");
            return;
        }

        setIsLoading(true);
        showLoader();
        try {
            const response = await fetch(API_ENDPOINTS.getMyApplications, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                const message =
                    response.status === 401
                        ? "Your session has expired. Please log in again."
                        : "Unable to load your applications.";
                setError(message);
                return;
            }

            const result = await response.json();
            if (result.isSuccess) {
                setApplications(result.data || []);
            } else {
                setError(
                    result?.errors?.[0]?.description ||
                        result?.errorMessage ||
                        "Unable to load your applications."
                );
            }
        } catch (fetchError) {
            setError("Unable to load your applications.");
            toast({
                title: "Network Error",
                description: "Could not connect to the server.",
                variant: "destructive",
            });
        } finally {
            hideLoader();
            setIsLoading(false);
        }
    }, [token, showLoader, hideLoader, toast]);

    useEffect(() => {
        loadApplications();
    }, [loadApplications]);

    return (
        <div className="bg-gray-50 min-h-screen">
            <Helmet>
                <title>My Applications - QXI HR (OPC) PRIVATE LIMITED</title>
                <meta
                    name="description"
                    content="Review the jobs you've applied for and access your submitted documents."
                />
            </Helmet>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col gap-3 mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        My Applications
                    </h1>
                    <p className="text-gray-600 max-w-2xl">
                        Track the roles you've applied for and access your
                        submitted documents in one place.
                    </p>
                </div>

                {error && (
                    <div className="bg-white border border-red-100 rounded-xl p-6 shadow-sm mb-8">
                        <p className="text-red-600 font-medium">{error}</p>
                        {!token && (
                            <div className="mt-4">
                                <Button asChild>
                                    <Link to="/login">Go to Login</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {!error && isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        <span className="ml-3 text-gray-600">
                            Loading your applications...
                        </span>
                    </div>
                )}

                {!error && !isLoading && applications.length === 0 && (
                    <div className="bg-white rounded-xl border shadow-sm p-10 text-center">
                        <div className="w-14 h-14 mx-auto mb-4 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            No applications yet
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Once you apply for a role, it will show up here.
                        </p>
                        <Button asChild variant="outline">
                            <Link to="/job-seekers">Browse jobs</Link>
                        </Button>
                    </div>
                )}

                {!error && !isLoading && applications.length > 0 && (
                    <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Job
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Company
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Location
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Resume
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {applications.map((application) => {
                                    const jobTitle =
                                        application.jobPostTitle ||
                                        `Job #${application.jobPostId}`;
                                    return (
                                        <tr key={application.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                <Link
                                                    to={`/job-seekers/${application.jobPostId}`}
                                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                                                >
                                                    <Briefcase className="w-4 h-4" />
                                                    {jobTitle}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {application.jobPostCompanyName ||
                                                    "—"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                <span className="inline-flex items-center gap-1">
                                                    <MapPin className="w-4 h-4 text-gray-400" />
                                                    {application.jobPostLocation ||
                                                        "—"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                                                {application.resumeUrl ? (
                                                    <Button
                                                        asChild
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        <a
                                                            href={
                                                                application.resumeUrl
                                                            }
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            <FileText className="w-4 h-4 mr-2" />
                                                            View
                                                        </a>
                                                    </Button>
                                                ) : (
                                                    "—"
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyApplications;
