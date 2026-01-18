import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Trash2 } from 'lucide-react';
import { API_ENDPOINTS } from '@/config/apiConfig';
import SkillMultiSelect from '@/components/SkillMultiSelect';

const SignupForm = () => {
  const { toast } = useToast();
  const [skills, setSkills] = useState([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    locationCity: '',
    locationState: '',
    locationCountry: '',
    education: [{ degree: '', institution: '', year: '' }],
    experience: [{ company: '', title: '', duration: '', responsibilities: '' }],
    skillIds: [],
    certifications: '',
    languages: '',
    portfolioUrl: '',
    expectedSalary: '',
    availability: '',
    otherInfo: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchSkills = async () => {
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
        }
      } catch (error) {
        setSkills([]);
      } finally {
        setIsLoadingSkills(false);
      }
    };
    fetchSkills();
  }, []);

  const handleDynamicChange = (index, event, section) => {
    const values = [...formData[section]];
    values[index][event.target.name] = event.target.value;
    setFormData(prev => ({ ...prev, [section]: values }));
  };

  const addDynamicField = (section) => {
    const emptyField = section === 'education' 
      ? { degree: '', institution: '', year: '' }
      : { company: '', title: '', duration: '', responsibilities: '' };
    setFormData(prev => ({ ...prev, [section]: [...prev[section], emptyField] }));
  };

  const removeDynamicField = (index, section) => {
    const values = [...formData[section]];
    if (values.length > 1) {
      values.splice(index, 1);
      setFormData(prev => ({ ...prev, [section]: values }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in Full Name and Email Address.",
        variant: "destructive"
      });
      return;
    }

    const signups = JSON.parse(localStorage.getItem('candidateSignups') || '[]');
    const selectedSkillNames = skills
      .filter((skill) => formData.skillIds.includes(skill.id))
      .map((skill) => skill.name);
    const newSignup = {
      ...formData,
      skills: selectedSkillNames.join(', '),
      id: Date.now(),
      submittedAt: new Date().toISOString()
    };
    signups.push(newSignup);
    localStorage.setItem('candidateSignups', JSON.stringify(signups));

    toast({
      title: "Success!",
      description: "Your profile has been submitted successfully!",
    });
    
    // Reset form
    setFormData({
      fullName: '', email: '', phone: '', dob: '', locationCity: '', locationState: '', locationCountry: '',
      education: [{ degree: '', institution: '', year: '' }],
      experience: [{ company: '', title: '', duration: '', responsibilities: '' }],
      skillIds: [], certifications: '', languages: '', portfolioUrl: '', expectedSalary: '', availability: '', otherInfo: ''
    });
  };

  return (
    <section className="section-padding bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Talent Pool</h2>
            <p className="text-lg text-gray-600">
              Create your profile to be considered for exciting opportunities.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Details */}
            <div className="space-y-6 border-b pb-8">
              <h3 className="text-xl font-semibold text-gray-800">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField name="fullName" label="Full Name *" value={formData.fullName} onChange={handleInputChange} required />
                <InputField name="email" label="Email Address *" type="email" value={formData.email} onChange={handleInputChange} required />
                <InputField name="phone" label="Phone Number" type="tel" value={formData.phone} onChange={handleInputChange} />
                <InputField name="dob" label="Date of Birth" type="date" value={formData.dob} onChange={handleInputChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Location</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input name="locationCity" placeholder="City" value={formData.locationCity} onChange={handleInputChange} className="custom-input" />
                  <input name="locationState" placeholder="State" value={formData.locationState} onChange={handleInputChange} className="custom-input" />
                  <input name="locationCountry" placeholder="Country" value={formData.locationCountry} onChange={handleInputChange} className="custom-input" />
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="space-y-6 border-b pb-8">
              <h3 className="text-xl font-semibold text-gray-800">Education Details</h3>
              {formData.education.map((edu, index) => (
                <div key={index} className="p-4 border rounded-md space-y-4 relative">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField name="degree" label="Degree" value={edu.degree} onChange={e => handleDynamicChange(index, e, 'education')} />
                    <InputField name="institution" label="Institution" value={edu.institution} onChange={e => handleDynamicChange(index, e, 'education')} />
                    <InputField name="year" label="Year of Passing" value={edu.year} onChange={e => handleDynamicChange(index, e, 'education')} />
                  </div>
                  {formData.education.length > 1 && (
                    <Button type="button" variant="destructive" size="icon" className="absolute -top-3 -right-3 w-7 h-7" onClick={() => removeDynamicField(index, 'education')}><Trash2 className="w-4 h-4" /></Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => addDynamicField('education')}><Plus className="w-4 h-4 mr-2" />Add Education</Button>
            </div>

            {/* Work Experience */}
            <div className="space-y-6 border-b pb-8">
              <h3 className="text-xl font-semibold text-gray-800">Work Experience</h3>
              {formData.experience.map((exp, index) => (
                <div key={index} className="p-4 border rounded-md space-y-4 relative">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField name="company" label="Company" value={exp.company} onChange={e => handleDynamicChange(index, e, 'experience')} />
                    <InputField name="title" label="Job Title" value={exp.title} onChange={e => handleDynamicChange(index, e, 'experience')} />
                    <InputField name="duration" label="Duration (e.g., 2 years)" value={exp.duration} onChange={e => handleDynamicChange(index, e, 'experience')} />
                  </div>
                  <TextAreaField name="responsibilities" label="Responsibilities" value={exp.responsibilities} onChange={e => handleDynamicChange(index, e, 'experience')} />
                  {formData.experience.length > 1 && (
                    <Button type="button" variant="destructive" size="icon" className="absolute -top-3 -right-3 w-7 h-7" onClick={() => removeDynamicField(index, 'experience')}><Trash2 className="w-4 h-4" /></Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => addDynamicField('experience')}><Plus className="w-4 h-4 mr-2" />Add Experience</Button>
            </div>

            {/* Skills & Professional Info */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">Skills & Professional Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextAreaField name="certifications" label="Certifications" value={formData.certifications} onChange={handleInputChange} />
                <InputField name="languages" label="Languages Known" value={formData.languages} onChange={handleInputChange} />
                <InputField name="portfolioUrl" label="LinkedIn / Portfolio URL" type="url" value={formData.portfolioUrl} onChange={handleInputChange} />
                <InputField name="expectedSalary" label="Expected Salary (e.g., ₹10 LPA)" value={formData.expectedSalary} onChange={handleInputChange} />
                <InputField name="availability" label="Availability / Notice Period" value={formData.availability} onChange={handleInputChange} />
              </div>
              <SkillMultiSelect
                label="Skills"
                skills={skills}
                selectedIds={formData.skillIds}
                onChange={(skillIds) => setFormData(prev => ({ ...prev, skillIds }))}
                isLoading={isLoadingSkills}
              />
              <TextAreaField name="otherInfo" label="Any Other Information" value={formData.otherInfo} onChange={handleInputChange} rows={4} />
            </div>

            <Button type="submit" size="lg" className="w-full corporate-gradient text-white">
              Submit Profile
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input {...props} className="custom-input" />
  </div>
);

const TextAreaField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <textarea {...props} rows={props.rows || 2} className="custom-input" />
  </div>
);

export default SignupForm;
