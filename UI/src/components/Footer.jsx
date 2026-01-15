import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
    Mail,
    Phone,
    MapPin,
} from "lucide-react";

const Footer = () => {
    const socialLinks = [
        {
            icon: Facebook,
            href: "https://www.facebook.com/people/QXI-HR-PVT-LTD/61579318417650/?rdid=BlNufkkov3lWjIqK&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1N3d5EP2Ps%2F%3Fref%3D1",
            label: "Facebook",
        },
        {
            icon: Linkedin,
            href: "https://www.linkedin.com/company/qxi-hr-opc-pvt-ltd/",
            label: "LinkedIn",
        },
    ];

    const quickLinks = [
        { name: "About Us", path: "/about-us" },
        { name: "Services", path: "/services" },
        { name: "Management Team", path: "/management-team" },
        { name: "Gallery", path: "/gallery" },
        { name: "Job Seekers", path: "/job-seekers" },
        { name: "Contact", path: "/contact" },
    ];

    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <img
                                src="https://qxi-applicant-docs.qxihr.com/e68b3f3d-80a0-4fd5-943d-f7c855b578cd_qxi_1.png"
                                alt="QXI HR (OPC) PRIVATE LIMITED Logo"
                                className="h-10 w-auto"
                            />
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Your trusted partner in HR solutions, providing
                            comprehensive services for recruitment, staffing,
                            payroll management, and corporate training.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <span className="text-lg font-semibold">
                            Quick Links
                        </span>
                        <div className="space-y-2">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="block text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <span className="text-lg font-semibold">
                            Contact Info
                        </span>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                <span className="text-gray-400 text-sm">
                                    Head Office -804, 8Th Floor A-Wing RK Iconic
                                    Ayodhiya Chowk, 150 Feet Ring Rd, Rajkot,
                                    Gujarat 360007 (India)
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                <span className="text-gray-400 text-sm">
                                    Phone: +91 7778880721
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                <span className="text-gray-400 text-sm">
                                    Telephone: 0281-2992804
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                <span className="text-gray-400 text-sm">
                                    qxihroffice@gmail.com
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="space-y-4">
                        <span className="text-lg font-semibold">Follow Us</span>
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <motion.a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank" // Opens in new tab
                                        rel="noopener noreferrer" // Security best practice
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
                                        aria-label={social.label}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </motion.a>
                                );
                            })}
                        </div>
                        <p className="text-gray-400 text-sm">
                            Stay connected with us for the latest updates and
                            opportunities.
                        </p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-center items-center">
                    <p className="text-gray-400 text-sm text-center">
                        © 2025 QXI HR (OPC) PRIVATE LIMITED. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
