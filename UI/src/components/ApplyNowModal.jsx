import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoader } from '@/contexts/LoaderContext';
import { API_ENDPOINTS } from '@/config/apiConfig';

const STEPS = {
  DETAILS: 1,
  VERIFY_EMAIL: 2,
  UPLOAD_DOCS: 3,
  CONFIRM: 4,
};

const ApplyNowModal = ({ isOpen, onClose, jobId }) => {
  const { toast } = useToast();
  const { showLoader, hideLoader } = useLoader();

  const [step, setStep] = useState(STEPS.DETAILS);
  const [formData, setFormData] = useState({
    applicantName: '',
    applicantEmail: '',
    applicantPhoneNumber: '',
    verificationCode: '',
  });
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [errors, setErrors] = useState({});
  const [fileUrls, setFileUrls] = useState({ resumeUrl: null, coverLetterUrl: null });

  useEffect(() => {
    // Reset state when modal is opened or closed
    if (isOpen) {
        setStep(STEPS.DETAILS);
        setFormData({ applicantName: '', applicantEmail: '', applicantPhoneNumber: '', verificationCode: '' });
        setResume(null);
        setCoverLetter(null);
        setErrors({});
        setFileUrls({ resumeUrl: null, coverLetterUrl: null });
    }
  }, [isOpen]);

  const handleApiCall = async (endpoint, options, errorMessage) => {
    showLoader();
    try {
      const response = await fetch(endpoint, options);
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

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.applicantName) newErrors.applicantName = "Name is required.";
    if (!/\S+@\S+\.\S+/.test(formData.applicantEmail)) newErrors.applicantEmail = "Valid email is required.";
    if (!/^\d{10}$/.test(formData.applicantPhoneNumber)) newErrors.applicantPhoneNumber = "Valid 10-digit phone number is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep1 = async () => {
    if (!validateStep1()) return;
    const payload = { applicantEmail: formData.applicantEmail, applicantPhoneNumber: `+91${formData.applicantPhoneNumber}`, jobPostId: parseInt(jobId, 10) };
    const result = await handleApiCall(API_ENDPOINTS.checkApplicationExists, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }, 'You have already applied for this job.');
    if (result && result.data === false) {
      setStep(STEPS.VERIFY_EMAIL);
    } else if (result && result.data === true) {
      toast({ title: 'Already applied', description: 'You have already applied for this job.', variant: 'destructive' });
      onClose?.();
    }
  };

  const handleSendVerificationCode = async () => {
    const result = await handleApiCall(API_ENDPOINTS.sendVerificationCode(formData.applicantEmail), { method: 'GET' });
    if (result) {
      toast({ title: 'Code Sent', description: 'A verification code has been sent to your email.' });
    }
  };

  const handleStep2 = async () => {
    if (!formData.verificationCode) {
        setErrors({ verificationCode: "Verification code is required."});
        return;
    }
    const payload = { email: formData.applicantEmail, verificationCode: formData.verificationCode };
    const result = await handleApiCall(API_ENDPOINTS.verifyEmailCode, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }, 'Incorrect verification code.');
    if (result && result.data === true) {
      setStep(STEPS.UPLOAD_DOCS);
    }
  };
  
  const validateStep3 = () => {
      const newErrors = {};
      if (!resume) newErrors.resume = "Resume is required.";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const handleStep3 = async () => {
    if (!validateStep3()) return;
    
    // Upload Resume
    const resumeUploadResult = await handleApiCall(API_ENDPOINTS.getUploadUrl(resume.name), { method: 'GET' });
    if (!resumeUploadResult) return;
    const resumeUploaded = await handleApiCall(resumeUploadResult.data.uploadUrl, { method: 'PUT', body: resume, headers: { 'Content-Type': resume.type }, isCloudflareUpload: true });
    if (!resumeUploaded) return;

    let coverLetterFinalUrl = null;
    // Upload Cover Letter
    if (coverLetter) {
        const clUploadResult = await handleApiCall(API_ENDPOINTS.getUploadUrl(coverLetter.name), { method: 'GET' });
        if (!clUploadResult) return;
        const clUploaded = await handleApiCall(clUploadResult.data.uploadUrl, { method: 'PUT', body: coverLetter, headers: { 'Content-Type': coverLetter.type }, isCloudflareUpload: true });
        if (!clUploaded) return;
        coverLetterFinalUrl = clUploadResult.data.fileUrl;
    }
    setFileUrls({ resumeUrl: resumeUploadResult.data.fileUrl, coverLetterUrl: coverLetterFinalUrl });
    setStep(STEPS.CONFIRM);
  };
  
  const handleFinalSubmit = async () => {
      const payload = {
          jobPostId: parseInt(jobId, 10),
          applicantName: formData.applicantName,
          applicantEmail: formData.applicantEmail,
          applicantPhoneNumber: `+91${formData.applicantPhoneNumber}`,
          resumeUrl: fileUrls.resumeUrl,
          coverLetterUrl: fileUrls.coverLetterUrl,
      };
      const result = await handleApiCall(API_ENDPOINTS.createApplication, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if(result) {
          toast({ title: 'Success!', description: 'Your application has been submitted successfully.'});
          onClose();
      }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'resume') setResume(files[0]);
    if (name === 'coverLetter') setCoverLetter(files[0]);
  };
  
  const renderStep = () => {
    switch (step) {
      case STEPS.DETAILS:
        return <Step1 formData={formData} errors={errors} onChange={handleChange} onNext={handleStep1} />;
      case STEPS.VERIFY_EMAIL:
        return <Step2 formData={formData} errors={errors} onChange={handleChange} onSendCode={handleSendVerificationCode} onVerify={handleStep2} />;
      case STEPS.UPLOAD_DOCS:
        return <Step3 errors={errors} onFileChange={handleFileChange} onNext={handleStep3} resume={resume} coverLetter={coverLetter}/>;
      case STEPS.CONFIRM:
        return <Step4 formData={formData} fileUrls={fileUrls} onSubmit={handleFinalSubmit} onBack={() => setStep(STEPS.UPLOAD_DOCS)} />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

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

const Step1 = ({ formData, errors, onChange, onNext }) => (
    <div className="space-y-4">
        <InputField label="Full Name *" name="applicantName" value={formData.applicantName} onChange={onChange} error={errors.applicantName} />
        <InputField label="Email Address *" name="applicantEmail" type="email" value={formData.applicantEmail} onChange={onChange} error={errors.applicantEmail} />
        <div>
            <Label htmlFor="applicantPhoneNumber" className="font-medium text-gray-700">Phone Number *</Label>
            <div className="flex items-center mt-1">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm h-10">+91</span>
                <Input id="applicantPhoneNumber" name="applicantPhoneNumber" type="tel" value={formData.applicantPhoneNumber} onChange={onChange} className="rounded-l-none" />
            </div>
            {errors.applicantPhoneNumber && <p className="text-sm text-red-500 mt-1">{errors.applicantPhoneNumber}</p>}
        </div>
        <Button onClick={onNext} className="w-full corporate-gradient text-white">Next</Button>
    </div>
);

const Step2 = ({ formData, errors, onChange, onSendCode, onVerify }) => (
    <div className="space-y-4">
        <p className="text-gray-600">We need to verify your email address: <span className='font-bold'>{formData.applicantEmail}</span></p>
        <Button onClick={onSendCode} className="w-full" variant="outline">Send Verification Code</Button>
        <InputField label="Verification Code *" name="verificationCode" value={formData.verificationCode} onChange={onChange} error={errors.verificationCode} />
        <Button onClick={onVerify} className="w-full corporate-gradient text-white">Verify</Button>
    </div>
);

const Step3 = ({ errors, onFileChange, onNext, resume, coverLetter }) => (
    <div className="space-y-4">
        <FileInputField label="Resume/CV *" name="resume" onChange={onFileChange} error={errors.resume} file={resume} />
        <FileInputField label="Cover Letter (Optional)" name="coverLetter" onChange={onFileChange} file={coverLetter} />
        <Button onClick={onNext} className="w-full corporate-gradient text-white">Upload & Continue</Button>
    </div>
);

const Step4 = ({ formData, fileUrls, onSubmit, onBack }) => (
    <div className="space-y-4">
        <h3 className="font-bold text-lg">Review Your Application</h3>
        <p><strong>Name:</strong> {formData.applicantName}</p>
        <p><strong>Email:</strong> {formData.applicantEmail}</p>
        <p><strong>Phone:</strong> +91{formData.applicantPhoneNumber}</p>
        <p><strong>Resume:</strong> {fileUrls.resumeUrl ? 'Uploaded' : 'Not Uploaded'}</p>
        {fileUrls.coverLetterUrl && <p><strong>Cover Letter:</strong> Uploaded</p>}
        <div className="flex justify-between space-x-2">
            <Button onClick={onBack} variant="outline" className="w-full">Back</Button>
            <Button onClick={onSubmit} className="w-full corporate-gradient text-white">Submit Application</Button>
        </div>
    </div>
);


const InputField = ({ label, name, error, ...props }) => (
  <div>
    <Label htmlFor={name} className="font-medium text-gray-700">{label}</Label>
    <Input id={name} name={name} {...props} className="mt-1" />
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);

const FileInputField = ({ label, name, onChange, error, file }) => (
  <div>
    <Label htmlFor={name} className="font-medium text-gray-700">{label}</Label>
    <Input id={name} name={name} type="file" onChange={onChange} className="mt-1" />
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    {file && <p className="text-sm text-gray-500 mt-1">Selected: {file.name}</p>}
  </div>
);

export default ApplyNowModal;
