import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import {
    Plus,
    Edit,
    Trash2,
    Mail,
    Phone,
    Facebook,
    Instagram,
    Linkedin,
    Youtube,
    Github,
    ChevronLeft,
    ChevronRight,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useLoader } from "@/contexts/LoaderContext";
import TeamMemberModal from "@/components/TeamMemberModal";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { API_ENDPOINTS, JOB_PAGE_SIZE } from "@/config/apiConfig";

const resolveOnlineProfileUrl = (member, platform) => {
    if (!member?.onlineProfiles?.length) return "";
    const match = member.onlineProfiles.find(
        (profile) =>
            profile?.platform?.toLowerCase() === platform.toLowerCase() &&
            profile?.url
    );
    return match?.url || "";
};

const SOCIAL_PLATFORM_CONFIG = [
    { key: "linkedin", label: "LinkedIn", Icon: Linkedin },
    { key: "facebook", label: "Facebook", Icon: Facebook },
    { key: "instagram", label: "Instagram", Icon: Instagram },
    { key: "youtube", label: "YouTube", Icon: Youtube },
    { key: "github", label: "GitHub", Icon: Github },
];

const buildSocialLinks = (member) =>
    SOCIAL_PLATFORM_CONFIG.map((platform) => ({
        ...platform,
        url: resolveOnlineProfileUrl(member, platform.label),
    })).filter((item) => item.url);

const ROLE_GROUPS = [
    { key: "Admin", label: "Admins" },
    { key: "Staff", label: "Staff" },
    { key: "Applicant", label: "Applicants" },
];

const buildRoleMap = (factory) =>
    ROLE_GROUPS.reduce((acc, role) => {
        acc[role.key] = factory();
        return acc;
    }, {});

