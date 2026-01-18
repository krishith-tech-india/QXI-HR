import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { useLoader } from "@/contexts/LoaderContext";
import { useDebounce } from "@/hooks/useDebounce";
import { API_ENDPOINTS, JOB_PAGE_SIZE } from "@/config/apiConfig";
import JobApplicationsTable from "@/components/JobApplicationsTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ChevronDown,
    Briefcase,
    MapPin,
    Wallet,
    Code,
    ChevronLeft,
    ChevronRight,
    Search,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    X,
    Building,
    Tag,
    Loader2,
} from "lucide-react";

const JobPostRow = ({ job }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const skillList = job.skills?.length ? job.skills.map((skill) => skill.name).join(", ") : job.skils;
    const { toast } = useToast();

    const fetchApplications = useCallback(async () => {
        if (!isOpen) return;
        setIsLoading(true);
        try {
            const token = sessionStorage.getItem("token");
            const response = await fetch(
                API_ENDPOINTS.getApplicationsByJobId(job.id),
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const result = await response.json();
            if (result.isSuccess) {
                setApplications(result.data);
            } else {
                toast({
                    title: "Error",
                    description: "Failed to fetch applications for this job.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Network Error",
                description: "Could not connect to the server.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [isOpen, job.id, toast]);

    useEffect(() => {
        fetchApplications();
    }, [isOpen, fetchApplications]);

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <div className="border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <button
                onClick={handleToggle}
                className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex justify-between items-center"
            >
                <div className="flex-grow">
                    <h3 className="text-lg font-bold text-gray-800">
                        {job.title}
                    </h3>
                    <p className="text-sm text-gray-600">{job.companyName}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-2">
                        {job.location && (
                            <span className="flex items-center">
                                <MapPin size={12} className="mr-1" />
                                {job.location}
                            </span>
                        )}
                        {job.salary && (
                            <span className="flex items-center">
                                <Wallet size={12} className="mr-1" />
                                {job.salary}
                            </span>
                        )}
                        {skillList && (
                            <span className="flex items-center">
                                <Code size={12} className="mr-1" />
                                {skillList}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center space-x-4 ml-4">
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                    </motion.div>
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 bg-white">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                    <p className="ml-4 text-gray-600">
                                        Loading applications...
                                    </p>
                                </div>
                            ) : (
                                <JobApplicationsTable
                                    applications={applications}
                                />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FilterControls = ({ filters, sorting, skills }) => {
    return (
        <div className="bg-gray-50 p-6 rounded-xl mb-12 border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="relative col-span-1 md:col-span-2 lg:col-span-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        placeholder="Search by any keyword..."
                        value={filters.searchKeyword}
                        onChange={(e) => filters.onSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        placeholder="Filter by Title..."
                        value={filters.title}
                        onChange={(e) =>
                            filters.onFilterChange({ title: e.target.value })
                        }
                        className="pl-10"
                    />
                </div>
                <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        placeholder="Filter by Company..."
                        value={filters.companyName}
                        onChange={(e) =>
                            filters.onFilterChange({
                                companyName: e.target.value,
                            })
                        }
                        className="pl-10"
                    />
                </div>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        placeholder="Filter by Location..."
                        value={filters.location}
                        onChange={(e) =>
                            filters.onFilterChange({ location: e.target.value })
                        }
                        className="pl-10"
                    />
                </div>
                <div className="relative">
                    <Code className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Select
                        value={filters.skillId || "all"}
                        onValueChange={(value) =>
                            filters.onFilterChange({
                                skillId: value === "all" ? "" : value,
                            })
                        }
                    >
                        <SelectTrigger className="pl-10">
                            <SelectValue placeholder="Filter by Skill..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Skills</SelectItem>
                            {skills.map((skill) => (
                                <SelectItem
                                    key={skill.id}
                                    value={String(skill.id)}
                                >
                                    {skill.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-5 w-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                        Sort By:
                    </span>
                    <Select
                        value={sorting.sortBy}
                        onValueChange={sorting.onSortChange}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="title">Title</SelectItem>
                            <SelectItem value="companyName">Company</SelectItem>
                            <SelectItem value="location">Location</SelectItem>
                            <SelectItem value="salary">Salary</SelectItem>
                            <SelectItem value="experience">
                                Experience
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                            sorting.onDirectionChange((prev) => !prev)
                        }
                    >
                        {sorting.isDescending ? (
                            <ArrowDown className="h-4 w-4" />
                        ) : (
                            <ArrowUp className="h-4 w-4" />
                        )}
                    </Button>
                </div>
                <Button
                    variant="ghost"
                    onClick={() => {
                        filters.onSearchChange("");
                        filters.onFilterChange({
                            title: "",
                            companyName: "",
                            location: "",
                            skillId: "",
                        });
                    }}
                >
                    <X className="w-4 h-4 mr-2" />
                    Clear Filters
                </Button>
            </div>
        </div>
    );
};

const JobApplications = () => {
    const [jobPosts, setJobPosts] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [filters, setFilters] = useState({
        title: "",
        companyName: "",
        location: "",
        skillId: "",
    });
    const [skills, setSkills] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [sortBy, setSortBy] = useState("title");
    const [isDescending, setIsDescending] = useState(false);

    const debouncedSearch = useDebounce(searchKeyword, 500);
    const debouncedFilters = useDebounce(filters, 500);

    const { toast } = useToast();
    const { showLoader, hideLoader } = useLoader();
    const navigate = useNavigate();

    const fetchAllJobPosts = useCallback(
        async (page) => {
            showLoader();
            try {
                const token = sessionStorage.getItem("token");
                const role = sessionStorage.getItem("role");

                if (!token || (role !== "Admin" && role !== "Staff")) {
                    toast({
                        title: "Unauthorized",
                        description:
                            "You do not have permission to view this page.",
                        variant: "destructive",
                    });
                    navigate("/");
                    return;
                }

                const activeFilters = Object.entries(debouncedFilters)
                    .filter(([, value]) => value)
                    .map(([fieldName, value]) => ({ fieldName, value }));

                const response = await fetch(API_ENDPOINTS.getJobPosts, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        page: page,
                        pageSize: JOB_PAGE_SIZE || 10,
                        searchKeyword: debouncedSearch,
                        sortBy: sortBy,
                        isDescending: isDescending,
                        filters: activeFilters,
                    }),
                });
                const result = await response.json();
                if (result.isSuccess) {
                    setJobPosts(result.data);
                    setTotalItems(result.total);
                    setCurrentPage(page);
                } else {
                    toast({
                        title: "Error",
                        description: "Failed to fetch job applications.",
                        variant: "destructive",
                    });
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
        },
        [
            toast,
            showLoader,
            hideLoader,
            navigate,
            debouncedSearch,
            debouncedFilters,
            sortBy,
            isDescending,
        ]
    );

    useEffect(() => {
        fetchAllJobPosts(1);
    }, [fetchAllJobPosts]);

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
        setCurrentPage(1);
    }, [debouncedSearch, debouncedFilters, sortBy, isDescending]);

    const handlePageChange = (newPage) => {
        if (
            newPage >= 1 &&
            newPage <= Math.ceil(totalItems / (JOB_PAGE_SIZE || 10))
        ) {
            fetchAllJobPosts(newPage);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    };

    const totalPages = Math.ceil(totalItems / (JOB_PAGE_SIZE || 10));

    return (
        <>
            <Helmet>
                <title>
                    All Job Applications - QXI HR (OPC) PRIVATE LIMITED
                </title>
                <meta
                    name="description"
                    content="Manage and review all job applications."
                />
            </Helmet>
            <section className="py-12 md:py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                            All Job Applications
                        </h1>
                        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                            Filter, review, and manage applications for all open
                            positions.
                        </p>
                    </div>

                    <FilterControls
                        filters={{
                            ...filters,
                            searchKeyword: searchKeyword,
                            onSearchChange: setSearchKeyword,
                            onFilterChange: handleFilterChange,
                        }}
                        sorting={{
                            sortBy: sortBy,
                            isDescending: isDescending,
                            onSortChange: setSortBy,
                            onDirectionChange: setIsDescending,
                        }}
                        skills={skills}
                    />

                    <div className="space-y-4">
                        {jobPosts.length > 0 ? (
                            jobPosts.map((job) => (
                                <JobPostRow key={job.id} job={job} />
                            ))
                        ) : (
                            <div className="text-center py-16 bg-white rounded-xl shadow-sm border">
                                <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">
                                    No job posts found
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Try adjusting your filters.
                                </p>
                            </div>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-8 flex justify-center items-center space-x-4">
                            <Button
                                variant="outline"
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Previous
                            </Button>
                            <span className="text-sm font-medium text-gray-700">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={currentPage === totalPages}
                            >
                                Next
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default JobApplications;
