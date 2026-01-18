import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { API_ENDPOINTS } from '@/config/apiConfig';
import SkillMultiSelect from '@/components/SkillMultiSelect';

const JobModal = ({ isOpen, onClose, onSubmit, job }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    companyName: '',
    location: '',
    skils: '',
    salary: '',
    experience: '',
    skillIds: []
  });
  const [skills, setSkills] = useState([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (job) {
      const jobSkillIds = job.skillIds?.length
        ? job.skillIds
        : (job.skills || []).map((skill) => skill.id);
      setFormData({
        title: job.title || '',
        description: job.description || '',
        companyName: job.companyName || '',
        location: job.location || '',
        skils: job.skils || '',
        salary: job.salary || '',
        experience: job.experience || '',
        skillIds: jobSkillIds || []
      });
    } else {
      setFormData({
        title: '',
        description: '',
        companyName: '',
        location: '',
        skils: '',
        salary: '',
        experience: '',
        skillIds: []
      });
    }
  }, [job, isOpen]);

  const fetchSkills = useCallback(async () => {
    if (!isOpen) return;
    setIsLoadingSkills(true);
    try {
      const response = await fetch(API_ENDPOINTS.getSkills, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 1, pageSize: 500, sortBy: 'name' })
      });
      const result = await response.json();
      if (result.isSuccess) {
        setSkills(result.data || []);
      } else {
        toast({ title: 'Error', description: 'Failed to load skills.', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Network Error', description: 'Could not load skills.', variant: 'destructive' });
    } finally {
      setIsLoadingSkills(false);
    }
  }, [isOpen, toast]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (skillIds) => {
    setFormData(prev => ({ ...prev, skillIds }));
  };

  const handleCreateSkill = async (name) => {
    try {
      const response = await fetch(API_ENDPOINTS.createSkill, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const result = await response.json();
      if (result.isSuccess) {
        const created = result.data;
        setSkills((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
        setFormData((prev) => ({ ...prev, skillIds: [...prev.skillIds, created.id] }));
        return true;
      }
      toast({ title: 'Error', description: 'Failed to add skill.', variant: 'destructive' });
      return false;
    } catch (error) {
      toast({ title: 'Network Error', description: 'Could not add skill.', variant: 'destructive' });
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.companyName || !formData.description) {
      toast({ title: "Error", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{job ? 'Edit Job Post' : 'Add Job Post'}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-6 h-6" /></Button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Title *" name="title" value={formData.title} onChange={handleChange} required />
            <InputField label="Company Name *" name="companyName" value={formData.companyName} onChange={handleChange} required />
            <InputField label="Location" name="location" value={formData.location} onChange={handleChange} />
            <InputField label="Salary" name="salary" value={formData.salary} onChange={handleChange} />
            <InputField label="Experience" name="experience" value={formData.experience} onChange={handleChange} />
          </div>
          <SkillMultiSelect
            label="Skills"
            skills={skills}
            selectedIds={formData.skillIds}
            onChange={handleSkillChange}
            onCreateSkill={handleCreateSkill}
            isLoading={isLoadingSkills}
          />
          <div>
            <Label htmlFor="description" className="font-medium text-gray-700">Description *</Label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={5} className="mt-1 w-full flex min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm" required />
          </div>
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="corporate-gradient text-white">{job ? 'Update Post' : 'Add Post'}</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const InputField = ({ label, name, ...props }) => (
  <div>
    <Label htmlFor={name} className="font-medium text-gray-700">{label}</Label>
    <Input id={name} name={name} {...props} className="mt-1" />
  </div>
);

export default JobModal;
