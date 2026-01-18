import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { API_ENDPOINTS } from '@/config/apiConfig';
import SkillMultiSelect from '@/components/SkillMultiSelect';

const CreateProfileForm = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    location: '',
    experience: '',
    education: '',
    skillIds: [],
    summary: ''
  });
  const { toast } = useToast();
  const [skills, setSkills] = useState([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      setIsLoadingSkills(true);
      try {
        const response = await fetch(API_ENDPOINTS.getSkills, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ page: 1, pageSize: 99, sortBy: 'name' })
        });
        const result = await response.json();
        if (result.isSuccess) {
          setSkills(result.data || []);
        }
      } catch (error) {
        setSkills([]);
      } finally {
        setIsLoadingSkills(false);
      }
    };
    fetchSkills();
  }, []);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    
    if (!profileData.name || !profileData.email || !profileData.position) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const selectedSkillNames = skills
      .filter((skill) => profileData.skillIds.includes(skill.id))
      .map((skill) => skill.name);
    const profiles = JSON.parse(localStorage.getItem('candidateProfiles') || '[]');
    const newProfile = {
      ...profileData,
      skills: selectedSkillNames.join(', '),
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    profiles.push(newProfile);
    localStorage.setItem('candidateProfiles', JSON.stringify(profiles));

    toast({
      title: "Success!",
      description: "Your profile has been created successfully!",
    });

    setProfileData({
      name: '',
      email: '',
      phone: '',
      position: '',
      location: '',
      experience: '',
      education: '',
      skillIds: [],
      summary: ''
    });
  };

  return (
    <section className="section-padding">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Create Your Profile</h2>
            <p className="text-lg text-gray-600">
              Build a comprehensive profile to showcase your professional background
            </p>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="custom-input"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="custom-input"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="custom-input"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Position *
                </label>
                <input
                  type="text"
                  value={profileData.position}
                  onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                  className="custom-input"
                  placeholder="e.g., Senior HR Specialist"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  className="custom-input"
                  placeholder="City, State"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience
                </label>
                <select
                  value={profileData.experience}
                  onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                  className="custom-select"
                >
                  <option value="">Select experience level</option>
                  <option value="0-1">0-1 years</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Education
              </label>
              <input
                type="text"
                value={profileData.education}
                onChange={(e) => setProfileData({ ...profileData, education: e.target.value })}
                className="custom-input"
                placeholder="e.g., Bachelor's in Human Resources"
              />
            </div>

            <SkillMultiSelect
              label="Skills"
              skills={skills}
              selectedIds={profileData.skillIds}
              onChange={(skillIds) => setProfileData((prev) => ({ ...prev, skillIds }))}
              isLoading={isLoadingSkills}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Summary
              </label>
              <textarea
                value={profileData.summary}
                onChange={(e) => setProfileData({ ...profileData, summary: e.target.value })}
                rows={4}
                className="custom-input"
                placeholder="Brief summary of your professional background and career objectives..."
              />
            </div>

            <Button type="submit" size="lg" className="w-full corporate-gradient text-white">
              Create Profile
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default CreateProfileForm;
