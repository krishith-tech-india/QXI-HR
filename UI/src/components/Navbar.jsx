
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Users, Briefcase, Image, Search, Phone, LogIn, LogOut, Info, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');
    setIsAuthenticated(!!token);
    setUserRole(role);
  }, [location]);

  const handleLogout = () => {
    sessionStorage.clear();
    setIsAuthenticated(false);
    setUserRole(null);
    navigate('/');
    window.location.reload(); 
  };
  
  const navItems = [
    { name: 'Home', path: '/', icon: null, auth: 'any' },
    { name: 'About Us', path: '/about-us', icon: Info, auth: 'any' },
    { name: 'Services', path: '/services', icon: Briefcase, auth: 'any' },
    { name: 'Management Team', path: '/management-team', icon: Users, auth: 'any' },
    { name: 'Clients', path: '/clients', icon: null, auth: 'any' },
    { name: 'Gallery', path: '/gallery', icon: Image, auth: 'any' },
    { name: 'Job Seekers', path: '/job-seekers', icon: Search, auth: 'any' },
    { name: 'All Applications', path: '/job-applications', icon: ClipboardList, auth: 'adminOrStaff' },
    { name: 'Contact', path: '/contact', icon: Phone, auth: 'any' },
    { name: 'Login', path: '/login', icon: LogIn, auth: 'unauthenticated' },
  ];

  const isActive = (path) => location.pathname === path;

  const shouldShowItem = (item) => {
    if (item.auth === 'any') return true;
    if (item.auth === 'unauthenticated' && !isAuthenticated) return true;
    if (item.auth === 'authenticated' && isAuthenticated) return true;
    if (item.auth === 'adminOrStaff' && isAuthenticated && (userRole === 'Admin' || userRole === 'Staff')) return true;
    return false;
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="https://horizons-cdn.hostinger.com/5cb4fb45-28e8-425f-a60f-5b55ecac0e64/logo-edited-NLexn.jpg" alt="QXI HR (OPC) PRIVATE LIMITED Logo" className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              if (!shouldShowItem(item)) return null;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${
                    isActive(item.path)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{item.name}</span>
                </Link>
              );
            })}
             {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 text-gray-700 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
              {navItems.map((item) => {
                if (!shouldShowItem(item)) return null;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center space-x-2 ${
                      isActive(item.path)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                    }`}
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              {isAuthenticated && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center space-x-2 text-gray-700 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
