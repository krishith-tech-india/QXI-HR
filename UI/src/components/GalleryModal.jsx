
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const GalleryModal = ({ isOpen, onClose, onSubmit, item, categories }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    imageFile: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        category: item.categoryId || '',
        description: item.description || '',
        imageFile: null,
      });
      setPreviewImage(item.imageUrl);
    } else {
      setFormData({
        title: '',
        category: categories.length > 0 ? categories[0].id : '',
        description: '',
        imageFile: null,
      });
      setPreviewImage(null);
    }
  }, [item, isOpen, categories]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imageFile: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category) {
      toast({ title: "Validation Error", description: "Please fill in Title and Category.", variant: "destructive" });
      return;
    }
    
    // Only require image file for new items, not for edits
    if (!item && !formData.imageFile) {
      toast({ title: "Validation Error", description: "An image file is required for new items.", variant: "destructive" });
      return;
    }

    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{item ? 'Edit Gallery Item' : 'Add Gallery Item'}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-6 h-6" /></Button>
        </div>

        <form className="p-6 space-y-6 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="custom-input" placeholder="Enter item title" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="custom-input" required>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} className="custom-input" placeholder="Brief description of the item..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image File {item ? '(Optional)' : '*'}</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    {previewImage ? (
                        <img src={previewImage} alt="Preview" className="mx-auto h-32 w-auto rounded-md"/>
                    ) : (
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    )}
                    <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
            </div>
             {item && <p className="text-xs text-gray-500 mt-1">Leave blank to keep the existing image.</p>}
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
             <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" className="corporate-gradient text-white">{item ? 'Update Item' : 'Add Item'}</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Confirm Submission</AlertDialogTitle><AlertDialogDescription>Do you want to {item ? 'update' : 'create'} this gallery item?</AlertDialogDescription></AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSubmit}>{item ? 'Update' : 'Create'}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default GalleryModal;
