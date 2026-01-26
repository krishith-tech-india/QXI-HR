import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet";
import { useToast } from "@/components/ui/use-toast";
import { useLoader } from "@/contexts/LoaderContext";
import { API_ENDPOINTS, JOB_PAGE_SIZE } from "@/config/apiConfig";
import Hero from "@/components/jobseekers/Hero";
import JobListings from "@/components/jobseekers/JobListings";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import JobModal from "@/components/JobModal";
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

const JobSeekers = () => {
    const [jobs, setJobs] = useState([]);
    const [totalJobs, setTotalJobs] = useState(0);
    const [userRole, setUserRole] = useState(null);
    const [skills, setSkills] = useState([]);
    const { toast } = useToast();
    const { showLoader, hideLoader } = useLoader();

    const [page, setPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [sortBy, setSortBy] = useState("title");
    const [isDescending, setIsDescending] = useState(false);
    const [showInactive, setShowInactive] = useState(false);
    const [filters, setFilters] = useState({
        title: "",
        companyName: "",
        location: "",
        skillId: "",
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState("");

    const debouncedSearch = useDebounce(searchKeyword, 500);
    const debouncedFilters = useDebounce(filters, 500);

    const fetchJobs = useCallback(async () => {
        showLoader();
        try {
            const activeFilters = Object.entries(debouncedFilters)
                .filter(([, value]) => value)
                .map(([fieldName, value]) => ({ fieldName, value }));

            if (showInactive) {
                activeFilters.push({ fieldName: "includeInactive", value: true });
            }

            const response = await fetch(API_ENDPOINTS.getJobPosts, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    page,
                    pageSize: JOB_PAGE_SIZE,
                    searchKeyword: debouncedSearch,
                    sortBy,
                    isDescending,
                    filters: activeFilters,
                }),
            });

            const result = await response.json();

            if (result.isSuccess) {
                setJobs(result.data || []);
                setTotalJobs(result.total || 0);
            } else {
                toast({
                    title: "Error",
                    description: "Failed to fetch job openings.",
                    variant: "destructive",
                });
                setJobs([]);
                setTotalJobs(0);
            }
        } catch (error) {
            toast({
                title: "Network Error",
                description: "Could not connect to the server.",
                variant: "destructive",
            });
            setJobs([]);
            setTotalJobs(0);
        } finally {
            hideLoader();
        }
    }, [
        page,
        debouncedSearch,
        sortBy,
        isDescending,
        debouncedFilters,
        showInactive,
        toast,
        showLoader,
        hideLoader,
    ]);

    useEffect(() => {
        const role = sessionStorage.getItem("role");
        setUserRole(role);
    }, []);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.getSkills, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ page: 1, pageSize: 99, sortBy: "name" }),
                });
                const result = await response.json();
                if (result.isSuccess) {
                    setSkills(result.data || []);
                }
            } catch (error) {
                setSkills([]);
            }
        };
        fetchSkills();
    }, []);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, debouncedFilters, sortBy, isDescending, showInactive]);

    const handleOpenModal = (job = null) => {
        setEditingJob(job);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingJob(null);
    };

    const handleApiCall = async (action, endpoint, options) => {
        showLoader();
        try {
            const token = sessionStorage.getItem("token");
            const response = await fetch(endpoint, {
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = await response.json();
            if (result.isSuccess) {
                toast({
                    title: "Success",
                    description: `Job post ${action} successfully.`,
                });
                fetchJobs();
                return true;
            } else {
                (result.errors || []).forEach((err) =>
                    toast({
                        title: "Error",
                        description: err.description,
                        variant: "destructive",
                    })
                );
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

    const handleDelete = (jobId) => {
        setConfirmMessage(
            "Are you sure you want to mark this job post inactive?"
        );
        setPendingAction(() => () => {
            handleApiCall("marked inactive", API_ENDPOINTS.deleteJobPost(jobId), {
                method: "DELETE",
            });
        });
        setIsConfirmOpen(true);
    };

    const handleSubmit = (formData) => {
        const isEditing = !!editingJob;
        setConfirmMessage(
            isEditing
                ? "Do you want to update this job post?"
                : "Do you want to create this job post?"
        );

        setPendingAction(() => () => {
            const endpoint = isEditing
                ? API_ENDPOINTS.updateJobPost(editingJob.id)
                : API_ENDPOINTS.createJobPost;
            const method = isEditing ? "PUT" : "POST";
            const body = {
                ...formData,
                ...(isEditing ? {} : { isActive: true }),
                id: isEditing ? editingJob.id : undefined,
            };

            handleApiCall(isEditing ? "updated" : "created", endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            }).then((success) => {
                if (success) handleCloseModal();
            });
        });
        setIsConfirmOpen(true);
    };

    const confirmAction = () => {
        if (pendingAction) {
            pendingAction();
        }
        setIsConfirmOpen(false);
        setPendingAction(null);
    };

    const canManageJobs = userRole === "Admin" || userRole === "Staff";

    return (
        <>
            <Helmet>
                <title>Job Seekers - QXI HR (OPC) PRIVATE LIMITED</title>
                <meta
                    name="description"
                    content="Find your next career opportunity with QXI HR (OPC) PRIVATE LIMITED."
                />
            </Helmet>

            <Hero />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {canManageJobs && (
                    <div className="flex justify-end mb-6">
                        <Button
                            onClick={() => handleOpenModal()}
                            size="lg"
                            className="corporate-gradient text-white"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Job Post
                        </Button>
                    </div>
                )}
            </div>

            <JobListings
                jobs={jobs}
                userRole={userRole}
                pagination={{
                    currentPage: page,
                    pageSize: JOB_PAGE_SIZE,
                    totalItems: totalJobs,
                    onPageChange: setPage,
                }}
                filters={{
                    searchKeyword,
                    onSearchChange: setSearchKeyword,
                    ...filters,
                    onFilterChange: (newFilters) =>
                        setFilters((prev) => ({ ...prev, ...newFilters })),
                }}
                inactiveToggle={{
                    visible: canManageJobs,
                    value: showInactive,
                    onToggle: () => setShowInactive((prev) => !prev),
                }}
                sorting={{
                    sortBy,
                    isDescending,
                    onSortChange: setSortBy,
                    onDirectionChange: setIsDescending,
                }}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
                skills={skills}
            />

            <JobModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                job={editingJob}
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

export default JobSeekers;
