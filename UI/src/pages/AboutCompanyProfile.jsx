import React from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import {
    Award,
    Briefcase,
    Target,
    Users,
    UserCheck,
} from "lucide-react";

const AboutCompanyProfile = () => {
    return (
        <>
            <Helmet>
                <title>Company Profile - QXI HR (OPC) PRIVATE LIMITED</title>
                <meta
                    name="description"
                    content="Review the QXI HR company profile and learn about our positioning, capabilities, and service approach."
                />
            </Helmet>

            <section className="relative py-20 corporate-gradient text-white">
                <div className="absolute inset-0 hero-pattern opacity-10"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-shadow">
                            Company Profile
                        </h1>
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
                            A snapshot of our recruitment practice, values, and
                            delivery strengths.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="section-padding">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Who We Are
                            </h2>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                QXI HR (OPC) PRIVATE LIMITED is a recruitment
                                and placement partner that supports office and
                                corporate hiring. We focus on understanding
                                role outcomes, team dynamics, and growth plans
                                before we search.
                            </p>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Our process blends research, screening, and
                                candidate engagement to deliver hires that
                                perform in the role and stay aligned with the
                                organization’s direction.
                            </p>
                            <div className="flex items-start gap-3 text-gray-600">
                                <Award className="w-6 h-6 text-blue-600 flex-shrink-0" />
                                <span className="text-base">
                                    Recognized for consistent service quality
                                    and professional delivery in recruitment.
                                </span>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <img
                                className="rounded-lg shadow-2xl w-full h-96 object-cover"
                                alt="A modern office space with a collaborative atmosphere"
                                src="https://images.unsplash.com/photo-1637622124152-33adfabcc923"
                            />
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 corporate-gradient rounded-full flex items-center justify-center">
                                <Target className="w-12 h-12 text-white" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="section-padding">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Service Focus
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            We cover the full hiring journey with focused
                            services that reduce risk and improve hiring speed.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="bg-white rounded-xl p-6 shadow-lg hover-lift"
                        >
                            <div className="w-12 h-12 corporate-gradient rounded-full flex items-center justify-center mb-4">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Placement Consulting
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Candidate-first placement support with a focus
                                on long-term fit and client satisfaction.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="bg-white rounded-xl p-6 shadow-lg hover-lift"
                        >
                            <div className="w-12 h-12 corporate-gradient rounded-full flex items-center justify-center mb-4">
                                <UserCheck className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Recruitment Process
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Structured sourcing, screening, and assessment
                                to deliver ready-to-join talent.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-white rounded-xl p-6 shadow-lg hover-lift"
                        >
                            <div className="w-12 h-12 corporate-gradient rounded-full flex items-center justify-center mb-4">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Business Staffing
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Scalable staffing solutions across functions,
                                levels, and industries.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="bg-white rounded-xl p-6 shadow-lg hover-lift"
                        >
                            <div className="w-12 h-12 corporate-gradient rounded-full flex items-center justify-center mb-4">
                                <Target className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Manpower Provider
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Reliable workforce delivery to strengthen
                                operational efficiency and growth.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AboutCompanyProfile;
