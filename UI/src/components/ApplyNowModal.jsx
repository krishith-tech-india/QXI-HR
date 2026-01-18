import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useLoader } from '@/contexts/LoaderContext';
import { API_ENDPOINTS } from '@/config/apiConfig';

const STEPS = {
  CONFIRM: 1,
};

const ApplyNowModal = ({ isOpen, onClose, jobId, onApplied }) => {
  const { toast } = useToast();
  const { showLoader, hideLoader } = useLoader();

  const [step, setStep] = useState(STEPS.CONFIRM);
  const [resumeUrl, setResumeUrl] = useState('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    // Reset state when modal is opened or closed
    if (isOpen) {
      setStep(STEPS.CONFIRM);
      setResumeUrl('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !token) return;
    const loadProfile = async () => {
      setIsLoadingProfile(true);
      try {
        const response = await fetch(API_ENDPOINTS.getMyApplicantProfile, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        if (result.isSuccess) {
          setResumeUrl(result.data?.resumeUrl || '');
        } else {
          setResumeUrl('');
        }
      } catch (error) {
        setResumeUrl('');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, [isOpen, token]);

  const handleApiCall = async (endpoint, options, errorMessage) => {
    showLoader();
    try {
      const response = await fetch(endpoint, {
        ...options,
        headers: {
          ...(options.headers || {}),
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (options.isCloudflareUpload) {
        if (response.ok) return true;
        toast({ title: 'Upload Error', description: 'Failed to upload file.', variant: 'destructive' });
        return false;
      }
      const result = await response.json();
      if (result.isSuccess) {
        return result;
      } else {
        const msg = result.ErrorMessage || (result.data === false && errorMessage) || 'An error occurred.';
        toast({ title: 'Error', description: msg, variant: 'destructive' });
        return false;
      }
    } catch (error) {
      toast({ title: 'Network Error', description: 'Could not connect to the server.', variant: 'destructive' });
      return false;
    } finally {
      hideLoader();
    }
  };

  const handleFinalSubmit = async () => {
      const payload = {
          jobPostId: parseInt(jobId, 10),
          resumeUrl: resumeUrl || null,
      };
      const result = await handleApiCall(API_ENDPOINTS.createApplication, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if(result) {
          toast({ title: 'Success!', description: 'Your application has been submitted successfully.'});
          if (onApplied) {
            onApplied();
          }
          onClose();
      }
  };
  
  const renderStep = () => {
    switch (step) {
      case STEPS.CONFIRM:
        return (
          <ConfirmStep
            resumeUrl={resumeUrl}
            isLoading={isLoadingProfile}
            onSubmit={handleFinalSubmit}
          />
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  if (!token) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Login Required</h2>
          <p className="text-gray-600">Please sign in or create an applicant account before applying.</p>
          <div className="flex gap-3">
            <Button className="w-full corporate-gradient text-white" onClick={() => window.location.assign('/login')}>
              Login
            </Button>
            <Button className="w-full" variant="outline" onClick={() => window.location.assign('/signup')}>
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Apply for Job</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-6 h-6" /></Button>
        </div>
        <div className="p-6">
            <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
                    {renderStep()}
                </motion.div>
            </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

const ConfirmStep = ({ resumeUrl, isLoading, onSubmit }) => (
    <div className="space-y-4">
        <h3 className="font-bold text-lg">Review Your Application</h3>
        <p>
          We will use the latest resume stored in your profile.
        </p>
        <p>
          <strong>Resume on file:</strong>{" "}
          {isLoading ? "Checking..." : resumeUrl ? "Available" : "Missing"}
        </p>
        <Button
          onClick={onSubmit}
          className="w-full corporate-gradient text-white"
          disabled={isLoading || !resumeUrl}
        >
          Submit Application
        </Button>
        {!isLoading && !resumeUrl && (
          <p className="text-sm text-red-500">
            Please upload your resume in your profile before applying.
          </p>
        )}
    </div>
);

export default ApplyNowModal;
