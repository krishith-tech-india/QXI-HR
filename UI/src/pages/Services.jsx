import React from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import {
    Users,
    Building,
    GraduationCap,
    CheckCircle,
    ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Services = () => {
    const services = [
        {
            title: "Manpower",
            icon: Users,
            description:
                "Reliable manpower solutions to help you scale teams quickly and maintain workforce continuity.",
            features: [
                "Skilled and unskilled manpower supply",
                "On-demand workforce deployment",
                "Compliance-ready documentation",
                "Shift and roster management support",
                "Industry-specific staffing",
                "Quality and performance monitoring",
            ],
            color: "from-green-500 to-emerald-600",
            path: "/services/manpower",
        },
        {
            title: "Placement Services",
            icon: Users,
            description:
                "Expert recruitment and placement services to help you find the right talent for your organization.",
            features: [
                "Executive search and recruitment",
                "Candidate screening and assessment",
                "Interview coordination",
                "Background verification",
                "Salary negotiation support",
                "Post-placement follow-up",
            ],
            color: "from-blue-500 to-cyan-600",
            path: "/services/placement-services",
        },
        {
            title: "Staffing Solutions",
            icon: Building,
            description:
                "Flexible staffing solutions tailored to meet your temporary, contract, and permanent staffing needs.",
            features: [
                "Temporary staffing",
                "Contract-to-hire solutions",
                "Project-based staffing",
                "Seasonal workforce management",
                "Skill-based matching",
                "Workforce planning and analytics",
            ],
            color: "from-purple-500 to-indigo-600",
            path: "/services/staffing-solutions",
        },
        {
            title: "Corporate Training",
            icon: GraduationCap,
            description:
                "Professional development and training programs designed to enhance your team's skills and productivity.",
            features: [
                "Leadership development programs",
                "Technical skills training",
                "Soft skills enhancement",
                "Compliance training",
                "Custom training modules",
                "Performance improvement workshops",
            ],
            color: "from-orange-500 to-red-600",
            path: "/services/corporate-training",
        },
        {
            title: "Corporate Recruitment Solutions",
            icon: Building,
            description:
                "End-to-end recruitment solutions for large-scale hiring and organizational growth.",
            features: [
                "Bulk recruitment drives",
                "Campus recruitment programs",
                "Employer branding support",
                "Recruitment process outsourcing",
                "Talent pipeline development",
                "Recruitment analytics and reporting",
            ],
            color: "from-teal-500 to-green-600",
            path: "/services/corporate-recruitment-solutions",
        },
    ];

    return (
        <>
            <Helmet>
                <title>Our Services - QXI HR (OPC) PRIVATE LIMITED</title>
                <meta
                    name="description"
                    content="Explore our comprehensive HR services including manpower solutions, placement services, staffing solutions, corporate training, and recruitment solutions."
                />
                <meta
                    property="og:title"
                    content="Our Services - QXI HR (OPC) PRIVATE LIMITED"
                />
                <meta
                    property="og:description"
                    content="Professional HR services tailored to your business needs including manpower, recruitment, staffing, and training solutions."
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
                            Our Professional Services
                        </h1>
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
                            Comprehensive HR solutions designed to drive your
                            business forward
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="section-padding">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-16">
                        {services.map((service, index) => {
                            const Icon = service.icon;
                            const isEven = index % 2 === 0;

                            return (
                                <motion.div
                                    key={service.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.8,
                                        delay: index * 0.1,
                                    }}
                                    className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                                        !isEven ? "lg:grid-flow-col-dense" : ""
                                    }`}
                                >
                                    {/* Content */}
                                    <div
                                        className={
                                            isEven
                                                ? "lg:pr-8"
                                                : "lg:pl-8 lg:col-start-2"
                                        }
                                    >
                                        <div
                                            className={`w-16 h-16 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center mb-6`}
                                        >
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                            {service.title}
                                        </h2>
                                        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                            {service.description}
                                        </p>
                                        <div className="space-y-3 mb-8">
                                            {service.features.map(
                                                (feature, featureIndex) => (
                                                    <div
                                                        key={featureIndex}
                                                        className="flex items-center space-x-3"
                                                    >
                                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                        <span className="text-gray-700">
                                                            {feature}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                        <Button
                                            asChild
                                            size="lg"
                                            className={`bg-gradient-to-r ${service.color} text-white hover:opacity-90`}
                                        >
                                            <Link to={service.path}>
                                                Learn More{" "}
                                                <ArrowRight className="ml-2 w-5 h-5" />
                                            </Link>
                                        </Button>
                                    </div>

                                    {/* Image */}
                                    <div
                                        className={
                                            isEven
                                                ? "lg:pl-8"
                                                : "lg:pr-8 lg:col-start-1"
                                        }
                                    >
                                        <div className="relative">
                                            <img
                                                className="rounded-xl shadow-2xl w-full h-80 object-cover"
                                                alt={`${service.title} professional services illustration`}
                                                src="https://images.unsplash.com/photo-1694388001616-1176f534d72f"
                                            />
                                            <div
                                                className={`absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center shadow-lg`}
                                            >
                                                <Icon className="w-10 h-10 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="section-padding bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose QXI HR (OPC) PRIVATE LIMITED?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Our commitment to excellence and client satisfaction
                            sets us apart in the HR consultancy industry.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Expert Team",
                                description:
                                    "Our experienced professionals bring deep industry knowledge and proven expertise.",
                                icon: "👥",
                            },
                            {
                                title: "Customized Solutions",
                                description:
                                    "Tailored HR solutions designed to meet your specific business requirements.",
                                icon: "🎯",
                            },
                            {
                                title: "Proven Results",
                                description:
                                    "Track record of successful implementations and satisfied clients across industries.",
                                icon: "📈",
                            },
                        ].map((benefit, index) => (
                            <motion.div
                                key={benefit.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                }}
                                className="bg-white rounded-xl p-8 shadow-lg hover-lift text-center"
                            >
                                <div className="text-4xl mb-4">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {benefit.description}
                                </p>
                            </motion.div>
                        ))}
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
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl max-w-3xl mx-auto mb-8 opacity-90">
                            Contact us today to discuss how our services can
                            help transform your HR operations and drive your
                            business success.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button
                                asChild
                                size="lg"
                                className="bg-white text-gray-900 hover:bg-gray-100"
                            >
                                <Link to="/contact">
                                    Contact Us Now{" "}
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="border-white text-white bg-transparent hover:bg-white hover:text-gray-900"
                            >
                                <Link to="/management-team">Meet Our Team</Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default Services;
