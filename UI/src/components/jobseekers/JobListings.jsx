import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Wallet, Code, Edit, Trash2, Briefcase, Clock, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, X, Building, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const JobCard = ({ job, index, userRole, onEdit, onDelete }) => {
  const canManage = userRole === 'Admin' || userRole === 'Staff';
  
  const handleAction = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  return (
    <Link to={`/job-seekers/${job.id}`} className="block h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: (index % 10) * 0.05 }}
        className="bg-white rounded-xl shadow-lg p-6 hover-lift group flex flex-col border h-full cursor-pointer"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
            <p className="text-md text-gray-700 font-semibold">{job.companyName}</p>
          </div>
          {canManage && (
            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button size="icon" variant="secondary" onClick={(e) => handleAction(e, () => onEdit(job))} className="w-8 h-8"><Edit className="w-4 h-4" /></Button>
              <Button size="icon" variant="destructive" onClick={(e) => handleAction(e, () => onDelete(job.id))} className="w-8 h-8"><Trash2 className="w-4 h-4" /></Button>
            </div>
          )}
        </div>

        <div className="space-y-3 text-sm text-gray-600 mb-4 flex-grow">
          {job.location && <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-blue-500" /> {job.location}</div>}
          {job.salary && <div className="flex items-center"><Wallet className="w-4 h-4 mr-2 text-green-500" /> {job.salary}</div>}
          {job.experience && <div className="flex items-center"><Briefcase className="w-4 h-4 mr-2 text-indigo-500" /> {job.experience}</div>}
          {job.skils && <div className="flex items-start"><Code className="w-4 h-4 mr-2 mt-0.5 text-purple-500" /> <div><span className="font-semibold">Skills:</span> {job.skils}</div></div>}
        </div>

        <div className="flex justify-end items-center pt-4 border-t">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1.5" />
            Posted recently
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

const FilterControls = ({ filters, sorting }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-xl mb-12 border">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="relative col-span-1 md:col-span-2 lg:col-span-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input placeholder="Search by any keyword..." value={filters.searchKeyword} onChange={(e) => filters.onSearchChange(e.target.value)} className="pl-10" />
        </div>
        <div className="relative">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input placeholder="Filter by Title..." value={filters.title} onChange={(e) => filters.onFilterChange({ title: e.target.value })} className="pl-10"/>
        </div>
        <div className="relative">
          <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input placeholder="Filter by Company..." value={filters.companyName} onChange={(e) => filters.onFilterChange({ companyName: e.target.value })} className="pl-10"/>
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input placeholder="Filter by Location..." value={filters.location} onChange={(e) => filters.onFilterChange({ location: e.target.value })} className="pl-10"/>
        </div>
        <div className="relative">
          <Code className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input placeholder="Filter by Skills..." value={filters.skils} onChange={(e) => filters.onFilterChange({ skils: e.target.value })} className="pl-10"/>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Sort By:</span>
          <Select value={sorting.sortBy} onValueChange={sorting.onSortChange}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Sort by" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="companyName">Company</SelectItem>
              <SelectItem value="location">Location</SelectItem>
              <SelectItem value="salary">Salary</SelectItem>
              <SelectItem value="experience">Experience</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => sorting.onDirectionChange(prev => !prev)}>
            {sorting.isDescending ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
          </Button>
        </div>
        <Button variant="ghost" onClick={() => {
            filters.onSearchChange('');
            filters.onFilterChange({ title: '', companyName: '', location: '', skils: '' });
        }}><X className="w-4 h-4 mr-2"/>Clear Filters</Button>
      </div>
    </div>
  );
}

const PaginationControls = ({ pagination }) => {
  const { currentPage, pageSize, totalItems, onPageChange } = pagination;
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-12">
      <p className="text-sm text-gray-600">Showing page {currentPage} of {totalPages} ({totalItems} results)</p>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}><ChevronLeft className="w-4 h-4 mr-2" />Previous</Button>
        <Button variant="outline" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages}>Next<ChevronRight className="w-4 h-4 ml-2" /></Button>
      </div>
    </div>
  );
}

const JobListings = ({ jobs, userRole, pagination, filters, sorting, onEdit, onDelete }) => {
  return (
    <section className="section-padding-bottom bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Current Job Openings</h2>
          <p className="text-lg text-gray-600">Explore exciting career opportunities</p>
        </div>
        <FilterControls filters={filters} sorting={sorting} />
        {jobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center"><Search className="w-12 h-12 text-gray-400" /></div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Jobs Found</h3>
            <p className="text-gray-600">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobs.map((job, index) => (
                <JobCard key={job.id} job={job} index={index} userRole={userRole} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </div>
            <PaginationControls pagination={pagination} />
          </>
        )}
      </div>
    </section>
  );
};

export default JobListings;