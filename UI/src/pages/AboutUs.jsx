import React from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    Users,
    Target,
    Eye,
    Award,
    Search,
    FileText,
    UserCheck,
    CheckSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const AboutUs = () => {
    const recruitmentSteps = [
        {
            icon: Search,
            title: "Requirement Analysis",
            description:
                "We start by understanding your specific needs, company culture, and the role's requirements in detail.",
        },
        {
            icon: FileText,
            title: "Sourcing & Screening",
            description:
                "Our team uses advanced sourcing techniques to find potential candidates, followed by a rigorous screening process.",
        },
        {
            icon: UserCheck,
            title: "Interview & Assessment",
            description:
                "Shortlisted candidates undergo comprehensive interviews and skill assessments to ensure the best fit.",
        },
        {
            icon: CheckSquare,
            title: "Final Selection & Onboarding",
            description:
                "We assist with the final selection, offer negotiation, and ensure a smooth onboarding process for the new hire.",
        },
    ];

    return (
        <>
            <Helmet>
                <title>About Us - QXI HR (OPC) PRIVATE LIMITED</title>
                <meta
                    name="description"
                    content="Learn about QXI HR (OPC) PRIVATE LIMITED, our mission, vision, and our proven recruitment process. We are dedicated to providing top-tier HR solutions."
                />
                <meta
                    property="og:title"
                    content="About Us - QXI HR (OPC) PRIVATE LIMITED"
                />
                <meta
                    property="og:description"
                    content="Discover the story behind QXI HR, our values, and our commitment to excellence in human resource consultancy."
                />
            </Helmet>

            {/* Hero Section */}
            <section className="relative py-20 corporate-gradient text-white">
                <div className="absolute inset-0 hero-pattern opacity-10"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-shadow">
                            About QXI HR (OPC) PRIVATE LIMITED
                        </h1>
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
                            Your trusted partner in building exceptional teams
                            and driving organizational success.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Company Profile Section */}
            <section className="section-padding">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Our Corporate Profile
                            </h2>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                QXI HR (OPC) PRIVATE LIMITED is a premier HR
                                consultancy firm dedicated to providing
                                comprehensive human resource solutions. With
                                over 15 years of industry experience, we have
                                established ourselves as a reliable partner for
                                businesses seeking excellence in talent
                                acquisition, payroll management, staffing, and
                                corporate training.
                            </p>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Our team of seasoned professionals is committed
                                to understanding the unique challenges of each
                                client, delivering tailored strategies that
                                foster growth, efficiency, and a positive work
                                environment. We pride ourselves on our
                                integrity, professionalism, and the tangible
                                results we bring to our partners.
                            </p>
                            <Button
                                asChild
                                size="lg"
                                className="corporate-gradient text-white"
                            >
                                <Link to="/management-team">
                                    Meet Our Expert Team{" "}
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                            </Button>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <img
                                class="rounded-lg shadow-2xl w-full h-96 object-cover"
                                alt="A modern office space with a collaborative atmosphere"
                                src="https://images.unsplash.com/photo-1637622124152-33adfabcc923"
                            />
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 corporate-gradient rounded-full flex items-center justify-center">
                                <Award className="w-12 h-12 text-white" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="section-padding bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Our Guiding Principles
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Our Mission and Vision are the cornerstones of our
                            commitment to excellence and client success.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="bg-white rounded-xl p-8 shadow-lg hover-lift"
                        >
                            <div className="w-16 h-16 corporate-gradient rounded-full flex items-center justify-center mb-6">
                                <Target className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Our Mission
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                To provide exceptional HR consultancy services
                                that empower organizations to achieve their
                                business objectives through strategic human
                                resource management, innovative solutions, and
                                sustainable growth practices.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-white rounded-xl p-8 shadow-lg hover-lift"
                        >
                            <div className="w-16 h-16 corporate-gradient rounded-full flex items-center justify-center mb-6">
                                <Eye className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Our Vision
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                To be the most trusted and preferred HR
                                consultancy firm, recognized for our commitment
                                to excellence, innovation, and creating lasting
                                partnerships that drive organizational success
                                and employee satisfaction.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Recruitment Process Section */}
            <section className="section-padding">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Our Recruitment Process
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            A streamlined and effective process designed to find
                            the perfect talent for your organization.
                        </p>
                    </div>
                    <div className="relative">
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {recruitmentSteps.map((step, index) => {
                                const Icon = step.icon;
                                return (
                                    <motion.div
                                        key={step.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.6,
                                            delay: index * 0.15,
                                        }}
                                        className="bg-white rounded-xl p-6 shadow-lg hover-lift text-center relative"
                                    >
                                        <div className="w-20 h-20 mx-auto mb-6 corporate-gradient rounded-full flex items-center justify-center">
                                            <Icon className="w-10 h-10 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {step.description}
                                        </p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding corporate-gradient text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-shadow">
                            Partner with Us for Your HR Needs
                        </h2>
                        <p className="text-xl max-w-3xl mx-auto mb-8 opacity-90">
                            Let's work together to build a stronger, more
                            efficient, and more successful organization.
                        </p>
                        <Button
                            asChild
                            size="lg"
                            className="bg-white text-gray-900 hover:bg-gray-100"
                        >
                            <Link to="/contact">
                                Contact Us Today{" "}
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default AboutUs;
