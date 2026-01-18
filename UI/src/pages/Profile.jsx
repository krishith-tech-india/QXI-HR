import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLoader } from "@/contexts/LoaderContext";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { useToast } from "@/components/ui/use-toast";
import SkillMultiSelect from "@/components/SkillMultiSelect";

const Profile = () => {
    const { userId } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const { toast } = useToast();
    const [profile, setProfile] = useState(null);
    const [draftProfile, setDraftProfile] = useState(null);
    const [error, setError] = useState("");
    const [editingSection, setEditingSection] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState("");
    const [skillsOptions, setSkillsOptions] = useState([]);
    const [isLoadingSkills, setIsLoadingSkills] = useState(false);
    const [isSavingSkills, setIsSavingSkills] = useState(false);

    const token = useMemo(() => sessionStorage.getItem("token"), []);

    const loadProfile = useCallback(
        async (withLoader = true) => {
            setError("");
            if (withLoader) {
                setProfile(null);
            }

            if (!userId && !token) {
                setError("Please log in to view your profile.");
                return;
            }

            if (withLoader) {
                showLoader();
            }
            try {
                const endpoint = userId
                    ? API_ENDPOINTS.getApplicantProfileByUserId(userId)
                    : API_ENDPOINTS.getMyApplicantProfile;
                const headers = token
                    ? { Authorization: `Bearer ${token}` }
                    : {};
                const response = await fetch(endpoint, { headers });
                const result = await response.json();

                if (result.isSuccess) {
                    setProfile(result.data);
                    setDraftProfile(normalizeProfile(result.data));
                } else {
                    setError(
                        result?.errors?.[0]?.description ||
                            result?.errorMessage ||
                            "Profile not found."
                    );
                }
            } catch (fetchError) {
                setError("Unable to load profile details.");
            } finally {
                if (withLoader) {
                    hideLoader();
                }
            }
        },
        [userId, token, showLoader, hideLoader]
    );

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const renderList = (items, formatter) => {
        if (!items || items.length === 0) {
            return <p className="text-sm text-gray-500">No entries added.</p>;
        }

        return (
            <ul className="space-y-3">
                {items.map((item, index) => (
                    <li
                        key={`${formatter.keyPrefix}-${index}`}
                        className="border border-gray-200 rounded-lg p-4"
                    >
                        {formatter.render(item)}
                    </li>
                ))}
            </ul>
        );
    };

    const mergeSkillsOptions = useCallback((incoming) => {
        setSkillsOptions((prev) => {
            const map = new Map();
            prev.forEach((skill) => {
                map.set(skill.id ?? skill.Id, skill);
            });
            (incoming || []).forEach((skill) => {
                const id = skill.id ?? skill.Id;
                if (!map.has(id)) {
                    map.set(id, skill);
                }
            });
            return Array.from(map.values()).sort((a, b) =>
                (a.name ?? a.Name ?? "").localeCompare(b.name ?? b.Name ?? "")
            );
        });
    }, []);

    const loadSkillsOptions = useCallback(async (searchKeyword = "") => {
        setIsLoadingSkills(true);
        try {
            const payload = {
                page: 1,
                pageSize: 50,
                sortBy: "name",
                ...(searchKeyword ? { searchKeyword } : {}),
            };
            const response = await fetch(API_ENDPOINTS.getSkills, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            if (result.isSuccess) {
                mergeSkillsOptions(result.data || []);
            } else {
                setSkillsOptions([]);
            }
        } catch (loadError) {
            setSkillsOptions([]);
        } finally {
            setIsLoadingSkills(false);
        }
    }, [mergeSkillsOptions]);

    const searchSkills = useCallback((searchTerm) => {
        if (!searchTerm) return;
        loadSkillsOptions(searchTerm);
    }, [loadSkillsOptions]);

    const createSkill = useCallback(async (name) => {
        const normalized = name.trim();
        if (!normalized) return null;
        const lowered = normalized.toLowerCase();

        const existingLocal = skillsOptions.find((skill) => {
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
                    pageSize: 50,
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
                    mergeSkillsOptions([match]);
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
            mergeSkillsOptions([created]);
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
    }, [mergeSkillsOptions, skillsOptions, toast]);

    const startEdit = (section) => {
        if (!draftProfile && profile) {
            setDraftProfile(normalizeProfile(profile));
        }
        if (section === "skills" && skillsOptions.length === 0) {
            loadSkillsOptions();
        }
        if (section === "header") {
            setProfileImageFile(null);
            setProfileImagePreview("");
        }
        setEditingSection(section);
    };

    const cancelEdit = () => {
        if (profile) {
            setDraftProfile(normalizeProfile(profile));
        }
        setProfileImageFile(null);
        setProfileImagePreview("");
        setEditingSection(null);
    };

    const updateDraftField = (field, value) => {
        setDraftProfile((prev) => ({
            ...prev,
            [field]: value,
        }));
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

    const updateArrayItem = (section, index, field, value) => {
        setDraftProfile((prev) => {
            const items = [...(prev?.[section] || [])];
            items[index] = { ...items[index], [field]: value };
            return { ...prev, [section]: items };
        });
    };

    const addArrayItem = (section, item) => {
        setDraftProfile((prev) => ({
            ...prev,
            [section]: [...(prev?.[section] || []), item],
        }));
    };

    const removeArrayItem = (section, index) => {
        setDraftProfile((prev) => {
            const items = [...(prev?.[section] || [])];
            items.splice(index, 1);
            return { ...prev, [section]: items };
        });
    };

    const updateUserBasics = async () => {
        if (!profile?.userId) {
            return false;
        }

        try {
            const headers = token
                ? { Authorization: `Bearer ${token}` }
                : {};
            const userResponse = await fetch(
                API_ENDPOINTS.getUserById(profile.userId),
                { headers }
            );
            const userResult = await userResponse.json();
            if (!userResult.isSuccess) {
                toast({
                    title: "Save failed",
                    description:
                        userResult?.errors?.[0]?.description ||
                        userResult?.errorMessage ||
                        "Unable to load user details.",
                    variant: "destructive",
                });
                return false;
            }

            const userData = userResult.data || {};
            const payload = {
                id: profile.userId,
                email: userData.email,
                firstName:
                    draftProfile?.firstName ||
                    userData.firstName ||
                    profile.firstName ||
                    "Applicant",
                lastName:
                    draftProfile?.lastName ??
                    userData.lastName ??
                    profile.lastName ??
                    null,
                bio: userData.bio ?? null,
                linkedInProfileUrl: userData.linkedInProfileUrl ?? null,
                phoneNumber: userData.phoneNumber || profile.phoneNumber || "",
                position: userData.position ?? null,
                profilePictureUrl: userData.profilePictureUrl ?? null,
                password: null,
                isPublic: userData.isPublic ?? profile.isPublic ?? true,
                isActive: userData.isActive ?? true,
                roleIds: userData.roleIds ?? null,
                skillIds: draftProfile?.skillIds || userData.skillIds || [],
            };

            const updateResponse = await fetch(
                API_ENDPOINTS.updateUser(profile.userId),
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        ...headers,
                    },
                    body: JSON.stringify(payload),
                }
            );
            const updateResult = await updateResponse.json();
            if (!updateResult.isSuccess) {
                toast({
                    title: "Save failed",
                    description:
                        updateResult?.errors?.[0]?.description ||
                        updateResult?.errorMessage ||
                        "Unable to update user details.",
                    variant: "destructive",
                });
                return false;
            }

            return true;
        } catch (error) {
            toast({
                title: "Network error",
                description: "Unable to update user details.",
                variant: "destructive",
            });
            return false;
        }
    };

    const saveSection = async () => {
        if (!draftProfile?.profileHeadline) {
            toast({
                title: "Missing headline",
                description: "Profile headline is required to save changes.",
                variant: "destructive",
            });
            return;
        }

        if (!profile?.userId) {
            toast({
                title: "Unable to save",
                description: "Profile is not loaded yet.",
                variant: "destructive",
            });
            return;
        }

        setIsSaving(true);
        try {
            let updatedDraft = { ...draftProfile };
            if (editingSection === "header" && profileImageFile) {
                const uploadedImageUrl = await uploadFile(
                    profileImageFile,
                    "profile"
                );
                updatedDraft = {
                    ...updatedDraft,
                    profileImageUrl: uploadedImageUrl,
                };
            }

            if (editingSection === "header") {
                const userUpdated = await updateUserBasics();
                if (!userUpdated) {
                    return;
                }
            }

            const response = await fetch(
                API_ENDPOINTS.updateApplicantProfile(profile.userId),
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify(buildUpsertPayload(updatedDraft)),
                }
            );
            const result = await response.json();

            if (result.isSuccess) {
                setProfile(result.data);
                setDraftProfile(normalizeProfile(result.data));
                setEditingSection(null);
                setProfileImageFile(null);
                setProfileImagePreview("");
                toast({
                    title: "Saved",
                    description: "Profile section updated successfully.",
                });
            } else {
                toast({
                    title: "Save failed",
                    description:
                        result?.errors?.[0]?.description ||
                        result?.errorMessage ||
                        "Unable to save changes.",
                    variant: "destructive",
                });
            }
        } catch (saveError) {
            toast({
                title: "Network error",
                description: "Unable to save changes.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const saveSkills = async () => {
        if (!profile?.userId) {
            toast({
                title: "Unable to save",
                description: "Profile is not loaded yet.",
                variant: "destructive",
            });
            return;
        }

        setIsSavingSkills(true);
        try {
            const headers = token
                ? { Authorization: `Bearer ${token}` }
                : {};
            const userResponse = await fetch(
                API_ENDPOINTS.getUserById(profile.userId),
                { headers }
            );
            const userResult = await userResponse.json();
            if (!userResult.isSuccess) {
                toast({
                    title: "Save failed",
                    description:
                        userResult?.errors?.[0]?.description ||
                        userResult?.errorMessage ||
                        "Unable to load user details.",
                    variant: "destructive",
                });
                return;
            }

            const userData = userResult.data || {};
            const payload = {
                id: profile.userId,
                email: userData.email,
                firstName: userData.firstName || profile.firstName || "Applicant",
                lastName: userData.lastName ?? profile.lastName ?? null,
                bio: userData.bio ?? null,
                linkedInProfileUrl: userData.linkedInProfileUrl ?? null,
                phoneNumber: userData.phoneNumber || profile.phoneNumber || "",
                position: userData.position ?? null,
                profilePictureUrl: userData.profilePictureUrl ?? null,
                password: null,
                isPublic:
                    userData.isPublic ??
                    profile.isPublic ??
                    true,
                isActive: userData.isActive ?? true,
                roleIds: userData.roleIds ?? null,
                skillIds: draftProfile?.skillIds || [],
            };

            const updateResponse = await fetch(
                API_ENDPOINTS.updateUser(profile.userId),
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        ...headers,
                    },
                    body: JSON.stringify(payload),
                }
            );
            const updateResult = await updateResponse.json();
            if (updateResult.isSuccess) {
                await loadProfile(false);
                setEditingSection(null);
                toast({
                    title: "Saved",
                    description: "Skills updated successfully.",
                });
            } else {
                toast({
                    title: "Save failed",
                    description:
                        updateResult?.errors?.[0]?.description ||
                        updateResult?.errorMessage ||
                        "Unable to save skills.",
                    variant: "destructive",
                });
            }
        } catch (saveError) {
            toast({
                title: "Network error",
                description: "Unable to save skills.",
                variant: "destructive",
            });
        } finally {
            setIsSavingSkills(false);
        }
    };

    const fullName = profile
        ? [profile.firstName, profile.middleName, profile.lastName]
              .filter(Boolean)
              .join(" ")
        : "";

    return (
        <>
            <Helmet>
                <title>Applicant Profile - QXI HR (OPC) PRIVATE LIMITED</title>
                <meta
                    name="description"
                    content="View applicant profile details and experience."
                />
            </Helmet>
            <section className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto space-y-8">
                    {error && (
                        <div className="bg-white rounded-lg shadow p-6 text-center text-red-600">
                            {error}
                        </div>
                    )}

                    {profile && (
                        <>
                            <div className="bg-white rounded-xl shadow p-6 space-y-5">
                                <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
                                <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                    {profile.profileImageUrl ? (
                                        <img
                                            src={profile.profileImageUrl}
                                            alt={profile.firstName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-3xl text-gray-400">
                                            {profile.firstName?.charAt(0) || "?"}
                                        </span>
                                        )}
                                    </div>
                                <div className="flex-1 mt-4 md:mt-0 space-y-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900">
                                                {fullName || "Applicant"}
                                            </h1>
                                            <p className="text-gray-600 mt-1">
                                                {profile.profileHeadline}
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => startEdit("header")}
                                            disabled={editingSection && editingSection !== "header"}
                                        >
                                            Edit
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                        <span>{profile.email}</span>
                                        <span>{profile.phoneNumber}</span>
                                        {(profile.city || profile.state || profile.country) && (
                                            <span>
                                                {[profile.city, profile.state, profile.country]
                                                    .filter(Boolean)
                                                    .join(", ")}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {profile.resumeUrl && (
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    window.open(
                                                        withProtocol(profile.resumeUrl),
                                                        "_blank"
                                                    )
                                                }
                                            >
                                                View Resume
                                            </Button>
                                        )}
                                        {profile.portfolioUrl && (
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    window.open(
                                                        withProtocol(profile.portfolioUrl),
                                                        "_blank"
                                                    )
                                                }
                                            >
                                                Portfolio
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                </div>
                                {editingSection === "header" && (
                                    <div className="border-t border-gray-100 pt-5 space-y-4">
                                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                                {profileImagePreview ||
                                                draftProfile?.profileImageUrl ? (
                                                    <img
                                                        src={
                                                            profileImagePreview ||
                                                            draftProfile?.profileImageUrl
                                                        }
                                                        alt="Profile"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-2xl text-gray-400">
                                                        {draftProfile?.firstName?.charAt(0) ||
                                                            "?"}
                                                    </span>
                                                )}
                                            </div>
                                            <label className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gray-900 text-white text-sm cursor-pointer shadow">
                                                Upload Photo
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleProfileImageChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormInput
                                                label="First Name"
                                                value={draftProfile?.firstName || ""}
                                                onChange={(value) =>
                                                    updateDraftField("firstName", value)
                                                }
                                                required
                                            />
                                            <FormInput
                                                label="Middle Name"
                                                value={draftProfile?.middleName || ""}
                                                onChange={(value) =>
                                                    updateDraftField("middleName", value)
                                                }
                                            />
                                            <FormInput
                                                label="Last Name"
                                                value={draftProfile?.lastName || ""}
                                                onChange={(value) =>
                                                    updateDraftField("lastName", value)
                                                }
                                            />
                                            <FormInput
                                                label="Profile Headline"
                                                value={draftProfile?.profileHeadline || ""}
                                                onChange={(value) =>
                                                    updateDraftField("profileHeadline", value)
                                                }
                                                required
                                            />
                                            <FormInput
                                                label="Resume URL"
                                                value={draftProfile?.resumeUrl || ""}
                                                onChange={(value) =>
                                                    updateDraftField("resumeUrl", value)
                                                }
                                            />
                                            <FormInput
                                                label="Portfolio URL"
                                                value={draftProfile?.portfolioUrl || ""}
                                                onChange={(value) =>
                                                    updateDraftField("portfolioUrl", value)
                                                }
                                            />
                                            <FormInput
                                                label="City"
                                                value={draftProfile?.city || ""}
                                                onChange={(value) =>
                                                    updateDraftField("city", value)
                                                }
                                            />
                                            <FormInput
                                                label="State"
                                                value={draftProfile?.state || ""}
                                                onChange={(value) =>
                                                    updateDraftField("state", value)
                                                }
                                            />
                                            <FormInput
                                                label="Country"
                                                value={draftProfile?.country || ""}
                                                onChange={(value) =>
                                                    updateDraftField("country", value)
                                                }
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            <Button onClick={saveSection} disabled={isSaving}>
                                                {isSaving ? "Saving..." : "Save"}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={cancelEdit}
                                                disabled={isSaving}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-white rounded-xl shadow p-6 space-y-4">
                                <div className="flex items-center justify-between gap-4">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Profile Summary
                                    </h2>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => startEdit("summary")}
                                        disabled={
                                            editingSection && editingSection !== "summary"
                                        }
                                    >
                                        Edit
                                    </Button>
                                </div>
                                {editingSection === "summary" ? (
                                    <div className="space-y-4">
                                        <FormTextarea
                                            label="Summary"
                                            value={draftProfile?.profileSummary || ""}
                                            onChange={(value) =>
                                                updateDraftField("profileSummary", value)
                                            }
                                        />
                                        <div className="flex flex-wrap gap-3">
                                            <Button onClick={saveSection} disabled={isSaving}>
                                                {isSaving ? "Saving..." : "Save"}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={cancelEdit}
                                                disabled={isSaving}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-700">
                                        {profile.profileSummary || "No summary added."}
                                    </p>
                                )}
                            </div>

                            <div className="bg-white rounded-xl shadow p-6 space-y-4">
                                <div className="flex items-center justify-between gap-4">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Key Skills
                                    </h2>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => startEdit("skills")}
                                        disabled={
                                            editingSection &&
                                            editingSection !== "skills"
                                        }
                                    >
                                        Edit
                                    </Button>
                                </div>
                                {editingSection === "skills" ? (
                                    <div className="space-y-4">
                                        <SkillMultiSelect
                                            label="Skills"
                                            skills={skillsOptions}
                                            selectedIds={draftProfile?.skillIds || []}
                                            onChange={(skillIds) =>
                                                updateDraftField("skillIds", skillIds)
                                            }
                                            isLoading={isLoadingSkills}
                                            onSearch={searchSkills}
                                            onCreateSkill={createSkill}
                                        />
                                        <div className="flex flex-wrap gap-3">
                                            <Button
                                                onClick={saveSkills}
                                                disabled={isSavingSkills}
                                            >
                                                {isSavingSkills ? "Saving..." : "Save"}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={cancelEdit}
                                                disabled={isSavingSkills}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : profile.skills && profile.skills.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {profile.skills.map((skill) => (
                                            <span
                                                key={`skill-${skill.id ?? skill.Id}`}
                                                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                                            >
                                                {skill.name ?? skill.Name}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">No skills added.</p>
                                )}
                            </div>

                            <div className="bg-white rounded-xl shadow p-6 space-y-4">
                                <div className="flex items-center justify-between gap-4">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Employment
                                    </h2>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => startEdit("employments")}
                                        disabled={
                                            editingSection &&
                                            editingSection !== "employments"
                                        }
                                    >
                                        Edit
                                    </Button>
                                </div>
                                {editingSection === "employments" ? (
                                    <div className="space-y-4">
                                        {(draftProfile?.employments || []).map(
                                            (item, index) => (
                                                <div
                                                    key={`employment-edit-${index}`}
                                                    className="border border-gray-200 rounded-lg p-4 space-y-3"
                                                >
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <FormInput
                                                            label="Title"
                                                            value={item.title || ""}
                                                            onChange={(value) =>
                                                                updateArrayItem(
                                                                    "employments",
                                                                    index,
                                                                    "title",
                                                                    value
                                                                )
                                                            }
                                                        />
                                                        <FormInput
                                                            label="Company"
                                                            value={item.companyName || ""}
                                                            onChange={(value) =>
                                                                updateArrayItem(
                                                                    "employments",
                                                                    index,
                                                                    "companyName",
                                                                    value
                                                                )
                                                            }
                                                        />
                                                        <FormInput
                                                            label="Location"
                                                            value={item.location || ""}
                                                            onChange={(value) =>
                                                                updateArrayItem(
                                                                    "employments",
                                                                    index,
                                                                    "location",
                                                                    value
                                                                )
                                                            }
                                                        />
                                                        <FormInput
                                                            label="Start Date"
                                                            type="date"
                                                            value={item.startDate || ""}
                                                            onChange={(value) =>
                                                                updateArrayItem(
                                                                    "employments",
                                                                    index,
                                                                    "startDate",
                                                                    value
                                                                )
                                                            }
                                                        />
                                                        <FormInput
                                                            label="End Date"
                                                            type="date"
                                                            value={item.endDate || ""}
                                                            onChange={(value) =>
                                                                updateArrayItem(
                                                                    "employments",
                                                                    index,
                                                                    "endDate",
                                                                    value
                                                                )
                                                            }
                                                        />
                                                        <div className="flex items-end gap-2">
                                                            <input
                                                                id={`employment-current-${index}`}
                                                                type="checkbox"
                                                                checked={Boolean(item.isCurrent)}
                                                                onChange={(event) =>
                                                                    updateArrayItem(
                                                                        "employments",
                                                                        index,
                                                                        "isCurrent",
                                                                        event.target.checked
                                                                    )
                                                                }
                                                            />
                                                            <label
                                                                htmlFor={`employment-current-${index}`}
                                                                className="text-sm text-gray-600"
                                                            >
                                                                Current role
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <FormTextarea
                                                        label="Description"
                                                        value={item.description || ""}
                                                        onChange={(value) =>
                                                            updateArrayItem(
                                                                "employments",
                                                                index,
                                                                "description",
                                                                value
                                                            )
                                                        }
                                                    />
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            removeArrayItem("employments", index)
                                                        }
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            )
                                        )}
                                        <div className="flex flex-wrap gap-3">
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    addArrayItem("employments", {
                                                        id: null,
                                                        companyName: "",
                                                        title: "",
                                                        startDate: "",
                                                        endDate: "",
                                                        isCurrent: false,
                                                        location: "",
                                                        description: "",
                                                    })
                                                }
                                            >
                                                Add employment
                                            </Button>
                                            <Button
                                                onClick={saveSection}
                                                disabled={isSaving}
                                            >
                                                {isSaving ? "Saving..." : "Save"}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={cancelEdit}
                                                disabled={isSaving}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    renderList(profile.employments, {
                                        keyPrefix: "employment",
                                        render: (item) => (
                                            <div className="space-y-1">
                                                <h3 className="font-semibold text-gray-900">
                                                    {item.title} · {item.companyName}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {item.location || ""}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {formatDateRange(
                                                        item.startDate ?? item.StartDate,
                                                        item.endDate ?? item.EndDate,
                                                        item.isCurrent ?? item.IsCurrent
                                                    )}
                                                </p>
                                                {item.description && (
                                                    <p className="text-sm text-gray-700">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>
                                        ),
                                    })
                                )}
                            </div>

                            <div className="bg-white rounded-xl shadow p-6 space-y-4">
                                <div className="flex items-center justify-between gap-4">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Education
                                    </h2>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => startEdit("educations")}
                                        disabled={
                                            editingSection &&
                                            editingSection !== "educations"
                                        }
                                    >
                                        Edit
                                    </Button>
                                </div>
                                {editingSection === "educations" ? (
                                    <div className="space-y-4">
                                        {(draftProfile?.educations || []).map(
                                            (item, index) => (
                                                <div
                                                    key={`education-edit-${index}`}
                                                    className="border border-gray-200 rounded-lg p-4 space-y-3"
                                                >
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <FormInput
                                                            label="Institution"
                                                            value={item.institution || ""}
                                                            onChange={(value) =>
                                                                updateArrayItem(
                                                                    "educations",
                                                                    index,
                                                                    "institution",
                                                                    value
                                                                )
                                                            }
                                                        />
                                                        <FormInput
                                                            label="Degree"
                                                            value={item.degree || ""}
                                                            onChange={(value) =>
                                                                updateArrayItem(
                                                                    "educations",
                                                                    index,
                                                                    "degree",
                                                                    value
                                                                )
                                                            }
                                                        />
                                                        <FormInput
                                                            label="Field of Study"
                                                            value={item.fieldOfStudy || ""}
                                                            onChange={(value) =>
                                                                updateArrayItem(
                                                                    "educations",
                                                                    index,
                                                                    "fieldOfStudy",
                                                                    value
                                                                )
                                                            }
                                                        />
                                                        <FormInput
                                                            label="Grade"
                                                            value={item.grade || ""}
                                                            onChange={(value) =>
                                                                updateArrayItem(
                                                                    "educations",
                                                                    index,
                                                                    "grade",
                                                                    value
                                                                )
                                                            }
                                                        />
                                                        <FormInput
                                                            label="Start Date"
                                                            type="date"
                                                            value={item.startDate || ""}
                                                            onChange={(value) =>
                                                                updateArrayItem(
                                                                    "educations",
                                                                    index,
                                                                    "startDate",
                                                                    value
                                                                )
                                                            }
                                                        />
                                                        <FormInput
                                                            label="End Date"
                                                            type="date"
                                                            value={item.endDate || ""}
                                                            onChange={(value) =>
                                                                updateArrayItem(
                                                                    "educations",
                                                                    index,
                                                                    "endDate",
                                                                    value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <FormTextarea
                                                        label="Description"
                                                        value={item.description || ""}
                                                        onChange={(value) =>
                                                            updateArrayItem(
                                                                "educations",
                                                                index,
                                                                "description",
                                                                value
                                                            )
                                                        }
                                                    />
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            removeArrayItem("educations", index)
                                                        }
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            )
                                        )}
                                        <div className="flex flex-wrap gap-3">
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    addArrayItem("educations", {
                                                        id: null,
                                                        institution: "",
                                                        degree: "",
                                                        fieldOfStudy: "",
                                                        startDate: "",
                                                        endDate: "",
                                                        grade: "",
                                                        description: "",
                                                    })
                                                }
                                            >
                                                Add education
                                            </Button>
                                            <Button
                                                onClick={saveSection}
                                                disabled={isSaving}
                                            >
                                                {isSaving ? "Saving..." : "Save"}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={cancelEdit}
                                                disabled={isSaving}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    renderList(profile.educations, {
                                        keyPrefix: "education",
                                        render: (item) => (
                                            <div className="space-y-1">
                                                <h3 className="font-semibold text-gray-900">
                                                    {item.institution}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {[item.degree, item.fieldOfStudy]
                                                        .filter(Boolean)
                                                        .join(" · ")}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {formatDateRange(
                                                        item.startDate ?? item.StartDate,
                                                        item.endDate ?? item.EndDate
                                                    )}
                                                </p>
                                                {item.description && (
                                                    <p className="text-sm text-gray-700">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>
                                        ),
                                    })
                                )}
                            </div>

                            <div className="bg-white rounded-xl shadow p-6 space-y-4">
                                <div className="flex items-center justify-between gap-4">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Projects
                                    </h2>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => startEdit("projects")}
                                        disabled={
                                            editingSection &&
                                            editingSection !== "projects"
                                        }
                                    >
                                        Edit
                                    </Button>
                                </div>
                                {editingSection === "projects" ? (
                                    <div className="space-y-4">
                                        {(draftProfile?.projects || []).map(
                                            (item, index) => (
                                                <div
                                                    key={`project-edit-${index}`}
                                                    className="border border-gray-200 rounded-lg p-4 space-y-3"
                                                >
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <FormInput
                                                            label="Project Name"
                                                            value={item.name || ""}
                                                            onChange={(value) =>
                                                                updateArrayItem(
                                                                    "projects",
                                                                    index,
                                                                    "name",
                                                                    value
                                                                )
                                                            }
                                                        />
                                                        <FormInput
                                                            label="Project URL"
                                                            value={item.projectUrl || ""}
                                                            onChange={(value) =>
                                                                updateArrayItem(
                                                                    "projects",
                                                                    index,
                                                                    "projectUrl",
                                                                    value
                                                                )
                                                            }
                                                        />
                                                        <FormInput
                                                            label="Tech Stack"
                                                            value={item.techStack || ""}
                                                            onChange={(value) =>
                                                                updateArrayItem(
                                                                    "projects",
                                                                    index,
                                                                    "techStack",
                                                                    value
                                                                )
                                                            }
                                                        />
                                                        <FormInput
                                                            label="Start Date"
                                                            type="date"
                                                            value={item.startDate || ""}
                                                            onChange={(value) =>
                                                                updateArrayItem(
                                                                    "projects",
                                                                    index,
                                                                    "startDate",
                                                                    value
                                                                )
                                                            }
                                                        />
                                                        <FormInput
                                                            label="End Date"
                                                            type="date"
                                                            value={item.endDate || ""}
                                                            onChange={(value) =>
                                                                updateArrayItem(
                                                                    "projects",
                                                                    index,
                                                                    "endDate",
                                                                    value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <FormTextarea
                                                        label="Description"
                                                        value={item.description || ""}
                                                        onChange={(value) =>
                                                            updateArrayItem(
                                                                "projects",
                                                                index,
                                                                "description",
                                                                value
                                                            )
                                                        }
                                                    />
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            removeArrayItem("projects", index)
                                                        }
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            )
                                        )}
                                        <div className="flex flex-wrap gap-3">
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    addArrayItem("projects", {
                                                        id: null,
                                                        name: "",
                                                        description: "",
                                                        techStack: "",
                                                        projectUrl: "",
                                                        startDate: "",
                                                        endDate: "",
                                                    })
                                                }
                                            >
                                                Add project
                                            </Button>
                                            <Button
                                                onClick={saveSection}
                                                disabled={isSaving}
                                            >
                                                {isSaving ? "Saving..." : "Save"}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={cancelEdit}
                                                disabled={isSaving}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    renderList(profile.projects, {
                                        keyPrefix: "project",
                                        render: (item) => (
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-semibold text-gray-900">
                                                        {item.name}
                                                    </h3>
                                                    {item.projectUrl && (
                                                        <button
                                                            className="text-sm text-blue-600 hover:underline"
                                                        onClick={() =>
                                                            window.open(
                                                                withProtocol(item.projectUrl),
                                                                "_blank"
                                                            )
                                                        }
                                                    >
                                                        View
                                                    </button>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    {formatDateRange(
                                                        item.startDate ?? item.StartDate,
                                                        item.endDate ?? item.EndDate
                                                    )}
                                                </p>
                                                {item.techStack && (
                                                    <p className="text-sm text-gray-600">
                                                        {item.techStack}
                                                    </p>
                                                )}
                                                {item.description && (
                                                    <p className="text-sm text-gray-700">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>
                                        ),
                                    })
                                )}
                            </div>

                            <div className="bg-white rounded-xl shadow p-6 space-y-4">
                                <div className="flex items-center justify-between gap-4">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Certifications
                                    </h2>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => startEdit("certifications")}
                                        disabled={
                                            editingSection &&
                                            editingSection !== "certifications"
                                        }
                                    >
                                        Edit
                                    </Button>
                                </div>
                                {editingSection === "certifications" ? (
                                    <div className="space-y-4">
                                        {(draftProfile?.certifications || []).map(
                                            (item, index) => (
                                                <div
                                                    key={`certification-edit-${index}`}
                                                    className="border border-gray-200 rounded-lg p-4 space-y-3"
                                                >
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <FormInput
                                                            label="Certification Name"
                                                            value={item.name || ""}
                                                            onChange={(value) =>
                                                                updateArrayItem(
                                                                    "certifications",
                                                                    index,
                                                                    "name",
                                                                    value
                                                                )
                                                            }
                                                        />
                                                        <FormInput
                                                            label="Issuer"
                                                            value={item.issuer || ""}
                                                            onChange={(value) =>
                                                                updateArrayItem(
                                                                    "certifications",
                                                                    index,
                                                                    "issuer",
                                                                    value
                                                                )
                                                            }
                                                        />
                                                        <FormInput
                                                            label="Issue Date"
                                                            type="date"
                                                            value={item.issueDate || ""}
                                                            onChange={(value) =>
                                                                updateArrayItem(
                                                                    "certifications",
                                                                    index,
                                                                    "issueDate",
                                                                    value
                                                                )
                                                            }
                                                        />
                                                        <FormInput
                                                            label="Expiry Date"
                                                            type="date"
                                                            value={item.expiryDate || ""}
                                                            onChange={(value) =>
                                                                updateArrayItem(
                                                                    "certifications",
                                                                    index,
                                                                    "expiryDate",
                                                                    value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            removeArrayItem("certifications", index)
                                                        }
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            )
                                        )}
                                        <div className="flex flex-wrap gap-3">
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    addArrayItem("certifications", {
                                                        id: null,
                                                        name: "",
                                                        issuer: "",
                                                        issueDate: "",
                                                        expiryDate: "",
                                                    })
                                                }
                                            >
                                                Add certification
                                            </Button>
                                            <Button
                                                onClick={saveSection}
                                                disabled={isSaving}
                                            >
                                                {isSaving ? "Saving..." : "Save"}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={cancelEdit}
                                                disabled={isSaving}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    renderList(profile.certifications, {
                                        keyPrefix: "certification",
                                        render: (item) => (
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-semibold text-gray-900">
                                                        {item.name}
                                                    </h3>
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    {[item.issuer].filter(Boolean).join(" · ")}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {formatDateRange(
                                                        item.issueDate ?? item.IssueDate,
                                                        item.expiryDate ?? item.ExpiryDate
                                                    )}
                                                </p>
                                            </div>
                                        ),
                                    })
                                )}
                            </div>

                            <div className="bg-white rounded-xl shadow p-6 space-y-4">
                                <div className="flex items-center justify-between gap-4">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Languages
                                    </h2>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => startEdit("languages")}
                                        disabled={
                                            editingSection &&
                                            editingSection !== "languages"
                                        }
                                    >
                                        Edit
                                    </Button>
                                </div>
                                {editingSection === "languages" ? (
                                    <div className="space-y-4">
                                        {(draftProfile?.languages || []).map(
                                            (item, index) => (
                                                <div
                                                    key={`language-edit-${index}`}
                                                    className="border border-gray-200 rounded-lg p-4 space-y-3"
                                                >
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <FormInput
                                                            label="Language"
                                                            value={item.languageName || ""}
                                                            onChange={(value) =>
                                                                updateArrayItem(
                                                                    "languages",
                                                                    index,
                                                                    "languageName",
                                                                    value
                                                                )
                                                            }
                                                        />
                                                        <FormSelect
                                                            label="Proficiency"
                                                            value={item.proficiency || ""}
                                                            onChange={(value) =>
                                                                updateArrayItem(
                                                                    "languages",
                                                                    index,
                                                                    "proficiency",
                                                                    value
                                                                )
                                                            }
                                                            options={[
                                                                { label: "Beginner", value: "Beginner" },
                                                                {
                                                                    label: "Proficient",
                                                                    value: "Proficient",
                                                                },
                                                                { label: "Expert", value: "Expert" },
                                                            ]}
                                                        />
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            removeArrayItem("languages", index)
                                                        }
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            )
                                        )}
                                        <div className="flex flex-wrap gap-3">
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    addArrayItem("languages", {
                                                        id: null,
                                                        languageName: "",
                                                        proficiency: "",
                                                    })
                                                }
                                            >
                                                Add language
                                            </Button>
                                            <Button
                                                onClick={saveSection}
                                                disabled={isSaving}
                                            >
                                                {isSaving ? "Saving..." : "Save"}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={cancelEdit}
                                                disabled={isSaving}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    renderList(profile.languages, {
                                        keyPrefix: "language",
                                        render: (item) => (
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-900">
                                                    {item.languageName}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {item.proficiency || ""}
                                                </span>
                                            </div>
                                        ),
                                    })
                                )}
                            </div>

                            <div className="bg-white rounded-xl shadow p-6 space-y-4">
                                <div className="flex items-center justify-between gap-4">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Online Profiles
                                    </h2>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => startEdit("onlineProfiles")}
                                        disabled={
                                            editingSection &&
                                            editingSection !== "onlineProfiles"
                                        }
                                    >
                                        Edit
                                    </Button>
                                </div>
                                {editingSection === "onlineProfiles" ? (
                                    <div className="space-y-4">
                                        {(draftProfile?.onlineProfiles || []).map(
                                            (item, index) => (
                                                <div
                                                    key={`online-edit-${index}`}
                                                    className="border border-gray-200 rounded-lg p-4 space-y-3"
                                                >
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <FormInput
                                                            label="Platform"
                                                            value={item.platform || ""}
                                                            onChange={(value) =>
                                                                updateArrayItem(
                                                                    "onlineProfiles",
                                                                    index,
                                                                    "platform",
                                                                    value
                                                                )
                                                            }
                                                        />
                                                        <FormInput
                                                            label="URL"
                                                            value={item.url || ""}
                                                            onChange={(value) =>
                                                                updateArrayItem(
                                                                    "onlineProfiles",
                                                                    index,
                                                                    "url",
                                                                    value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            removeArrayItem(
                                                                "onlineProfiles",
                                                                index
                                                            )
                                                        }
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            )
                                        )}
                                        <div className="flex flex-wrap gap-3">
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    addArrayItem("onlineProfiles", {
                                                        id: null,
                                                        platform: "",
                                                        url: "",
                                                    })
                                                }
                                            >
                                                Add profile
                                            </Button>
                                            <Button
                                                onClick={saveSection}
                                                disabled={isSaving}
                                            >
                                                {isSaving ? "Saving..." : "Save"}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={cancelEdit}
                                                disabled={isSaving}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    renderList(profile.onlineProfiles, {
                                        keyPrefix: "online",
                                        render: (item) => (
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-900">
                                                    {item.platform}
                                                </span>
                                                <button
                                                    className="text-sm text-blue-600 hover:underline"
                                                    onClick={() =>
                                                        window.open(
                                                            withProtocol(item.url),
                                                            "_blank"
                                                        )
                                                    }
                                                >
                                                    Visit
                                                </button>
                                            </div>
                                        ),
                                    })
                                )}
                            </div>
                        </>
                    )}
                </div>
            </section>
        </>
    );
};

const normalizeDateValue = (value) => {
    if (!value) return "";
    if (typeof value === "string") {
        const trimmed = value.trim();
        const isoCandidate = trimmed.split("T")[0];
        if (/^\d{4}-\d{2}-\d{2}$/.test(isoCandidate)) {
            return isoCandidate;
        }
        const match = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (match) {
            const [, day, month, year] = match;
            return `${year}-${month}-${day}`;
        }
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return "";
    }
    return parsed.toISOString().split("T")[0];
};

const normalizeProfile = (profile) => {
    if (!profile) return null;
    return {
        profileHeadline: profile.profileHeadline ?? profile.ProfileHeadline ?? "",
        firstName: profile.firstName ?? profile.FirstName ?? "",
        lastName: profile.lastName ?? profile.LastName ?? "",
        profileSummary: profile.profileSummary ?? profile.ProfileSummary ?? "",
        portfolioUrl: profile.portfolioUrl ?? profile.PortfolioUrl ?? "",
        resumeUrl: profile.resumeUrl ?? profile.ResumeUrl ?? "",
        profileImageUrl: profile.profileImageUrl ?? profile.ProfileImageUrl ?? "",
        middleName: profile.middleName ?? profile.MiddleName ?? "",
        dateOfBirth: normalizeDateValue(
            profile.dateOfBirth ?? profile.DateOfBirth
        ),
        addressLine1: profile.addressLine1 ?? profile.AddressLine1 ?? "",
        addressLine2: profile.addressLine2 ?? profile.AddressLine2 ?? "",
        city: profile.city ?? profile.City ?? "",
        state: profile.state ?? profile.State ?? "",
        country: profile.country ?? profile.Country ?? "",
        postalCode: profile.postalCode ?? profile.PostalCode ?? "",
        skillIds:
            profile.skillIds ??
            profile.SkillIds ??
            (profile.skills || profile.Skills || [])
                .map((skill) => skill.id ?? skill.Id)
                .filter(Boolean),
        employments: (profile.employments || profile.Employments || []).map((item) => ({
            id: item.id ?? item.Id ?? null,
            companyName: item.companyName ?? item.CompanyName ?? "",
            title: item.title ?? item.Title ?? "",
            startDate: normalizeDateValue(item.startDate ?? item.StartDate),
            endDate: normalizeDateValue(item.endDate ?? item.EndDate),
            isCurrent: item.isCurrent ?? item.IsCurrent ?? false,
            location: item.location ?? item.Location ?? "",
            description: item.description ?? item.Description ?? "",
        })),
        educations: (profile.educations || profile.Educations || []).map((item) => ({
            id: item.id ?? item.Id ?? null,
            institution: item.institution ?? item.Institution ?? "",
            degree: item.degree ?? item.Degree ?? "",
            fieldOfStudy: item.fieldOfStudy ?? item.FieldOfStudy ?? "",
            startDate: normalizeDateValue(item.startDate ?? item.StartDate),
            endDate: normalizeDateValue(item.endDate ?? item.EndDate),
            grade: item.grade ?? item.Grade ?? "",
            description: item.description ?? item.Description ?? "",
        })),
        projects: (profile.projects || profile.Projects || []).map((item) => ({
            id: item.id ?? item.Id ?? null,
            name: item.name ?? item.Name ?? "",
            description: item.description ?? item.Description ?? "",
            techStack: item.techStack ?? item.TechStack ?? "",
            projectUrl: item.projectUrl ?? item.ProjectUrl ?? "",
            startDate: normalizeDateValue(item.startDate ?? item.StartDate),
            endDate: normalizeDateValue(item.endDate ?? item.EndDate),
        })),
        certifications: (profile.certifications || profile.Certifications || []).map((item) => ({
            id: item.id ?? item.Id ?? null,
            name: item.name ?? item.Name ?? "",
            issuer: item.issuer ?? item.Issuer ?? "",
            issueDate: normalizeDateValue(item.issueDate ?? item.IssueDate),
            expiryDate: normalizeDateValue(item.expiryDate ?? item.ExpiryDate),
        })),
        languages: (profile.languages || profile.Languages || []).map((item) => ({
            id: item.id ?? item.Id ?? null,
            languageName: item.languageName ?? item.LanguageName ?? "",
            proficiency: item.proficiency ?? item.Proficiency ?? "",
        })),
        onlineProfiles: (profile.onlineProfiles || profile.OnlineProfiles || []).map((item) => ({
            id: item.id ?? item.Id ?? null,
            platform: item.platform ?? item.Platform ?? "",
            url: item.url ?? item.Url ?? "",
        })),
    };
};

const buildUpsertPayload = (draft) => ({
    profileHeadline: draft.profileHeadline || "",
    profileSummary: draft.profileSummary || null,
    portfolioUrl: draft.portfolioUrl || null,
    resumeUrl: draft.resumeUrl || null,
    profileImageUrl: draft.profileImageUrl || null,
    middleName: draft.middleName || null,
    dateOfBirth: draft.dateOfBirth || null,
    addressLine1: draft.addressLine1 || null,
    addressLine2: draft.addressLine2 || null,
    city: draft.city || null,
    state: draft.state || null,
    country: draft.country || null,
    postalCode: draft.postalCode || null,
    employments: draft.employments || [],
    educations: draft.educations || [],
    projects: draft.projects || [],
    onlineProfiles: draft.onlineProfiles || [],
    certifications: draft.certifications || [],
    languages: draft.languages || [],
});

const formatDateRange = (start, end, isCurrent) => {
    const startDate = start ?? "";
    if (isCurrent) {
        return startDate ? `${startDate} - Present` : "Present";
    }
    const endDate = end ?? "";
    if (!startDate && !endDate) {
        return "";
    }
    if (startDate && endDate) {
        return `${startDate} - ${endDate}`;
    }
    return startDate || endDate;
};

const withProtocol = (url) => {
    if (!url) return "";
    const trimmed = url.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) {
        return trimmed;
    }
    return `https://${trimmed}`;
};

const FormInput = ({ label, value, onChange, type = "text", required }) => (
    <label className="space-y-1 text-sm text-gray-700">
        <span className="font-medium">
            {label}
            {required ? " *" : ""}
        </span>
        <input
            type={type}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900"
        />
    </label>
);

const FormTextarea = ({ label, value, onChange }) => (
    <label className="space-y-1 text-sm text-gray-700">
        <span className="font-medium">{label}</span>
        <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900"
        />
    </label>
);

const FormSelect = ({ label, value, onChange, options }) => (
    <label className="space-y-1 text-sm text-gray-700">
        <span className="font-medium">{label}</span>
        <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 bg-white"
        >
            <option value="">Select</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </label>
);

export default Profile;