const ManagementTeam = () => {
    const [membersByRole, setMembersByRole] = useState(() =>
        buildRoleMap(() => [])
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isStaffOrAdmin, setIsStaffOrAdmin] = useState(false);
    const [paginationByRole, setPaginationByRole] = useState(() =>
        buildRoleMap(() => ({ page: 1, total: 0 }))
    );
    const [loadingByRole, setLoadingByRole] = useState(() =>
        buildRoleMap(() => false)
    );
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const { showLoader, hideLoader } = useLoader();

    const fetchTeamMembersByRole = useCallback(
        async (roleKey, page) => {
            setLoadingByRole((prev) => ({ ...prev, [roleKey]: true }));
            try {
                const token = sessionStorage.getItem("token");
                const response = await fetch(API_ENDPOINTS.getUsers, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        page: page,
                        pageSize: JOB_PAGE_SIZE || 10,
                        filters: [
                            {
                                fieldName: "roleName",
                                value: roleKey,
                                operator: "Equals",
                            },
                        ],
                    }),
                });
                const result = await response.json();
                if (result.isSuccess) {
                    setMembersByRole((prev) => ({
                        ...prev,
                        [roleKey]: result.data,
                    }));
                    setPaginationByRole((prev) => ({
                        ...prev,
                        [roleKey]: { page, total: result.total },
                    }));
                } else {
                    toast({
                        title: "Error",
                        description: `Failed to fetch ${roleKey} users.`,
                        variant: "destructive",
                    });
                }
            } catch (error) {
                toast({
                    title: "Network Error",
                    description: `Could not load ${roleKey} users.`,
                    variant: "destructive",
                });
            } finally {
                setLoadingByRole((prev) => ({ ...prev, [roleKey]: false }));
            }
        },
        [toast]
    );

    const fetchAllRoles = useCallback(
        async (pageOverrides = {}, rolesToFetch = ROLE_GROUPS) => {
            setIsLoading(true);
            showLoader();
            try {
                await Promise.all(
                    rolesToFetch.map((role) => {
                        const currentPage =
                            pageOverrides[role.key] ?? 1;
                        return fetchTeamMembersByRole(role.key, currentPage);
                    })
                );
            } finally {
                setIsLoading(false);
                hideLoader();
            }
        },
        [fetchTeamMembersByRole, showLoader, hideLoader]
    );

    useEffect(() => {
        const role = sessionStorage.getItem("role");
        const token = sessionStorage.getItem("token");
        const staffOrAdmin = role === "Admin" || role === "Staff";
        const rolesToFetch = staffOrAdmin
            ? ROLE_GROUPS
            : ROLE_GROUPS.filter((item) => item.key !== "Applicant");
        if (token && role === "Admin") {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
        setIsStaffOrAdmin(staffOrAdmin);
        fetchAllRoles({}, rolesToFetch);
    }, [fetchAllRoles]);

    const handlePageChange = (roleKey, newPage) => {
        const totalItems = paginationByRole[roleKey]?.total || 0;
        const totalPages = Math.ceil(totalItems / (JOB_PAGE_SIZE || 10));
        if (newPage >= 1 && newPage <= totalPages) {
            fetchTeamMembersByRole(roleKey, newPage);
        }
    };

    const processApiErrors = (errors) => {
        if (errors && typeof errors === "object") {
            Object.values(errors).forEach((errorArray) => {
                if (Array.isArray(errorArray)) {
                    errorArray.forEach((msg) => {
                        toast({
                            title: "Validation Error",
                            description: msg,
                            variant: "destructive",
                        });
                    });
                }
            });
        } else {
            toast({
                title: "Error",
                description: "An unknown error occurred.",
                variant: "destructive",
            });
        }
    };

    const buildPageOverrides = (roles) =>
        roles.reduce((acc, role) => {
            acc[role.key] = paginationByRole[role.key]?.page ?? 1;
            return acc;
        }, {});

    const handleFormSubmit = async (memberData) => {
        showLoader();
        let profilePictureUrl = memberData.profilePictureUrl || "";

        try {
            if (memberData.profilePictureFile) {
                const getUrlResponse = await fetch(
                    API_ENDPOINTS.getUploadUrl(
                        memberData.profilePictureFile.name
                    ),
                    {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );
                const urlResult = await getUrlResponse.json();
                if (!urlResult.isSuccess)
                    throw new Error("Failed to get upload URL.");

                await fetch(urlResult.data.uploadUrl, {
                    method: "PUT",
                    body: memberData.profilePictureFile,
                    headers: {
                        "Content-Type": memberData.profilePictureFile.type,
                    },
                });
                profilePictureUrl = urlResult.data.fileUrl;
            }

            const endpoint = editingMember
                ? API_ENDPOINTS.updateUser(editingMember.id)
                : API_ENDPOINTS.createUser;
            const method = editingMember ? "PUT" : "POST";

            const payload = { ...memberData, profilePictureUrl };
            delete payload.profilePictureFile;
            delete payload.confirmPassword;
            if (method === "PUT" && !memberData.password)
                delete payload.password;
            if (method === "POST") payload.isActive = true;

            const response = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            if (result.isSuccess) {
                toast({
                    title: "Success",
                    description: `Team member ${
                        editingMember ? "updated" : "created"
                    } successfully.`,
                });
                setIsModalOpen(false);
                fetchAllRoles(
                    buildPageOverrides(visibleRoleGroups),
                    visibleRoleGroups
                );
            } else {
                processApiErrors(
                    result.errors || {
                        error: [result.message || "An error occurred"],
                    }
                );
            }
        } catch (error) {
            toast({
                title: "Submission Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            hideLoader();
        }
    };

    const handleDeleteMember = async (id) => {
        showLoader();
        try {
            const response = await fetch(API_ENDPOINTS.deleteUser(id), {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
            });
            if (response.ok) {
                const result = await response.json();
                if (result.isSuccess) {
                    toast({
                        title: "Success",
                    description: "Team member deleted successfully.",
                });
                    fetchAllRoles(
                        buildPageOverrides(visibleRoleGroups),
                        visibleRoleGroups
                    );
                } else {
                    toast({
                        title: "Error",
                        description:
                            result.message || "Failed to delete member.",
                        variant: "destructive",
                    });
                }
            } else {
                toast({
                    title: "Error",
                    description: "Failed to delete member.",
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
    };

    const openAddModal = () => {
        setEditingMember(null);
        setIsModalOpen(true);
    };
    const openEditModal = (member) => {
        setEditingMember(member);
        setIsModalOpen(true);
    };
    const visibleRoleGroups = isStaffOrAdmin
        ? ROLE_GROUPS
        : ROLE_GROUPS.filter((role) => role.key !== "Applicant");
    const hasMembers = visibleRoleGroups.some(
        (role) => (membersByRole[role.key] || []).length > 0
    );
    const resolveImage = (url) => {
        if (!url) return null;
        if (
            url.startsWith("http://") ||
            url.startsWith("https://") ||
            url.startsWith("data:") ||
            url.startsWith("blob:")
        ) {
            return url;
        }
        return `https://${url}`;
    };

    return (
        <>
            <Helmet>
                <title>Management Team - QXI HR (OPC) PRIVATE LIMITED</title>
                <meta
                    name="description"
                    content="Meet our experienced management team at QXI HR (OPC) PRIVATE LIMITED."
                />
            </Helmet>

            <section className="relative py-20 corporate-gradient text-white">
                <div className="absolute inset-0 hero-pattern opacity-10"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-shadow">
                                Our Management Team
                            </h1>
                            <p className="text-xl md:text-2xl max-w-3xl opacity-90">
                                Meet the experienced professionals driving our
                                success
                            </p>
                        </motion.div>
                        {isAdmin && (
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <Button
                                    onClick={openAddModal}
                                    size="lg"
                                    className="bg-white text-gray-900 hover:bg-gray-100"
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    Add Team Member
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>

            <section className="section-padding">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {isLoading && !hasMembers ? (
                        <div className="text-center py-16">
                            <Loader2 className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
                        </div>
                    ) : !hasMembers ? (
                        <div className="text-center py-16">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                No Team Members Found
                            </h3>
                            {isAdmin && (
                                <Button
                                    onClick={openAddModal}
                                    size="lg"
                                    className="corporate-gradient text-white"
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    Add First Team Member
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {visibleRoleGroups.map((role) => {
                                const roleMembers =
                                    membersByRole[role.key] || [];
                                const rolePagination =
                                    paginationByRole[role.key] || {
                                        page: 1,
                                        total: 0,
                                    };
                                const roleTotalPages = Math.ceil(
                                    (rolePagination.total || 0) /
                                        (JOB_PAGE_SIZE || 10)
                                );
                                return (
                                    <div key={role.key}>
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-2xl font-bold text-gray-900">
                                                {role.label}
                                            </h2>
                                            <span className="text-sm text-gray-500">
                                                {rolePagination.total || 0}{" "}
                                                total
                                            </span>
                                        </div>
                                        {loadingByRole[role.key] ? (
                                            <div className="text-center py-8">
                                                <Loader2 className="mx-auto h-8 w-8 text-gray-400 animate-spin" />
                                            </div>
                                        ) : roleMembers.length === 0 ? (
                                            <p className="text-gray-500">
                                                No {role.label.toLowerCase()}{" "}
                                                found.
                                            </p>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                {roleMembers.map(
                                                    (member, index) => {
                                                        const socialLinks =
                                                            buildSocialLinks(
                                                                member
                                                            );
                                                        return (
                                                            <motion.div
                                                                key={`${role.key}-${member.id}`}
                                                                initial={{
                                                                    opacity: 0,
                                                                    y: 20,
                                                                }}
                                                                whileInView={{
                                                                    opacity: 1,
                                                                    y: 0,
                                                                }}
                                                                transition={{
                                                                    duration: 0.6,
                                                                    delay:
                                                                        index *
                                                                        0.1,
                                                                }}
                                                                className="bg-white rounded-xl shadow-lg overflow-hidden hover-lift flex flex-col"
                                                            >
                                                                <div className="relative">
                                                                    <img
                                                                        src={
                                                                            resolveImage(
                                                                                member.profilePictureUrl
                                                                            ) ||
                                                                            `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face`
                                                                        }
                                                                        alt={
                                                                            member.firstName
                                                                        }
                                                                        className="w-full h-64 object-cover"
                                                                    />
                                                                    {isAdmin &&
                                                                        member.isPublic ===
                                                                            false && (
                                                                            <span className="absolute top-4 left-4 px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700">
                                                                                Hidden
                                                                            </span>
                                                                        )}
                                                                    {isAdmin && (
                                                                        <div className="absolute top-4 right-4 flex space-x-2">
                                                                            <Button
                                                                                size="icon"
                                                                                variant="secondary"
                                                                                onClick={() =>
                                                                                    openEditModal(
                                                                                        member
                                                                                    )
                                                                                }
                                                                                className="w-8 h-8 bg-white/90 hover:bg-white"
                                                                            >
                                                                                <Edit className="w-4 h-4" />
                                                                            </Button>
                                                                            <AlertDialog>
                                                                                <AlertDialogTrigger asChild>
                                                                                    <Button
                                                                                        size="icon"
                                                                                        variant="destructive"
                                                                                        className="w-8 h-8"
                                                                                    >
                                                                                        <Trash2 className="w-4 h-4" />
                                                                                    </Button>
                                                                                </AlertDialogTrigger>
                                                                                <AlertDialogContent>
                                                                                    <AlertDialogHeader>
                                                                                        <AlertDialogTitle>
                                                                                            Are you
                                                                                            sure?
                                                                                        </AlertDialogTitle>
                                                                                        <AlertDialogDescription>
                                                                                            This
                                                                                            action
                                                                                            cannot
                                                                                            be
                                                                                            undone.
                                                                                            This
                                                                                            will
                                                                                            permanently
                                                                                            delete
                                                                                            the
                                                                                            team
                                                                                            member.
                                                                                        </AlertDialogDescription>
                                                                                    </AlertDialogHeader>
                                                                                    <AlertDialogFooter>
                                                                                        <AlertDialogCancel>
                                                                                            Cancel
                                                                                        </AlertDialogCancel>
                                                                                        <AlertDialogAction
                                                                                            onClick={() =>
                                                                                                handleDeleteMember(
                                                                                                    member.id
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            Delete
                                                                                        </AlertDialogAction>
                                                                                    </AlertDialogFooter>
                                                                                </AlertDialogContent>
                                                                            </AlertDialog>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="p-6 flex-grow flex flex-col">
                                                                    {member.userCode && (
                                                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                                            {member.userCode}
                                                                        </p>
                                                                    )}
                                                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                                                        {member.firstName} {member.lastName}
                                                                    </h3>
                                                                    <p className="text-blue-600 font-semibold mb-4">
                                                                        {member.position}
                                                                    </p>
                                                                    <p
                                                                        className="text-gray-600 text-sm mb-6 leading-relaxed flex-grow"
                                                                        style={{
                                                                            whiteSpace:
                                                                                "pre-line",
                                                                        }}
                                                                    >
                                                                        {
                                                                            member.bio
                                                                        }
                                                                    </p>
                                                                    <div className="space-y-2 mt-auto">
                                                                        {member.email && (
                                                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                                                <Mail className="w-4 h-4" />
                                                                                <span>
                                                                                    {
                                                                                        member.email
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                        {member.phoneNumber && (
                                                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                                                <Phone className="w-4 h-4" />
                                                                                <span>
                                                                                    {
                                                                                        member.phoneNumber
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                        {socialLinks.map(
                                                                            ({
                                                                                key,
                                                                                label,
                                                                                Icon,
                                                                                url,
                                                                            }) => (
                                                                                <a
                                                                                    key={`${member.id}-${key}`}
                                                                                    href={
                                                                                        url
                                                                                    }
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="flex items-center space-x-2 text-sm text-blue-600 hover:underline"
                                                                                >
                                                                                    <Icon className="w-4 h-4" />
                                                                                    <span>
                                                                                        {
                                                                                            label
                                                                                        }{" "}
                                                                                        Profile
                                                                                    </span>
                                                                                </a>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        )}
                                        {roleTotalPages > 1 && (
                                            <div className="mt-8 flex justify-center items-center space-x-4">
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        handlePageChange(
                                                            role.key,
                                                            rolePagination.page -
                                                                1
                                                        )
                                                    }
                                                    disabled={
                                                        rolePagination.page ===
                                                        1
                                                    }
                                                >
                                                    <ChevronLeft className="w-4 h-4 mr-2" />
                                                    Previous
                                                </Button>
                                                <span className="text-sm font-medium text-gray-700">
                                                    Page {rolePagination.page}{" "}
                                                    of {roleTotalPages}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        handlePageChange(
                                                            role.key,
                                                            rolePagination.page +
                                                                1
                                                        )
                                                    }
                                                    disabled={
                                                        rolePagination.page ===
                                                        roleTotalPages
                                                    }
                                                >
                                                    Next
                                                    <ChevronRight className="w-4 h-4 ml-2" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            <TeamMemberModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                member={editingMember}
            />
        </>
    );
};

export default ManagementTeam;
