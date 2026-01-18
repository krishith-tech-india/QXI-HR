import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useLoader } from "@/contexts/LoaderContext";
import { API_ENDPOINTS } from "@/config/apiConfig";
import SkillMultiSelect from "@/components/SkillMultiSelect";

const ApplicantSignup = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();

    const [skills, setSkills] = useState([]);
    const [isLoadingSkills, setIsLoadingSkills] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [verificationCode, setVerificationCode] = useState("");
    const [verificationSent, setVerificationSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState("");
    const [profileImageUrl, setProfileImageUrl] = useState("");
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeUrl, setResumeUrl] = useState("");

    const [formData, setFormData] = useState({
        email: "",
        phoneNumber: "",
        firstName: "",
        middleName: "",
        lastName: "",
        dateOfBirth: "",
        profileHeadline: "",
        profileSummary: "",
        portfolioUrl: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        linkedIn: "",
        github: "",
        twitter: "",
        instagram: "",
        skillIds: [],
        password: "",
        confirmPassword: "",
    });

    const [employments, setEmployments] = useState([]);
    const [educations, setEducations] = useState([]);
    const [projects, setProjects] = useState([]);
    const [certifications, setCertifications] = useState([]);
    const [languages, setLanguages] = useState([]);

    const skillsAbortRef = useRef(null);

    const fetchSkills = useCallback(async (searchKeyword = "") => {
        setIsLoadingSkills(true);
        const controller = new AbortController();
        if (skillsAbortRef.current) {
            skillsAbortRef.current.abort();
        }
        skillsAbortRef.current = controller;

        try {
            const response = await fetch(API_ENDPOINTS.getSkills, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    page: 1,
                    pageSize: 99,
                    sortBy: "name",
                    searchKeyword: searchKeyword || undefined,
                }),
                signal: controller.signal,
            });
            const result = await response.json();
            if (result.isSuccess) {
                setSkills(result.data || []);
            }
        } catch (error) {
            if (error?.name !== "AbortError") {
                setSkills([]);
            }
        } finally {
            setIsLoadingSkills(false);
        }
    }, []);

    useEffect(() => {
        fetchSkills();
        return () => {
            if (skillsAbortRef.current) {
                skillsAbortRef.current.abort();
            }
        };
    }, [fetchSkills]);

    const emptyEmployment = useMemo(
        () => ({
            companyName: "",
            title: "",
            startDate: "",
            endDate: "",
            isCurrent: false,
            location: "",
            description: "",
        }),
        []
    );

    const emptyEducation = useMemo(
        () => ({
            institution: "",
            degree: "",
            fieldOfStudy: "",
            startDate: "",
            endDate: "",
            grade: "",
            description: "",
        }),
        []
    );

    const emptyProject = useMemo(
        () => ({
            name: "",
            description: "",
            techStack: "",
            projectUrl: "",
            startDate: "",
            endDate: "",
        }),
        []
    );

    const emptyCertification = useMemo(
        () => ({
            name: "",
            issuer: "",
            issueDate: "",
            expiryDate: "",
        }),
        []
    );

    const emptyLanguage = useMemo(
        () => ({
            languageName: "",
            proficiency: "",
        }),
        []
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const updateListItem = (setter, index, field, value) => {
        setter((prev) =>
            prev.map((item, itemIndex) =>
                itemIndex === index ? { ...item, [field]: value } : item
            )
        );
    };

    const addListItem = (setter, itemFactory) => {
        setter((prev) => [...prev, { ...itemFactory }]);
    };

    const removeListItem = (setter, index) => {
        setter((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
    };

    const buildOnlineProfiles = () => {
        const profiles = [];
        if (formData.linkedIn)
            profiles.push({ platform: "LinkedIn", url: formData.linkedIn });
        if (formData.github)
            profiles.push({ platform: "GitHub", url: formData.github });
        if (formData.twitter)
            profiles.push({ platform: "Twitter", url: formData.twitter });
        if (formData.instagram)
            profiles.push({ platform: "Instagram", url: formData.instagram });
        return profiles;
    };

    const handleProfileImageChange = (event) => {
        const file = event.target.files?.[0];
        setProfileImageFile(file || null);

        if (!file) {
            setProfileImagePreview("");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === "string") {
                setProfileImagePreview(reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    const uploadFile = async (file, category) => {
        const response = await fetch(
            API_ENDPOINTS.getApplicantUploadUrl(file.name, category),
            { method: "GET" }
        );
        const result = await response.json();
        if (!result.isSuccess) {
            throw new Error("Unable to get upload URL.");
        }

        const uploadResp = await fetch(result.data.uploadUrl, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type || "application/octet-stream" },
        });

        if (!uploadResp.ok) {
            throw new Error("Failed to upload file.");
        }

        return result.data.fileUrl;
    };

    const applyDraft = (draft) => {
        setFormData((prev) => ({
            ...prev,
            email: draft.email || prev.email,
            phoneNumber: draft.phoneNumber || prev.phoneNumber,
            firstName: draft.firstName || "",
            middleName: draft.middleName || "",
            lastName: draft.lastName || "",
            dateOfBirth: draft.dateOfBirth ? draft.dateOfBirth.split("T")[0] : "",
            profileHeadline: draft.profileHeadline || "",
            profileSummary: draft.profileSummary || "",
            portfolioUrl: draft.portfolioUrl || "",
            addressLine1: draft.addressLine1 || "",
            addressLine2: draft.addressLine2 || "",
            city: draft.city || "",
            state: draft.state || "",
            country: draft.country || "",
            postalCode: draft.postalCode || "",
            skillIds: draft.skillIds || [],
            linkedIn:
                draft.onlineProfiles?.find((p) => p.platform === "LinkedIn")
                    ?.url || "",
            github:
                draft.onlineProfiles?.find((p) => p.platform === "GitHub")?.url ||
                "",
            twitter:
                draft.onlineProfiles?.find((p) => p.platform === "Twitter")?.url ||
                "",
            instagram:
                draft.onlineProfiles?.find((p) => p.platform === "Instagram")?.url ||
                "",
        }));

        setProfileImageUrl(draft.profileImageUrl || "");
        setResumeUrl(draft.resumeUrl || "");
        setEmployments(draft.employments || []);
        setEducations(draft.educations || []);
        setProjects(draft.projects || []);
        setCertifications(draft.certifications || []);
        setLanguages(draft.languages || []);
    };

    const sendVerificationCode = async () => {
        if (!formData.email || !formData.phoneNumber) {
            toast({
                title: "Error",
                description: "Email and phone number are required.",
                variant: "destructive",
            });
            return;
        }

        showLoader();
        try {
            const response = await fetch(API_ENDPOINTS.startApplicantSignup, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                }),
            });
            const result = await response.json();
            if (result.isSuccess) {
                setVerificationSent(true);
                toast({
                    title: "Verification sent",
                    description: "Check your email for the verification code.",
                });
            } else {
                const errorMessage =
                    result?.errors?.[0]?.description ||
                    result?.errorMessage ||
                    "Failed to send verification.";
                toast({
                    title: "Error",
                    description: errorMessage,
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

    const verifyEmailAndContinue = async () => {
        if (!verificationCode) {
            toast({
                title: "Error",
                description: "Enter the verification code.",
                variant: "destructive",
            });
            return;
        }

        showLoader();
        try {
            const verifyResponse = await fetch(API_ENDPOINTS.verifyApplicantSignup, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    verificationCode,
                }),
            });
            const verifyResult = await verifyResponse.json();
            if (!verifyResult.isSuccess) {
                const errorMessage =
                    verifyResult?.errors?.[0]?.description ||
                    verifyResult?.errorMessage ||
                    "Verification failed.";
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
                return;
            }

            const draftResponse = await fetch(
                API_ENDPOINTS.getApplicantSignupDraft(
                    formData.email,
                    verificationCode
                ),
                { method: "GET" }
            );
            const draftResult = await draftResponse.json();
            if (draftResult.isSuccess) {
                setIsVerified(true);
                setVerificationSent(true);
                applyDraft(draftResult.data);
                setCurrentStep(Math.max(2, draftResult.data.currentStep || 2));
            } else {
                setIsVerified(true);
                setCurrentStep(2);
            }
        } catch (error) {
            toast({
                title: "Network Error",
                description: "Could not verify email.",
                variant: "destructive",
            });
        } finally {
            hideLoader();
        }
    };

    const saveStep2 = async () => {
        if (!isVerified) {
            toast({
                title: "Error",
                description: "Verify your email first.",
                variant: "destructive",
            });
            return;
        }

        if (!formData.firstName) {
            toast({
                title: "Error",
                description: "First name is required.",
                variant: "destructive",
            });
            return;
        }

        showLoader();
        try {
            const uploadedImageUrl = profileImageFile
                ? await uploadFile(profileImageFile, "profile")
                : profileImageUrl || null;

            const response = await fetch(API_ENDPOINTS.saveApplicantStep2, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    verificationCode,
                    firstName: formData.firstName,
                    middleName: formData.middleName || null,
                    lastName: formData.lastName || null,
                    dateOfBirth: formData.dateOfBirth || null,
                    profileImageUrl: uploadedImageUrl,
                    phoneNumber: formData.phoneNumber,
                }),
            });

            const result = await response.json();
            if (result.isSuccess) {
                setProfileImageUrl(result.data.profileImageUrl || "");
                setCurrentStep(3);
                toast({
                    title: "Saved",
                    description: "Basic details saved successfully.",
                });
            } else {
                const errorMessage =
                    result?.errors?.[0]?.description ||
                    result?.errorMessage ||
                    "Failed to save step.";
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Network Error",
                description: "Could not save step.",
                variant: "destructive",
            });
        } finally {
            hideLoader();
        }
    };

    const saveStep3 = async () => {
        if (!formData.profileHeadline) {
            toast({
                title: "Error",
                description: "Profile headline is required.",
                variant: "destructive",
            });
            return;
        }

        showLoader();
        try {
            const uploadedResumeUrl = resumeFile
                ? await uploadFile(resumeFile, "resume")
                : resumeUrl || null;

            const response = await fetch(API_ENDPOINTS.saveApplicantStep3, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    verificationCode,
                    profileHeadline: formData.profileHeadline,
                    profileSummary: formData.profileSummary || null,
                    portfolioUrl: formData.portfolioUrl || null,
                    resumeUrl: uploadedResumeUrl,
                    skillIds: formData.skillIds,
                }),
            });
            const result = await response.json();
            if (result.isSuccess) {
                setResumeUrl(result.data.resumeUrl || "");
                setCurrentStep(4);
                toast({
                    title: "Saved",
                    description: "Profile summary saved successfully.",
                });
            } else {
                const errorMessage =
                    result?.errors?.[0]?.description ||
                    result?.errorMessage ||
                    "Failed to save step.";
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Network Error",
                description: "Could not save step.",
                variant: "destructive",
            });
        } finally {
            hideLoader();
        }
    };

    const saveStep4 = async () => {
        showLoader();
        try {
            const response = await fetch(API_ENDPOINTS.saveApplicantStep4, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    verificationCode,
                    employments,
                    educations,
                }),
            });
            const result = await response.json();
            if (result.isSuccess) {
                setCurrentStep(5);
                toast({
                    title: "Saved",
                    description: "Experience saved successfully.",
                });
            } else {
                const errorMessage =
                    result?.errors?.[0]?.description ||
                    result?.errorMessage ||
                    "Failed to save step.";
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Network Error",
                description: "Could not save step.",
                variant: "destructive",
            });
        } finally {
            hideLoader();
        }
    };

    const saveStep5 = async () => {
        if (!formData.password || formData.password !== formData.confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords must match.",
                variant: "destructive",
            });
            return;
        }

        showLoader();
        try {
            const response = await fetch(API_ENDPOINTS.saveApplicantStep5, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    verificationCode,
                    password: formData.password,
                    projects,
                    certifications,
                    languages,
                    onlineProfiles: buildOnlineProfiles(),
                    addressLine1: formData.addressLine1 || null,
                    addressLine2: formData.addressLine2 || null,
                    city: formData.city || null,
                    state: formData.state || null,
                    country: formData.country || null,
                    postalCode: formData.postalCode || null,
                }),
            });
            const result = await response.json();
            if (result.isSuccess) {
                toast({
                    title: "Signup complete",
                    description: "Your profile is active. Please log in.",
                });
                navigate("/login");
            } else {
                const errorMessage =
                    result?.errors?.[0]?.description ||
                    result?.errorMessage ||
                    "Failed to save step.";
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Network Error",
                description: "Could not save step.",
                variant: "destructive",
            });
        } finally {
            hideLoader();
        }
    };

    const createSkill = async (name) => {
        const normalized = name.trim();
        if (!normalized) return null;
        const lowered = normalized.toLowerCase();

        const existingLocal = skills.find((skill) => {
            const skillName = (skill.name ?? skill.Name ?? "").toLowerCase();
            return skillName === lowered;
        });
        if (existingLocal) {
            return existingLocal;
        }

        try {
            const searchResponse = await fetch(API_ENDPOINTS.getSkills, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    page: 1,
                    pageSize: 99,
                    searchKeyword: normalized,
                    sortBy: "name",
                }),
            });
            const searchResult = await searchResponse.json();
            if (searchResult.isSuccess) {
                const match = (searchResult.data || []).find((skill) => {
                    const skillName = (skill.name ?? skill.Name ?? "").toLowerCase();
                    return skillName === lowered;
                });
                if (match) {
                    setSkills((prev) => {
                        const exists = prev.some(
                            (item) => (item.id ?? item.Id) === (match.id ?? match.Id)
                        );
                        return exists ? prev : [...prev, match];
                    });
                    return match;
                }
            }
        } catch (error) {
            // ignore search errors and fallback to create
        }

        const createResponse = await fetch(API_ENDPOINTS.createSkill, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: normalized, description: null }),
        });
        const createResult = await createResponse.json();
        if (createResult.isSuccess) {
            const created = createResult.data;
            setSkills((prev) => {
                const next = [...prev, created];
                return next.sort((a, b) =>
                    (a.name ?? a.Name ?? "").localeCompare(b.name ?? b.Name ?? "")
                );
            });
            return created;
        }

        toast({
            title: "Error",
            description:
                createResult?.errors?.[0]?.description ||
                createResult?.errorMessage ||
                "Unable to create skill.",
            variant: "destructive",
        });
        return null;
    };

    const steps = [
        {
            id: 1,
            title: "Contact verification",
            description: "Secure your email before continuing.",
        },
        {
            id: 2,
            title: "Profile basics",
            description: "Photo, name, and birth details.",
        },
        {
            id: 3,
            title: "Headline & skills",
            description: "Showcase your strengths.",
        },
        {
            id: 4,
            title: "Experience",
            description: "Employment and education history.",
        },
        {
            id: 5,
            title: "Finish & activate",
            description: "Projects, socials, and password.",
        },
    ];

    return (
        <>
            <Helmet>
                <title>Applicant Signup - QXI HR (OPC) PRIVATE LIMITED</title>
                <meta
                    name="description"
                    content="Create your applicant account to apply for jobs at QXI HR."
                />
            </Helmet>
            <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <motion.div
                    className="absolute -top-32 -left-20 w-72 h-72 rounded-full bg-gradient-to-br from-blue-200/60 to-amber-200/60 blur-3xl"
                    animate={{ y: [0, 20, 0], x: [0, 12, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-gradient-to-tr from-emerald-200/50 to-sky-200/50 blur-3xl"
                    animate={{ y: [0, -20, 0], x: [0, -16, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />

                <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="mb-10"
                        >
                            <p className="uppercase tracking-[0.35em] text-xs text-gray-500">
                                Applicant Intake
                            </p>
                            <h1 className="mt-3 text-3xl md:text-4xl font-serif font-bold text-gray-900">
                                Complete your profile in stages.
                            </h1>
                            <p className="text-gray-600 mt-3 max-w-2xl">
                                Each step saves to the database. If you leave
                                before completing Step 2, your data will not be
                                saved and you will need to verify again.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="bg-white/95 backdrop-blur rounded-2xl shadow-xl border border-white/70 p-6"
                            style={{ perspective: 1200 }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-sm text-gray-500">Step</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {currentStep} of {steps.length}
                                    </p>
                                </div>
                                <div className="w-40 h-2 rounded-full bg-gray-100">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-400 transition-all"
                                        style={{
                                            width: `${(currentStep / steps.length) * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputField
                                            label="Email *"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                        <InputField
                                            label="Phone Number *"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={sendVerificationCode}
                                        >
                                            {verificationSent ? "Resend Code" : "Send Code"}
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputField
                                            label="Verification Code"
                                            value={verificationCode}
                                            onChange={(e) =>
                                                setVerificationCode(e.target.value)
                                            }
                                        />
                                        <div className="flex items-end">
                                            <Button
                                                type="button"
                                                className="w-full corporate-gradient text-white"
                                                onClick={verifyEmailAndContinue}
                                            >
                                                Verify & Continue
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        Enter the code sent to your email. This code
                                        lets you continue to the next step.
                                    </p>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                                        <div>
                                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-100 via-blue-100 to-emerald-100 p-1 shadow-lg">
                                                <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center">
                                                    {profileImagePreview || profileImageUrl ? (
                                                        <img
                                                            src={profileImagePreview || profileImageUrl}
                                                            alt="Profile"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-3xl text-gray-400">
                                                            {formData.firstName
                                                                ? formData.firstName.charAt(0)
                                                                : "?"}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <label className="mt-3 inline-flex items-center justify-center px-4 py-2 rounded-full bg-gray-900 text-white text-sm cursor-pointer shadow">
                                                Upload Photo
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleProfileImageChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <InputField
                                                label="First Name *"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                            />
                                            <InputField
                                                label="Middle Name"
                                                name="middleName"
                                                value={formData.middleName}
                                                onChange={handleChange}
                                            />
                                            <InputField
                                                label="Last Name"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                            />
                                            <InputField
                                                label="Date of Birth"
                                                name="dateOfBirth"
                                                type="date"
                                                value={formData.dateOfBirth}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setCurrentStep(1)}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            type="button"
                                            className="corporate-gradient text-white"
                                            onClick={saveStep2}
                                        >
                                            Save & Continue
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputField
                                            label="Profile Headline *"
                                            name="profileHeadline"
                                            value={formData.profileHeadline}
                                            onChange={handleChange}
                                            required
                                        />
                                        <InputField
                                            label="Portfolio Link"
                                            name="portfolioUrl"
                                            type="url"
                                            value={formData.portfolioUrl}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <TextAreaField
                                        label="Profile Summary"
                                        name="profileSummary"
                                        rows={4}
                                        value={formData.profileSummary}
                                        onChange={handleChange}
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Resume
                                        </label>
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) =>
                                                setResumeFile(e.target.files?.[0] || null)
                                            }
                                            className="custom-input"
                                        />
                                        {resumeUrl && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    window.open(resumeUrl, "_blank")
                                                }
                                                className="text-sm text-blue-600 hover:underline mt-2"
                                            >
                                                View existing resume
                                            </button>
                                        )}
                                    </div>
                                    <SkillMultiSelect
                                        label="Key Skills"
                                        skills={skills}
                                        selectedIds={formData.skillIds}
                                        onChange={(skillIds) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                skillIds,
                                            }))
                                        }
                                        onCreateSkill={createSkill}
                                        onSearch={fetchSkills}
                                        isLoading={isLoadingSkills}
                                    />
                                    <div className="flex justify-between">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setCurrentStep(2)}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            type="button"
                                            className="corporate-gradient text-white"
                                            onClick={saveStep3}
                                        >
                                            Save & Continue
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {currentStep === 4 && (
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Employment history
                                            </h3>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    addListItem(setEmployments, emptyEmployment)
                                                }
                                            >
                                                Add Employment
                                            </Button>
                                        </div>
                                        {employments.length === 0 && (
                                            <p className="text-sm text-gray-500">
                                                Add your past and current employment details.
                                            </p>
                                        )}
                                        <div className="space-y-6">
                                            {employments.map((employment, index) => (
                                                <div
                                                    key={`employment-${index}`}
                                                    className="border border-gray-200 rounded-lg p-4 space-y-4"
                                                >
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <InputField
                                                            label="Company Name"
                                                            value={employment.companyName}
                                                            onChange={(e) =>
                                                                updateListItem(
                                                                    setEmployments,
                                                                    index,
                                                                    "companyName",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                        <InputField
                                                            label="Title"
                                                            value={employment.title}
                                                            onChange={(e) =>
                                                                updateListItem(
                                                                    setEmployments,
                                                                    index,
                                                                    "title",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                        <InputField
                                                            label="Start Date"
                                                            type="date"
                                                            value={employment.startDate}
                                                            onChange={(e) =>
                                                                updateListItem(
                                                                    setEmployments,
                                                                    index,
                                                                    "startDate",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                        {!employment.isCurrent && (
                                                            <InputField
                                                                label="End Date"
                                                                type="date"
                                                                value={employment.endDate}
                                                                onChange={(e) =>
                                                                    updateListItem(
                                                                        setEmployments,
                                                                        index,
                                                                        "endDate",
                                                                        e.target.value
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                        <InputField
                                                            label="Location"
                                                            value={employment.location}
                                                            onChange={(e) =>
                                                                updateListItem(
                                                                    setEmployments,
                                                                    index,
                                                                    "location",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                        <div className="flex items-end">
                                                            <label className="flex items-center space-x-2 text-sm text-gray-700">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={employment.isCurrent}
                                                                    onChange={(e) =>
                                                                        updateListItem(
                                                                            setEmployments,
                                                                            index,
                                                                            "isCurrent",
                                                                            e.target.checked
                                                                        )
                                                                    }
                                                                />
                                                                <span>Currently working here</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <TextAreaField
                                                        label="Description"
                                                        rows={3}
                                                        value={employment.description}
                                                        onChange={(e) =>
                                                            updateListItem(
                                                                setEmployments,
                                                                index,
                                                                "description",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            removeListItem(setEmployments, index)
                                                        }
                                                    >
                                                        Remove Employment
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Education
                                            </h3>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    addListItem(setEducations, emptyEducation)
                                                }
                                            >
                                                Add Education
                                            </Button>
                                        </div>
                                        {educations.length === 0 && (
                                            <p className="text-sm text-gray-500">
                                                Add your education background.
                                            </p>
                                        )}
                                        <div className="space-y-6">
                                            {educations.map((education, index) => (
                                                <div
                                                    key={`education-${index}`}
                                                    className="border border-gray-200 rounded-lg p-4 space-y-4"
                                                >
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <InputField
                                                            label="Institution"
                                                            value={education.institution}
                                                            onChange={(e) =>
                                                                updateListItem(
                                                                    setEducations,
                                                                    index,
                                                                    "institution",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                        <InputField
                                                            label="Degree"
                                                            value={education.degree}
                                                            onChange={(e) =>
                                                                updateListItem(
                                                                    setEducations,
                                                                    index,
                                                                    "degree",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                        <InputField
                                                            label="Field of Study"
                                                            value={education.fieldOfStudy}
                                                            onChange={(e) =>
                                                                updateListItem(
                                                                    setEducations,
                                                                    index,
                                                                    "fieldOfStudy",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                        <InputField
                                                            label="Grade"
                                                            value={education.grade}
                                                            onChange={(e) =>
                                                                updateListItem(
                                                                    setEducations,
                                                                    index,
                                                                    "grade",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                        <InputField
                                                            label="Start Date"
                                                            type="date"
                                                            value={education.startDate}
                                                            onChange={(e) =>
                                                                updateListItem(
                                                                    setEducations,
                                                                    index,
                                                                    "startDate",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                        <InputField
                                                            label="End Date"
                                                            type="date"
                                                            value={education.endDate}
                                                            onChange={(e) =>
                                                                updateListItem(
                                                                    setEducations,
                                                                    index,
                                                                    "endDate",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <TextAreaField
                                                        label="Description"
                                                        rows={3}
                                                        value={education.description}
                                                        onChange={(e) =>
                                                            updateListItem(
                                                                setEducations,
                                                                index,
                                                                "description",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            removeListItem(setEducations, index)
                                                        }
                                                    >
                                                        Remove Education
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-between">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setCurrentStep(3)}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            type="button"
                                            className="corporate-gradient text-white"
                                            onClick={saveStep4}
                                        >
                                            Save & Continue
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {currentStep === 5 && (
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Projects
                                            </h3>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    addListItem(setProjects, emptyProject)
                                                }
                                            >
                                                Add Project
                                            </Button>
                                        </div>
                                        <div className="space-y-6">
                                            {projects.map((project, index) => (
                                                <div
                                                    key={`project-${index}`}
                                                    className="border border-gray-200 rounded-lg p-4 space-y-4"
                                                >
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <InputField
                                                            label="Project Name"
                                                            value={project.name}
                                                            onChange={(e) =>
                                                                updateListItem(
                                                                    setProjects,
                                                                    index,
                                                                    "name",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                        <InputField
                                                            label="Tech Stack"
                                                            value={project.techStack}
                                                            onChange={(e) =>
                                                                updateListItem(
                                                                    setProjects,
                                                                    index,
                                                                    "techStack",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                        <InputField
                                                            label="Project URL"
                                                            type="url"
                                                            value={project.projectUrl}
                                                            onChange={(e) =>
                                                                updateListItem(
                                                                    setProjects,
                                                                    index,
                                                                    "projectUrl",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                        <InputField
                                                            label="Start Date"
                                                            type="date"
                                                            value={project.startDate}
                                                            onChange={(e) =>
                                                                updateListItem(
                                                                    setProjects,
                                                                    index,
                                                                    "startDate",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                        <InputField
                                                            label="End Date"
                                                            type="date"
                                                            value={project.endDate}
                                                            onChange={(e) =>
                                                                updateListItem(
                                                                    setProjects,
                                                                    index,
                                                                    "endDate",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <TextAreaField
                                                        label="Description"
                                                        rows={3}
                                                        value={project.description}
                                                        onChange={(e) =>
                                                            updateListItem(
                                                                setProjects,
                                                                index,
                                                                "description",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            removeListItem(setProjects, index)
                                                        }
                                                    >
                                                        Remove Project
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Certifications
                                            </h3>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    addListItem(setCertifications, emptyCertification)
                                                }
                                            >
                                                Add Certification
                                            </Button>
                                        </div>
                                        <div className="space-y-6">
                                            {certifications.map((certification, index) => (
                                                <div
                                                    key={`certification-${index}`}
                                                    className="border border-gray-200 rounded-lg p-4 space-y-4"
                                                >
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <InputField
                                                            label="Certification Name"
                                                            value={certification.name}
                                                            onChange={(e) =>
                                                                updateListItem(
                                                                    setCertifications,
                                                                    index,
                                                                    "name",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                        <InputField
                                                            label="Issuer"
                                                            value={certification.issuer}
                                                            onChange={(e) =>
                                                                updateListItem(
                                                                    setCertifications,
                                                                    index,
                                                                    "issuer",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                        <InputField
                                                            label="Issue Date"
                                                            type="date"
                                                            value={certification.issueDate}
                                                            onChange={(e) =>
                                                                updateListItem(
                                                                    setCertifications,
                                                                    index,
                                                                    "issueDate",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                        <InputField
                                                            label="Expiry Date"
                                                            type="date"
                                                            value={certification.expiryDate}
                                                            onChange={(e) =>
                                                                updateListItem(
                                                                    setCertifications,
                                                                    index,
                                                                    "expiryDate",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            removeListItem(setCertifications, index)
                                                        }
                                                    >
                                                        Remove Certification
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Languages
                                            </h3>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => addListItem(setLanguages, emptyLanguage)}
                                            >
                                                Add Language
                                            </Button>
                                        </div>
                                        <div className="space-y-6">
                                            {languages.map((language, index) => (
                                                <div
                                                    key={`language-${index}`}
                                                    className="border border-gray-200 rounded-lg p-4 space-y-4"
                                                >
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <InputField
                                                            label="Language"
                                                            value={language.languageName}
                                                            onChange={(e) =>
                                                                updateListItem(
                                                                    setLanguages,
                                                                    index,
                                                                    "languageName",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                        <InputField
                                                            label="Proficiency"
                                                            type="select"
                                                            value={language.proficiency}
                                                            onChange={(e) =>
                                                                updateListItem(
                                                                    setLanguages,
                                                                    index,
                                                                    "proficiency",
                                                                    e.target.value
                                                                )
                                                            }
                                                            options={[
                                                                {
                                                                    label: "Beginner",
                                                                    value: "Beginner",
                                                                },
                                                                {
                                                                    label: "Proficient",
                                                                    value: "Proficient",
                                                                },
                                                                {
                                                                    label: "Expert",
                                                                    value: "Expert",
                                                                },
                                                            ]}
                                                        />
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            removeListItem(setLanguages, index)
                                                        }
                                                    >
                                                        Remove Language
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Address
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <InputField
                                                label="Address Line 1"
                                                name="addressLine1"
                                                value={formData.addressLine1}
                                                onChange={handleChange}
                                            />
                                            <InputField
                                                label="Address Line 2"
                                                name="addressLine2"
                                                value={formData.addressLine2}
                                                onChange={handleChange}
                                            />
                                            <InputField
                                                label="City"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                            />
                                            <InputField
                                                label="State"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                            />
                                            <InputField
                                                label="Country"
                                                name="country"
                                                value={formData.country}
                                                onChange={handleChange}
                                            />
                                            <InputField
                                                label="Postal Code"
                                                name="postalCode"
                                                value={formData.postalCode}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Online profiles
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <InputField
                                                label="LinkedIn"
                                                name="linkedIn"
                                                type="url"
                                                value={formData.linkedIn}
                                                onChange={handleChange}
                                            />
                                            <InputField
                                                label="GitHub"
                                                name="github"
                                                type="url"
                                                value={formData.github}
                                                onChange={handleChange}
                                            />
                                            <InputField
                                                label="Twitter"
                                                name="twitter"
                                                type="url"
                                                value={formData.twitter}
                                                onChange={handleChange}
                                            />
                                            <InputField
                                                label="Instagram"
                                                name="instagram"
                                                type="url"
                                                value={formData.instagram}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Set password
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <InputField
                                                label="Password *"
                                                name="password"
                                                type="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                            />
                                            <InputField
                                                label="Confirm Password *"
                                                name="confirmPassword"
                                                type="password"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setCurrentStep(4)}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            type="button"
                                            className="corporate-gradient text-white"
                                            onClick={saveStep5}
                                        >
                                            Save & Activate
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    <aside className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            className="bg-gray-900 text-white rounded-2xl p-6 shadow-xl"
                        >
                            <h3 className="text-lg font-semibold">Progress</h3>
                            <div className="mt-4 space-y-3 text-sm">
                                {steps.map((step) => (
                                    <button
                                        key={step.id}
                                        type="button"
                                        onClick={() => {
                                            if (step.id <= currentStep) {
                                                setCurrentStep(step.id);
                                            }
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-lg border border-white/10 transition ${
                                            step.id === currentStep
                                                ? "bg-white/15"
                                                : "bg-white/5"
                                        }`}
                                    >
                                        <div className="font-medium text-white">
                                            {step.title}
                                        </div>
                                        <div className="text-xs text-white/60">
                                            {step.description}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                        >
                            <h3 className="text-lg font-semibold text-gray-900">
                                Continue later
                            </h3>
                            <p className="text-sm text-gray-600 mt-2">
                                After Step 2, you can return with your email and
                                verification code to continue from your last
                                completed step.
                            </p>
                        </motion.div>
                    </aside>
                </div>
            </section>
        </>
    );
};

const InputField = ({ label, type, options, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
        </label>
        {type === "select" ? (
            <select {...props} className="custom-select">
                <option value="">Select</option>
                {(options || []).map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        ) : (
            <input type={type} {...props} className="custom-input" />
        )}
    </div>
);

const TextAreaField = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
        </label>
        <textarea {...props} className="custom-input" />
    </div>
);

export default ApplicantSignup;
