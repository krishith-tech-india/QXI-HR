import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FileText, Download, X, AlertCircle, Users } from 'lucide-react';

const DocumentPreviewModal = ({ fileUrl, title, isOpen, onClose }) => {
  if (!isOpen) return null;

  const isPdf = fileUrl.toLowerCase().endsWith('.pdf');

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = title;
    link.target = '_blank'; // Open in new tab to download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl w-[90vw] h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-bold text-gray-800 truncate">{title}</h3>
          <div className="flex items-center space-x-2">
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="w-6 h-6" /></Button>
          </div>
        </div>
        <div className="flex-grow p-4 overflow-auto">
          {isPdf ? (
            <iframe src={fileUrl} width="100%" height="100%" title={title} className="border-0" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <FileText className="w-24 h-24 text-gray-300 mb-4" />
              <p className="text-lg text-gray-600">Preview is not available for this file type.</p>
              <p className="text-sm text-gray-500 mb-6">Click download to view the file.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const JobApplicationsTable = ({ applications, title }) => {
  const [modalState, setModalState] = useState({ isOpen: false, fileUrl: '', title: '' });

  const openPreview = (fileUrl, docTitle) => {
    if (!fileUrl) return;
    setModalState({ isOpen: true, fileUrl, title: docTitle });
  };

  const closePreview = () => {
    setModalState({ isOpen: false, fileUrl: '', title: '' });
  };

  return (
    <>
      {title && <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center"><Users className="w-7 h-7 mr-3 text-blue-500"/>{title}</h2>}
      <div className="bg-white p-6 rounded-xl shadow-lg border overflow-x-auto">
        {applications.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Resume</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.applicantName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.applicantEmail}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.applicantPhoneNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <Button variant="outline" size="icon" onClick={() => openPreview(app.resumeUrl, `Resume - ${app.applicantName}`)} disabled={!app.resumeUrl}>
                      <FileText className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center"><AlertCircle className="w-8 h-8 text-gray-400" /></div>
            <p className="text-lg text-gray-600">No applications received yet.</p>
          </div>
        )}
      </div>
      <DocumentPreviewModal {...modalState} onClose={closePreview} />
    </>
  );
};

export default JobApplicationsTable;
