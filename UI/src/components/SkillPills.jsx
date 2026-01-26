import React from "react";

const COLOR_PALETTES = [
    { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-200" },
    { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-200" },
    { bg: "bg-sky-100", text: "text-sky-800", border: "border-sky-200" },
    { bg: "bg-violet-100", text: "text-violet-800", border: "border-violet-200" },
    { bg: "bg-rose-100", text: "text-rose-800", border: "border-rose-200" },
    { bg: "bg-lime-100", text: "text-lime-800", border: "border-lime-200" },
    { bg: "bg-cyan-100", text: "text-cyan-800", border: "border-cyan-200" },
    { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-200" },
];

const hashString = (value) => {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
        hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
    }
    return hash;
};

const normalizeSkillName = (skill) => {
    if (!skill) return "";
    if (typeof skill === "string") return skill.trim();
    return (skill.name ?? skill.Name ?? "").trim();
};

const normalizeSkills = ({ skills, fallback }) => {
    const normalized = Array.isArray(skills)
        ? skills.map(normalizeSkillName).filter(Boolean)
        : [];

    if (normalized.length > 0) return normalized;
    if (typeof fallback !== "string") return [];

    return fallback
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
};

const SkillPills = ({ skills, fallback, className = "" }) => {
    const normalizedSkills = normalizeSkills({ skills, fallback });

    if (normalizedSkills.length === 0) return null;

    return (
        <div className={`flex flex-wrap gap-2 ${className}`.trim()}>
            {normalizedSkills.map((skill) => {
                const palette = COLOR_PALETTES[hashString(skill) % COLOR_PALETTES.length];
                return (
                    <span
                        key={skill}
                        className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${palette.bg} ${palette.text} ${palette.border}`}
                    >
                        {skill}
                    </span>
                );
            })}
        </div>
    );
};

export default SkillPills;
