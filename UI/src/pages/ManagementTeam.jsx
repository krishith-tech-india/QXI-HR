
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Mail, Phone, Linkedin, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useLoader } from '@/contexts/LoaderContext';
import TeamMemberModal from '@/components/TeamMemberModal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { API_ENDPOINTS, JOB_PAGE_SIZE } from '@/config/apiConfig';

const ManagementTeam = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { showLoader, hideLoader } = useLoader();

  const fetchTeamMembers = useCallback(async (page) => {
    setIsLoading(true);
    showLoader();
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.getUsers, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          page: page,
          pageSize: JOB_PAGE_SIZE || 10
        })
      });
      const result = await response.json();
      if (result.isSuccess) {
        setTeamMembers(result.data);
        setTotalItems(result.total);
        setCurrentPage(page);
      } else {
        toast({ title: 'Error', description: 'Failed to fetch team members.', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Network Error', description: 'Could not connect to the server.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
      hideLoader();
    }
  }, [toast, showLoader, hideLoader]);

  useEffect(() => {
    const role = sessionStorage.getItem('role');
    const token = sessionStorage.getItem('token');
    if (token && role === 'Admin') {
      setIsAdmin(true);
      fetchTeamMembers(1);
    } else {
      setIsAdmin(false);
      fetchTeamMembers(1);
    }
  }, [fetchTeamMembers]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(totalItems / (JOB_PAGE_SIZE || 10))) {
        fetchTeamMembers(newPage);
    }
  };

  const processApiErrors = (errors) => {
    if (errors && typeof errors === 'object') {
      Object.values(errors).forEach(errorArray => {
        if(Array.isArray(errorArray)) {
          errorArray.forEach(msg => {
            toast({ title: 'Validation Error', description: msg, variant: 'destructive' });
          });
        }
      });
    } else {
       toast({ title: 'Error', description: 'An unknown error occurred.', variant: 'destructive' });
    }
  };

  const handleFormSubmit = async (memberData) => {
    showLoader();
    let profilePictureUrl = memberData.profilePictureUrl || '';

    try {
        if (memberData.profilePictureFile) {
            const getUrlResponse = await fetch(API_ENDPOINTS.getUploadUrl(memberData.profilePictureFile.name), {
                headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
            });
            const urlResult = await getUrlResponse.json();
            if (!urlResult.isSuccess) throw new Error("Failed to get upload URL.");
            
            await fetch(urlResult.data.uploadUrl, {
                method: 'PUT',
                body: memberData.profilePictureFile,
                headers: { 'Content-Type': memberData.profilePictureFile.type }
            });
            profilePictureUrl = urlResult.data.fileUrl;
        }
        
        const endpoint = editingMember ? API_ENDPOINTS.updateUser(editingMember.id) : API_ENDPOINTS.createUser;
        const method = editingMember ? 'PUT' : 'POST';

        const payload = { ...memberData, profilePictureUrl };
        delete payload.profilePictureFile;
        delete payload.confirmPassword;
        if(method === 'PUT' && !memberData.password) delete payload.password;
        if(method === 'POST') payload.isActive = true;


        const response = await fetch(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('token')}` },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (result.isSuccess) {
            toast({ title: 'Success', description: `Team member ${editingMember ? 'updated' : 'created'} successfully.` });
            setIsModalOpen(false);
            fetchTeamMembers(currentPage);
        } else {
            processApiErrors(result.errors || { "error": [result.message || "An error occurred"] });
        }
    } catch (error) {
        toast({ title: 'Submission Error', description: error.message, variant: 'destructive' });
    } finally {
        hideLoader();
    }
  };

  const handleDeleteMember = async (id) => {
    showLoader();
    try {
        const response = await fetch(API_ENDPOINTS.deleteUser(id), {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        });
        if(response.ok) {
           const result = await response.json();
            if (result.isSuccess) {
                toast({ title: 'Success', description: 'Team member deleted successfully.' });
                fetchTeamMembers(currentPage);
            } else {
                toast({ title: 'Error', description: result.message || 'Failed to delete member.', variant: 'destructive' });
            }
        } else {
             toast({ title: 'Error', description: 'Failed to delete member.', variant: 'destructive' });
        }
    } catch (error) {
        toast({ title: 'Network Error', description: 'Could not connect to the server.', variant: 'destructive' });
    } finally {
        hideLoader();
    }
  };
  
  const openAddModal = () => { setEditingMember(null); setIsModalOpen(true); };
  const openEditModal = (member) => { setEditingMember(member); setIsModalOpen(true); };
  const totalPages = Math.ceil(totalItems / (JOB_PAGE_SIZE || 10));

  return (
    <>
      <Helmet>
        <title>Management Team - QXI HR Pvt Ltd</title>
        <meta name="description" content="Meet our experienced management team at QXI HR Pvt Ltd." />
      </Helmet>
      
      <section className="relative py-20 corporate-gradient text-white">
        <div className="absolute inset-0 hero-pattern opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
             <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-shadow">Our Management Team</h1>
              <p className="text-xl md:text-2xl max-w-3xl opacity-90">Meet the experienced professionals driving our success</p>
            </motion.div>
            {isAdmin && (
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                <Button onClick={openAddModal} size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                  <Plus className="w-5 h-5 mr-2" />Add Team Member
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
             <div className="text-center py-16"><Loader2 className="mx-auto h-12 w-12 text-gray-400 animate-spin" /></div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Team Members Found</h3>
              {isAdmin && <Button onClick={openAddModal} size="lg" className="corporate-gradient text-white"><Plus className="w-5 h-5 mr-2" />Add First Team Member</Button>}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div key={member.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} className="bg-white rounded-xl shadow-lg overflow-hidden hover-lift flex flex-col">
                  <div className="relative">
                    <img src={member.profilePictureUrl || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face`} alt={member.firstName} className="w-full h-64 object-cover" />
                    {isAdmin && member.isPublic === false && (
                      <span className="absolute top-4 left-4 px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700">Hidden</span>
                    )}
                    {isAdmin && (
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <Button size="icon" variant="secondary" onClick={() => openEditModal(member)} className="w-8 h-8 bg-white/90 hover:bg-white"><Edit className="w-4 h-4" /></Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button size="icon" variant="destructive" className="w-8 h-8"><Trash2 className="w-4 h-4" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the team member.</AlertDialogDescription></AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteMember(member.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{member.firstName} {member.lastName}</h3>
                    <p className="text-blue-600 font-medium mb-4">{member.position}</p>
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed flex-grow" style={{ whiteSpace: 'pre-line' }}>{member.bio}</p>
                    <div className="space-y-2 mt-auto">
                      {member.email && <div className="flex items-center space-x-2 text-sm text-gray-600"><Mail className="w-4 h-4" /><span>{member.email}</span></div>}
                      {member.phoneNumber && <div className="flex items-center space-x-2 text-sm text-gray-600"><Phone className="w-4 h-4" /><span>{member.phoneNumber}</span></div>}
                      {member.linkedInProfileUrl && <a href={member.linkedInProfileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-sm text-blue-600 hover:underline"><Linkedin className="w-4 h-4" /><span>LinkedIn Profile</span></a>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
           {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center space-x-4">
              <Button variant="outline" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}><ChevronLeft className="w-4 h-4 mr-2" />Previous</Button>
              <span className="text-sm font-medium text-gray-700">Page {currentPage} of {totalPages}</span>
              <Button variant="outline" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next<ChevronRight className="w-4 h-4 ml-2" /></Button>
            </div>
           )}
        </div>
      </section>

      <TeamMemberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleFormSubmit} member={editingMember} />
    </>
  );
};

export default ManagementTeam;
