import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Menu,
    X,
    Users,
    Briefcase,
    Image,
    Search,
    Phone,
    LogIn,
    LogOut,
    Info,
    ClipboardList,
    ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [userName, setUserName] = useState("");
    const [userAvatarUrl, setUserAvatarUrl] = useState("");
    const [mobileOpenItems, setMobileOpenItems] = useState({});
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        const role = sessionStorage.getItem("role");
        const storedAvatar =
            sessionStorage.getItem("profileImageUrl") ||
            sessionStorage.getItem("profilePictureUrl");
        setIsAuthenticated(!!token);
        setUserRole(role);
        setUserName(getUserDisplayName(token));
        setUserAvatarUrl(storedAvatar || getUserAvatarUrl(token));
    }, [location]);

    const isStaffOrAdmin = ["Admin", "Staff"].includes(userRole);

    const handleLogout = () => {
        sessionStorage.clear();
        setIsAuthenticated(false);
        setUserRole(null);
        setUserName("");
        navigate("/");
        window.location.reload();
    };

    const aboutUsSubItems = [
        { name: "Mission", path: "/about-us/mission" },
        { name: "Vision", path: "/about-us/vision" },
        { name: "Recruitment Process", path: "/about-us/recruitment-process" },
        {
            name: "Corporate Profile",
            path: "/about-us/corporate-profile",
            children: [
                { name: "Company Profile", path: "/about-us/company-profile" },
                {
                    name: "Business Proposal",
                    path: "/about-us/business-proposal",
                },
            ],
        },
    ];

    const servicesSubItems = [
        { name: "Manpower", path: "/services/manpower" },
        { name: "Placement Services", path: "/services/placement-services" },
        { name: "Staffing Solutions", path: "/services/staffing-solutions" },
        { name: "Corporate Training", path: "/services/corporate-training" },
        {
            name: "Corporate Recruitment Solutions",
            path: "/services/corporate-recruitment-solutions",
        },
    ];

    const navItems = [
        { name: "Home", path: "/", icon: null, auth: "any" },
        {
            name: "About Us",
            path: "/about-us",
            icon: Info,
            auth: "any",
            matchPrefix: true,
            children: aboutUsSubItems,
        },
        {
            name: "Services",
            path: "/services",
            icon: Briefcase,
            auth: "any",
            matchPrefix: true,
            children: servicesSubItems,
        },
        {
            name: "Management Team",
            path: "/management-team",
            icon: Users,
            auth: "any",
        },
        { name: "Clients", path: "/clients", icon: null, auth: "any" },
        { name: "Gallery", path: "/gallery", icon: Image, auth: "any" },
        {
            name: "Job Seekers",
            path: "/job-seekers",
            icon: Search,
            auth: "any",
            children: [
                {
                    name: "All Applications",
                    path: "/job-applications",
                    auth: "adminOrStaff",
                },
            ],
        },
        {
            name: "Hire Talent",
            path: "/contact",
            icon: Phone,
            auth: "any",
            highlight: true,
        },
        {
            name: "Login/Signup",
            path: "/login",
            icon: LogIn,
            auth: "unauthenticated",
        },
    ];

    const isActive = (item) => {
        if (item.matchPrefix) return location.pathname.startsWith(item.path);
        return location.pathname === item.path;
    };

    const isChildActive = (path) => location.pathname === path;
    const getNavItemClasses = (item, active, isMobile = false) => {
        if (item.highlight) {
            return active
                ? "bg-blue-600 text-white shadow-sm ring-1 ring-blue-700/40"
                : "bg-blue-500 text-white shadow-sm ring-1 ring-blue-700/30 hover:bg-blue-600 hover:text-white";
        }

        return active
            ? "bg-blue-100 text-blue-700"
            : isMobile
              ? "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
              : "text-gray-700 hover:text-blue-600 hover:bg-gray-100";
    };

    const shouldShowItem = (item) => {
        if (!item.auth || item.auth === "any") return true;
        if (item.auth === "unauthenticated" && !isAuthenticated) return true;
        if (item.auth === "authenticated" && isAuthenticated) return true;
        if (
            item.auth === "adminOrStaff" &&
            isAuthenticated &&
            (userRole === "Admin" || userRole === "Staff")
        )
            return true;
        return false;
    };

    const toggleMobileItem = (key) => {
        setMobileOpenItems((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const accountLabel = userName || "Account";
    const avatarFallback = getAvatarFallback(accountLabel);

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
                <div className="flex flex-wrap items-center gap-y-2 md:grid md:grid-cols-[auto,1fr,auto] md:gap-x-4 md:gap-y-0 md:items-center min-h-16 py-2">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <img
                            src="https://qxi-applicant-docs.qxihr.com/9e28b840-49ef-4f18-b91c-bbe506bba1f5_qxi.png"
                            alt="QXI HR (OPC) PRIVATE LIMITED Logo"
                            className="h-10 w-auto"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex flex-wrap items-center justify-center gap-x-1 gap-y-1 md:col-start-2 md:justify-self-center">
                        {navItems.map((item) => {
                            if (!shouldShowItem(item)) return null;
                            const Icon = item.icon;

                            const visibleChildren = item.children?.length
                                ? item.children.filter(shouldShowItem)
                                : [];

                            if (visibleChildren.length) {
                                return (
                                    <div
                                        key={item.name}
                                        className="relative group"
                                    >
                                        <Link
                                            to={item.path}
                                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 whitespace-nowrap ${getNavItemClasses(
                                                item,
                                                isActive(item)
                                            )}`}
                                        >
                                            {Icon && (
                                                <Icon className="w-4 h-4" />
                                            )}
                                            <span>{item.name}</span>
                                            <ChevronDown className="w-4 h-4" />
                                        </Link>
                                        <div className="absolute left-0 mt-2 w-60 bg-white rounded-md shadow-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                                            {visibleChildren.map((child) => (
                                                <div
                                                    key={child.name}
                                                    className="relative group/child"
                                                >
                                                    <Link
                                                        to={child.path}
                                                        className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                                                            isChildActive(
                                                                child.path
                                                            )
                                                                ? "bg-blue-50 text-blue-700"
                                                                : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                                                        } flex items-center justify-between`}
                                                    >
                                                        <span>
                                                            {child.name}
                                                        </span>
                                                        {child.children
                                                            ?.length && (
                                                            <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90" />
                                                        )}
                                                    </Link>
                                                    {child.children?.length && (
                                                        <div className="absolute left-full top-0 ml-2 w-56 bg-white rounded-md shadow-lg border border-gray-100 py-2 opacity-0 invisible group-hover/child:opacity-100 group-hover/child:visible transition-all duration-150">
                                                            {child.children.map(
                                                                (
                                                                    grandchild
                                                                ) => (
                                                                    <Link
                                                                        key={
                                                                            grandchild.name
                                                                        }
                                                                        to={
                                                                            grandchild.path
                                                                        }
                                                                        className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                                                                            isChildActive(
                                                                                grandchild.path
                                                                            )
                                                                                ? "bg-blue-50 text-blue-700"
                                                                                : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            grandchild.name
                                                                        }
                                                                    </Link>
                                                                )
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 whitespace-nowrap ${getNavItemClasses(
                                        item,
                                        isActive(item)
                                    )}`}
                                >
                                    {Icon && <Icon className="w-4 h-4" />}
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                    {isAuthenticated && (
                        <div className="hidden md:flex items-center justify-end md:col-start-3 md:justify-self-end">
                            <div className="relative group">
                                <button
                                    type="button"
                                    className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 whitespace-nowrap text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                                >
                                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-600 text-xs font-semibold overflow-hidden">
                                        {userAvatarUrl ? (
                                            <img
                                                src={userAvatarUrl}
                                                alt={accountLabel}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span>{avatarFallback}</span>
                                        )}
                                    </span>
                                    <span>{accountLabel}</span>
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                                <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                                    {!isStaffOrAdmin && (
                                        <>
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                                            >
                                                Profile
                                            </Link>
                                            <Link
                                                to="/profile/applications"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                                            >
                                                My Applications
                                            </Link>
                                        </>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 flex items-center space-x-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-700"
                        >
                            {isOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-gray-200"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
                            {navItems.map((item) => {
                                if (!shouldShowItem(item)) return null;
                                const Icon = item.icon;

                                return (
                                    <div key={item.name}>
                                        <Link
                                            to={item.path}
                                            onClick={() => setIsOpen(false)}
                                            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center space-x-2 ${getNavItemClasses(
                                                item,
                                                isActive(item),
                                                true
                                            )}`}
                                        >
                                            {Icon && (
                                                <Icon className="w-5 h-5" />
                                            )}
                                            <span>{item.name}</span>
                                        </Link>
                                        {item.children?.length && (
                                            <div className="ml-6 mt-1 space-y-1">
                                                {item.children
                                                    .filter(shouldShowItem)
                                                    .map((child) => {
                                                    const hasChildren =
                                                        child.children?.length;
                                                    const childKey = `${item.name}:${child.name}`;
                                                    return (
                                                        <div key={child.name}>
                                                            {hasChildren ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        toggleMobileItem(
                                                                            childKey
                                                                        )
                                                                    }
                                                                    className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                                                                >
                                                                    <span>
                                                                        {
                                                                            child.name
                                                                        }
                                                                    </span>
                                                                    <ChevronDown
                                                                        className={`w-4 h-4 transition-transform ${
                                                                            mobileOpenItems[
                                                                                childKey
                                                                            ]
                                                                                ? "rotate-180"
                                                                                : ""
                                                                        }`}
                                                                    />
                                                                </button>
                                                            ) : (
                                                                <Link
                                                                    to={
                                                                        child.path
                                                                    }
                                                                    onClick={() =>
                                                                        setIsOpen(
                                                                            false
                                                                        )
                                                                    }
                                                                    className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                                                        isChildActive(
                                                                            child.path
                                                                        )
                                                                            ? "bg-blue-50 text-blue-700"
                                                                            : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                                                                    }`}
                                                                >
                                                                    {child.name}
                                                                </Link>
                                                            )}
                                                            {hasChildren &&
                                                                mobileOpenItems[
                                                                    childKey
                                                                ] && (
                                                                    <div className="ml-4 space-y-1">
                                                                        {child.children.map(
                                                                            (
                                                                                grandchild
                                                                            ) => (
                                                                                <Link
                                                                                    key={
                                                                                        grandchild.name
                                                                                    }
                                                                                    to={
                                                                                        grandchild.path
                                                                                    }
                                                                                    onClick={() =>
                                                                                        setIsOpen(
                                                                                            false
                                                                                        )
                                                                                    }
                                                                                    className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                                                                        isChildActive(
                                                                                            grandchild.path
                                                                                        )
                                                                                            ? "bg-blue-50 text-blue-700"
                                                                                            : "text-gray-500 hover:text-blue-600 hover:bg-gray-100"
                                                                                    }`}
                                                                                >
                                                                                    {
                                                                                        grandchild.name
                                                                                    }
                                                                                </Link>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            {isAuthenticated && (
                                <div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            toggleMobileItem("account")
                                        }
                                        className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                                    >
                                        <span className="flex items-center space-x-2">
                                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-600 text-xs font-semibold overflow-hidden">
                                                {userAvatarUrl ? (
                                                    <img
                                                        src={userAvatarUrl}
                                                        alt={accountLabel}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <span>
                                                        {avatarFallback}
                                                    </span>
                                                )}
                                            </span>
                                            <span>{accountLabel}</span>
                                        </span>
                                        <ChevronDown
                                            className={`w-4 h-4 transition-transform ${
                                                mobileOpenItems.account
                                                    ? "rotate-180"
                                                    : ""
                                            }`}
                                        />
                                    </button>
                                    {mobileOpenItems.account && (
                                        <div className="ml-4 space-y-1">
                                            {!isStaffOrAdmin && (
                                                <>
                                                    <Link
                                                        to="/profile"
                                                        onClick={() => setIsOpen(false)}
                                                        className="block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                                                    >
                                                        Profile
                                                    </Link>
                                                    <Link
                                                        to="/profile/applications"
                                                        onClick={() => setIsOpen(false)}
                                                        className="block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                                                    >
                                                        My Applications
                                                    </Link>
                                                </>
                                            )}
                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    setIsOpen(false);
                                                }}
                                                className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 text-gray-600 hover:text-red-600 hover:bg-red-50"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </nav>
    );
};

const getUserDisplayName = (token) => {
    if (!token) return "";
    try {
        const payload = token.split(".")[1];
        if (!payload) return "";
        const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
        const decoded = JSON.parse(atob(normalized));
        return (
            decoded.name ||
            decoded[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
            ] ||
            decoded.email ||
            decoded.sub ||
            ""
        );
    } catch (error) {
        return "";
    }
};

const getUserAvatarUrl = (token) => {
    if (!token) return "";
    try {
        const payload = token.split(".")[1];
        if (!payload) return "";
        const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
        const decoded = JSON.parse(atob(normalized));
        return (
            decoded.profileImageUrl ||
            decoded.profilePictureUrl ||
            decoded.profile_image_url ||
            decoded.profile_picture_url ||
            decoded.picture ||
            decoded.avatar ||
            decoded.image ||
            decoded.photo ||
            ""
        );
    } catch (error) {
        return "";
    }
};

const getAvatarFallback = (label) => {
    if (!label) return "U";
    const trimmed = label.trim();
    if (!trimmed) return "U";
    const parts = trimmed.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
        (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase() || "U"
    );
};

export default Navbar;
