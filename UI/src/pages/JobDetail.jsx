import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useToast } from "@/components/ui/use-toast";
import { useLoader } from "@/contexts/LoaderContext";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { Button } from "@/components/ui/button";
import DOMPurify from "dompurify";
import {
    Briefcase,
    MapPin,
    Wallet,
    Code,
    ArrowLeft,
    Edit,
    Ban,
    MessageCircle,
} from "lucide-react";
import JobModal from "@/components/JobModal";
import ApplyNowModal from "@/components/ApplyNowModal";
import JobApplicationsTable from "@/components/JobApplicationsTable";
import SkillPills from "@/components/SkillPills";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const JobDetail = () => {
    const { jobID } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { showLoader, hideLoader } = useLoader();

    const [job, setJob] = useState(null);
    const [userRole, setUserRole] = useState(() =>
        sessionStorage.getItem("role"),
    );
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState("");
    const [hasApplied, setHasApplied] = useState(false);
    const [isCheckingApplication, setIsCheckingApplication] = useState(false);

    useEffect(() => {
        const role = sessionStorage.getItem("role");
        setUserRole(role);
    }, []);

    const fetchJobDetail = useCallback(async () => {
        showLoader();
        try {
            const includeInactive =
                userRole === "Admin" || userRole === "Staff";
            const response = await fetch(
                API_ENDPOINTS.getJobPostById(jobID, includeInactive),
            );
            const result = await response.json();
            if (result.isSuccess) {
                setJob(result.data);
            } else {
                toast({
                    title: "Error",
                    description: "Failed to fetch job details.",
                    variant: "destructive",
                });
                navigate("/job-seekers");
            }
        } catch (error) {
            toast({
                title: "Network Error",
                description: "Could not connect to the server.",
                variant: "destructive",
            });
        } finally {
            hideLoader();
        }
    }, [jobID, userRole, toast, showLoader, hideLoader, navigate]);

    useEffect(() => {
        fetchJobDetail();
    }, [fetchJobDetail]);

    const handleApiCall = async (
        action,
        endpoint,
        options,
        showSuccessToast = true,
    ) => {
        showLoader();
        try {
            const token = sessionStorage.getItem("token");
            const response = await fetch(endpoint, {
                ...options,
                headers: {
                    ...(options.headers || {}),
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            if (options.isCloudflareUpload) {
                if (response.ok) return true;
                toast({
                    title: "Upload Error",
                    description: "Failed to upload file.",
                    variant: "destructive",
                });
                return false;
            }

            const result = await response.json();
            if (result.isSuccess) {
                if (showSuccessToast)
                    toast({ title: "Success", description: action });
                return result;
            } else {
                const errorMessage =
                    result.ErrorMessage ||
                    result.message ||
                    (result.data === true &&
                        "You have already applied for this job.");
                if (errorMessage) {
                    toast({
                        title: "Error",
                        description: errorMessage,
                        variant: "destructive",
                    });
                } else if (result.errors) {
                    Object.values(result.errors)
                        .flat()
                        .forEach((err) =>
                            toast({
                                title: "Error",
                                description: err.description || err,
                                variant: "destructive",
                            }),
                        );
                } else {
                    toast({
                        title: "Error",
                        description: "An unknown error occurred.",
                        variant: "destructive",
                    });
                }
                return false;
            }
        } catch (error) {
            toast({
                title: "Network Error",
                description: "Could not connect to the server.",
                variant: "destructive",
            });
            return false;
        } finally {
            hideLoader();
        }
    };

    const handleDelete = () => {
        setConfirmMessage(
            "Are you sure you want to mark this job post inactive?",
        );
        setPendingAction(() => async () => {
            const success = await handleApiCall(
                "Job post marked inactive successfully.",
                API_ENDPOINTS.deleteJobPost(jobID),
                { method: "DELETE" },
            );
            if (success) navigate("/job-seekers");
        });
        setIsConfirmOpen(true);
    };

    const handleEdit = () => setIsEditModalOpen(true);

    const handleEditSubmit = (formData) => {
        setConfirmMessage("Do you want to update this job post?");
        setPendingAction(() => async () => {
            const success = await handleApiCall(
                "Job post updated successfully.",
                API_ENDPOINTS.updateJobPost(jobID),
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...formData, id: jobID }),
                },
            );
            if (success) {
                setIsEditModalOpen(false);
                fetchJobDetail();
            }
        });
        setIsConfirmOpen(true);
    };

    const checkAlreadyApplied = useCallback(async () => {
        const token = sessionStorage.getItem("token");
        if (!token) return false;

        setIsCheckingApplication(true);
        try {
            const response = await fetch(API_ENDPOINTS.checkApplicationExists, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ jobPostId: Number(jobID) }),
            });
            const result = await response.json();
            if (result.isSuccess) {
                return result.data === true;
            }
            toast({
                title: "Error",
                description:
                    result?.errors?.[0]?.description ||
                    result?.errorMessage ||
                    "Unable to check application status.",
                variant: "destructive",
            });
            return false;
        } catch (error) {
            toast({
                title: "Network Error",
                description: "Could not connect to the server.",
                variant: "destructive",
            });
            return false;
        } finally {
            setIsCheckingApplication(false);
        }
    }, [jobID, toast]);

    const handleApplyNow = () => {
        if (hasApplied) return;
        setIsApplyModalOpen(true);
    };

    const canManage = userRole === "Admin" || userRole === "Staff";
    const isApplicant = userRole === "Applicant";
    const isInactive = job?.isActive === false;
    const jobSkills = job?.skills || [];
    const hasSkills =
        (jobSkills && jobSkills.length > 0) ||
        (typeof job?.skils === "string" && job.skils.trim().length > 0);
    const plainDescription = job?.description
        ? job.description.replace(/<[^>]*>/g, "").trim()
        : "";
    const recruiterWhatsAppNumber = job?.recruiterWhatsAppNumber;
    const recruiterWhatsAppWithCountryCode = recruiterWhatsAppNumber
        ? `91${recruiterWhatsAppNumber}`
        : null;
    const jobLink =
        typeof window !== "undefined"
            ? `${window.location.origin}/job-seekers/${job?.id ?? jobID}`
            : `/job-seekers/${job?.id ?? jobID}`;
    const locationText = job ? (job.location || "role").trim() : "";
    const message = job
        ? `I am interested in your job of ${job.title}${job.jobCode ? ` (${job.jobCode})` : ""} for the ${locationText}.I found this job on ${jobLink}`
        : "";
    const whatsappUrl = recruiterWhatsAppWithCountryCode
        ? `https://api.whatsapp.com/send/?phone=${encodeURIComponent(
              recruiterWhatsAppWithCountryCode,
          )}&text=${encodeURIComponent(message)}`
        : null;

    useEffect(() => {
        if (!isApplicant || !jobID) return;
        let isActive = true;
        const runCheck = async () => {
            const alreadyApplied = await checkAlreadyApplied();
            if (isActive) {
                setHasApplied(alreadyApplied);
            }
        };
        runCheck();
        return () => {
            isActive = false;
        };
    }, [isApplicant, jobID, checkAlreadyApplied]);

    const confirmAction = () => {
        if (pendingAction) pendingAction();
        setIsConfirmOpen(false);
        setPendingAction(null);
    };

    if (!job) return null;

    return (
        <>
            <Helmet>
                <title>{job.title} - QXI HR (OPC) PRIVATE LIMITED</title>
                <meta
                    name="description"
                    content={plainDescription.substring(0, 160)}
                />
            </Helmet>

            <section className="py-12 md:py-20 bg-gray-50">
                <div className="w-full px-4 md:px-8 lg:px-10">
                    <Link
                        to="/job-seekers"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 font-semibold"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Job Listings
                    </Link>

                    <div className="bg-white p-8 rounded-xl shadow-lg border">
                        <div className="job-detail-card job-detail-card--header mb-8">
                            <div className="flex flex-col md:flex-row justify-between md:items-start">
                                <div>
                                    {job.jobCode && (
                                        <div className="text-xs font-bold text-gray-700">
                                            {job.jobCode}
                                        </div>
                                    )}
                                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                                        {job.title}
                                    </h1>
                                    {isInactive && (
                                        <span className="inline-flex items-center mt-3 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-200 text-gray-700">
                                            Inactive
                                        </span>
                                    )}
                                </div>
                                <div className="mt-4 md:mt-0 flex-shrink-0 flex flex-col items-end gap-2">
                                    {isApplicant && (
                                        <Button
                                            onClick={handleApplyNow}
                                            size="lg"
                                            className={`${hasApplied
                                                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                                    : "corporate-gradient text-white"
                                                } w-full sm:w-56`}
                                            disabled={
                                                hasApplied || isCheckingApplication
                                            }
                                        >
                                            {hasApplied
                                                ? "Already Applied"
                                                : "Apply Now"}
                                        </Button>
                                    )}
                                    {!userRole && (
                                        <div className="flex flex-col gap-2 w-full sm:w-auto">
                                            <Button
                                                onClick={() => navigate("/login")}
                                                size="lg"
                                                className="w-full sm:w-56 corporate-gradient text-white"
                                            >
                                                Login to Apply
                                            </Button>
                                        </div>
                                    )}
                                    {canManage && (
                                        <div className="flex gap-2 w-full sm:w-56">
                                            <Button
                                                variant="outline"
                                                onClick={handleEdit}
                                                disabled={isInactive}
                                                aria-label={
                                                    isInactive
                                                        ? "Edit disabled for inactive job"
                                                        : "Edit job"
                                                }
                                                className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={handleDelete}
                                                aria-label="Mark job inactive"
                                                disabled={isInactive}
                                                className="flex-1 border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                                            >
                                                <Ban className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    )}
                                    {whatsappUrl && (
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="lg"
                                            className="w-full sm:w-56 border-green-600 text-green-700 hover:text-green-800 justify-center"
                                        >
                                            <a
                                                href={whatsappUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <MessageCircle className="w-4 h-4 mr-2" />
                                                Chat with recruiter
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="job-detail-card job-detail-card--info mb-8">
                            <div className="job-detail-card__grid">
                            <DetailItem
                                icon={<MapPin size={20} />}
                                label="Location"
                                value={job.location}
                            />
                            <DetailItem
                                icon={<Wallet size={20} />}
                                label="Salary"
                                value={job.salary}
                            />
                            <DetailItem
                                icon={<Briefcase size={20} />}
                                label="Experience"
                                value={job.experience}
                            />
                            <DetailItem
                                icon={<Code size={20} />}
                                label="Skills"
                                value={
                                    hasSkills ? (
                                        <SkillPills
                                            skills={jobSkills}
                                            fallback={job?.skils}
                                        />
                                    ) : null
                                }
                                className="md:col-span-3"
                            />
                            </div>
                        </div>

                        <div className="job-description-card">
                            <div
                                className="job-description-content"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(job.description || ""),
                                }}
                            />
                        </div>
                    </div>

                    {canManage && (
                        <div className="mt-12">
                            <JobApplicationsTable
                                applications={job.applications || []}
                                title="Received Applications"
                            />
                        </div>
                    )}
                </div>
            </section>

            <JobModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={handleEditSubmit}
                job={job}
            />
            <ApplyNowModal
                isOpen={isApplyModalOpen}
                onClose={() => setIsApplyModalOpen(false)}
                onApplied={() => setHasApplied(true)}
                jobId={jobID}
            />

            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirmMessage}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => setPendingAction(null)}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={confirmAction}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

const DetailItem = ({ icon, label, value, className = "" }) => (
    <div className={`flex items-start ${className}`.trim()}>
        <div className="flex-shrink-0 mr-4 mt-1 text-blue-500">{icon}</div>
        <div>
            <p className="text-sm font-semibold text-gray-500">{label}</p>
            {React.isValidElement(value) ? (
                value
            ) : (
                <p className="text-lg text-gray-800">
                    {value || "Not specified"}
                </p>
            )}
        </div>
    </div>
);

export default JobDetail;
