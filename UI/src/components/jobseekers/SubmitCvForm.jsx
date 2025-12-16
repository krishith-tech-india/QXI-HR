import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const SubmitCvForm = () => {
  const [cvData, setCvData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    skills: '',
    resume: null
  });
  const { toast } = useToast();

  const handleCvSubmit = (e) => {
    e.preventDefault();
    
    if (!cvData.name || !cvData.email || !cvData.position) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const submissions = JSON.parse(localStorage.getItem('cvSubmissions') || '[]');
    const newSubmission = {
      ...cvData,
      id: Date.now(),
      submittedAt: new Date().toISOString()
    };
    submissions.push(newSubmission);
    localStorage.setItem('cvSubmissions', JSON.stringify(submissions));

    toast({
      title: "Success!",
      description: "Your CV has been submitted successfully. We'll contact you soon!",
    });

    setCvData({
      name: '',
      email: '',
      phone: '',
      position: '',
      experience: '',
      skills: '',
      resume: null
    });
  };

  const handleFileUpload = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      description: "File upload functionality will be available soon."
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Submit Your CV</h2>
            <p className="text-lg text-gray-600">
              Upload your resume and let us match you with the perfect opportunity
            </p>
          </div>

          <form onSubmit={handleCvSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={cvData.name}
                  onChange={(e) => setCvData({ ...cvData, name: e.target.value })}
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
                  value={cvData.email}
                  onChange={(e) => setCvData({ ...cvData, email: e.target.value })}
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
                  value={cvData.phone}
                  onChange={(e) => setCvData({ ...cvData, phone: e.target.value })}
                  className="custom-input"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desired Position *
                </label>
                <input
                  type="text"
                  value={cvData.position}
                  onChange={(e) => setCvData({ ...cvData, position: e.target.value })}
                  className="custom-input"
                  placeholder="e.g., HR Manager"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <select
                value={cvData.experience}
                onChange={(e) => setCvData({ ...cvData, experience: e.target.value })}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Skills
              </label>
              <textarea
                value={cvData.skills}
                onChange={(e) => setCvData({ ...cvData, skills: e.target.value })}
                rows={3}
                className="custom-input"
                placeholder="List your key skills and competencies..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Resume
              </label>
              <Button
                type="button"
                variant="outline"
                onClick={handleFileUpload}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>

            <Button type="submit" size="lg" className="w-full corporate-gradient text-white">
              Submit CV
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default SubmitCvForm;