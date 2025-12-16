
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { API_ENDPOINTS, JOB_PAGE_SIZE } from '@/config/apiConfig';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';

const getInitialFormData = (member) => ({
  email: member?.email || '',
  password: '',
  confirmPassword: '',
  firstName: member?.firstName || '',
  lastName: member?.lastName || '',
  bio: member?.bio || '',
  linkedInProfileUrl: member?.linkedInProfileUrl || '',
  phoneNumber: member?.phoneNumber?.replace('+91', '') || '',
  position: member?.position || '',
  profilePictureUrl: member?.profilePictureUrl || '',
  profilePictureFile: null,
  roleIds: member?.roles?.map(r => r.id) || []
});

const TeamMemberModal = ({ isOpen, onClose, onSubmit, member }) => {
  const [formData, setFormData] = useState(getInitialFormData(member));
  const [roles, setRoles] = useState([]);
  const [rolesPage, setRolesPage] = useState(1);
  const [hasMoreRoles, setHasMoreRoles] = useState(true);
  const [isPasswordUnlocked, setIsPasswordUnlocked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  const { toast } = useToast();

  const resetForm = useCallback(() => {
    setFormData(getInitialFormData(member));
    setIsPasswordUnlocked(!member);
    setShowPassword(false);
    setOtp('');
    setIsOtpModalOpen(false);
  }, [member]);

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [member, isOpen, resetForm]);

  const fetchRoles = useCallback(async (page) => {
    try {
      const response = await fetch(API_ENDPOINTS.getRoles, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify({ page, pageSize: JOB_PAGE_SIZE || 10 })
      });
      const result = await response.json();
      if (result.isSuccess) {
        setRoles(prev => page === 1 ? result.data : [...prev, ...result.data]);
        setHasMoreRoles(result.data.length > 0 && (page * (JOB_PAGE_SIZE || 10) < result.total));
        setRolesPage(page);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch roles.', variant: 'destructive' });
    }
  }, [toast]);
  
  useEffect(() => {
    if(isOpen) {
      fetchRoles(1);
    } else {
      setRoles([]);
      setRolesPage(1);
      setHasMoreRoles(true);
    }
  }, [isOpen, fetchRoles]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePictureFile: file, profilePictureUrl: URL.createObjectURL(file) }));
    }
  };
  
  const handleUnlockPassword = async () => {
    if (!formData.email) {
      toast({ title: 'Validation Error', description: 'Email is required to send verification code.', variant: 'destructive' });
      return;
    }
    try {
      const response = await fetch(API_ENDPOINTS.sendVerificationCode(formData.email), {
         headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
      });
      const result = await response.json();
      if(result.isSuccess) {
        toast({ title: 'Success', description: 'Verification code sent to email. Please check your inbox.', duration: 5000 });
        setIsOtpModalOpen(true);
      } else {
        toast({ title: 'Error', description: result.message || 'Failed to send verification code.', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: error.message || 'Failed to send verification code.', variant: 'destructive' });
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast({ title: 'Validation Error', description: 'Please enter the verification code.', variant: 'destructive' });
      return;
    }
    try {
       const response = await fetch(API_ENDPOINTS.verifyEmailCode, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify({ email: formData.email, verificationCode: otp })
      });
      const result = await response.json();
      if(result.data) {
        toast({ title: 'Success', description: 'Password field unlocked! You can now set a new password.', duration: 5000 });
        setIsPasswordUnlocked(true);
        setIsOtpModalOpen(false);
        setOtp('');
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      } else {
        toast({ title: 'Error', description: 'Incorrect verification code. Please try again.', variant: 'destructive' });
      }
    } catch (error) {
       toast({ title: 'Error', description: error.message || 'Failed to verify OTP.', variant: 'destructive' });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const phoneRegex = /^\d{10}$/;

    if (!formData.email || !formData.firstName || !formData.phoneNumber || !Array.isArray(formData.roleIds) || formData.roleIds.length === 0) {
      toast({ title: "Validation Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({ title: "Validation Error", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }

    if (!phoneRegex.test(formData.phoneNumber)) {
        toast({ title: "Validation Error", description: "Please enter exactly 10 digits for the phone number.", variant: "destructive" });
        return;
    }

    if (isPasswordUnlocked) {
      if (!formData.password) {
        toast({ title: "Validation Error", description: "Password cannot be empty when unlocked.", variant: "destructive" });
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast({ title: "Validation Error", description: "Passwords do not match.", variant: "destructive" });
        return;
      }
    } else if (!member && !formData.password) {
        toast({ title: "Validation Error", description: "Password is required for new team members.", variant: "destructive" });
        return;
    }

    const dataToSubmit = { ...formData, phoneNumber: `+91${formData.phoneNumber}` };
    if (!isPasswordUnlocked && member) {
      delete dataToSubmit.password;
      delete dataToSubmit.confirmPassword;
    }
    
    onSubmit(dataToSubmit);
  };

  const isRoleInList = formData.roleIds && formData.roleIds.length > 0 && roles.some(r => r.id === formData.roleIds[0]);

  if (!isOpen) return null;

  return (
    <>
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{member ? 'Edit Team Member' : 'Add Team Member'}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-6 h-6" /></Button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div className="flex items-center space-x-6">
            <div className="shrink-0">
              <img className="h-24 w-24 object-cover rounded-full" src={formData.profilePictureUrl || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face`} alt="Profile" />
            </div>
            <label className="block w-full">
              <span className="sr-only">Choose profile photo</span>
              <input type="file" onChange={handleImageChange} accept="image/*" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="First Name *" name="firstName" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
            <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
            <InputField label="Email *" name="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required readOnly={!!member} />
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">+91</span>
                    <input type="tel" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} className="custom-input rounded-l-none" required />
                </div>
            </div>
            <InputField label="Position" name="position" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} />
            <InputField label="LinkedIn Profile" name="linkedin" type="url" value={formData.linkedInProfileUrl} onChange={(e) => setFormData({ ...formData, linkedInProfileUrl: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={3} className="custom-input" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
              <select value={isRoleInList ? formData.roleIds[0] : ''} onChange={(e) => setFormData({...formData, roleIds: [parseInt(e.target.value, 10)]})} className="custom-input" required>
                <option value="" disabled>Select a role</option>
                {roles.map(role => <option key={role.id} value={role.id}>{role.roleName}</option>)}
              </select>
               {hasMoreRoles && <Button type="button" variant="link" size="sm" onClick={() => fetchRoles(rolesPage + 1)}>Load more</Button>}
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <InputField label="Password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} disabled={!isPasswordUnlocked} required={isPasswordUnlocked || !member} />
               <div className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-sm leading-5">
                    {member && !isPasswordUnlocked ? (
                         <button type="button" onClick={handleUnlockPassword}><Lock className="h-5 w-5 text-gray-400"/></button>
                    ) : (
                         <button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}</button>
                    )}
                </div>
            </div>
            {isPasswordUnlocked && <InputField label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required={isPasswordUnlocked} />}
          </div>
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" className="corporate-gradient text-white">{member ? 'Update Member' : 'Add Member'}</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Confirm Submission</AlertDialogTitle><AlertDialogDescription>Do you want to {member ? 'update' : 'create'} this team member?</AlertDialogDescription></AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSubmit}>{member ? 'Update' : 'Create'}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
      </motion.div>
    </div>
    
    {isOtpModalOpen && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">
           <h3 className="text-lg font-medium leading-6 text-gray-900">Enter Verification Code</h3>
           <div className="mt-2">
             <Input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="6-digit code"/>
           </div>
           <div className="mt-4 flex justify-end space-x-2">
             <Button variant="outline" onClick={() => setIsOtpModalOpen(false)}>Cancel</Button>
             <Button onClick={handleVerifyOtp}>Verify</Button>
           </div>
        </div>
       </div>
    )}
    </>
  );
};

const InputField = ({ label, ...props }) => (
  <div>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input {...props} className="custom-input" />
  </div>
);

export default TeamMemberModal;
