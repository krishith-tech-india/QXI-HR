import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SkillMultiSelect = ({
    label,
    skills = [],
    selectedIds = [],
    onChange,
    onCreateSkill,
    onSearch,
    isLoading,
}) => {
    const [search, setSearch] = useState("");
    const [newSkillName, setNewSkillName] = useState("");
    const [showOtherInput, setShowOtherInput] = useState(false);

    const normalizedSkills = useMemo(
        () =>
            skills.map((skill) => ({
                ...skill,
                __id: skill.id ?? skill.Id,
                __name: skill.name ?? skill.Name,
            })),
        [skills]
    );

    const filteredSkills = useMemo(() => {
        if (!search.trim()) return normalizedSkills;
        const lowered = search.trim().toLowerCase();
        return normalizedSkills.filter((skill) =>
            (skill.__name || "").toLowerCase().includes(lowered)
        );
    }, [normalizedSkills, search]);

    const selectedSkills = useMemo(() => {
        const selectedSet = new Set(selectedIds);
        return normalizedSkills.filter((skill) => selectedSet.has(skill.__id));
    }, [normalizedSkills, selectedIds]);

    const toggleSkill = (skillId) => {
        if (selectedIds.includes(skillId)) {
            onChange(selectedIds.filter((id) => id !== skillId));
            return;
        }
        onChange([...selectedIds, skillId]);
    };

    const handleAddSkill = async () => {
        const name = newSkillName.trim();
        if (!name || !onCreateSkill) return;
        const created = await onCreateSkill(name);
        if (created) {
            const createdId = created.id ?? created.Id;
            if (createdId && !selectedIds.includes(createdId)) {
                onChange([...selectedIds, createdId]);
            }
            setNewSkillName("");
            setShowOtherInput(false);
        }
    };

    useEffect(() => {
        if (!onSearch) return;
        const handler = setTimeout(() => {
            onSearch(search.trim());
        }, 300);
        return () => clearTimeout(handler);
    }, [search, onSearch]);

    return (
        <div className="space-y-3">
            <Label className="font-medium text-gray-700">{label}</Label>
            <Input
                placeholder="Search skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
                {selectedSkills.length === 0 ? (
                    <span className="text-sm text-gray-500">
                        No skills selected.
                    </span>
                ) : (
                    selectedSkills.map((skill) => (
                        <span
                            key={skill.__id}
                            className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full"
                        >
                            {skill.__name}
                        </span>
                    ))
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
                {isLoading ? (
                    <span className="text-sm text-gray-500">
                        Loading skills...
                    </span>
                ) : filteredSkills.length === 0 ? (
                    <span className="text-sm text-gray-500">
                        No skills found.
                    </span>
                ) : (
                    filteredSkills.map((skill) => (
                        <label
                            key={skill.__id}
                            className="flex items-center gap-2 text-sm text-gray-700"
                        >
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(skill.__id)}
                                onChange={() => toggleSkill(skill.__id)}
                            />
                            {skill.__name}
                        </label>
                    ))
                )}
                {onCreateSkill && (
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            checked={showOtherInput}
                            onChange={(e) => setShowOtherInput(e.target.checked)}
                        />
                        Other (add new skill)
                    </label>
                )}
            </div>
            {onCreateSkill && showOtherInput && (
                <div className="flex flex-col md:flex-row gap-2">
                    <Input
                        placeholder="Add a new skill"
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddSkill}
                        disabled={!newSkillName.trim()}
                    >
                        Add Skill
                    </Button>
                </div>
            )}
        </div>
    );
};

export default SkillMultiSelect;
