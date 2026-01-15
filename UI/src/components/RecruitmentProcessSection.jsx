import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
    Search,
    ClipboardList,
    Users,
    FileText,
    CheckSquare,
    UserCheck,
} from "lucide-react";

const recruitmentSteps = [
    {
        icon: Search,
        title: "Planning & Requirement Study",
        description:
            "We define KRAs, culture fit, location, and compensation to shape a clear hiring plan.",
    },
    {
        icon: ClipboardList,
        title: "Mapping Exercise",
        description:
            "We map target companies and competencies through focused industry research and role analysis.",
    },
    {
        icon: UserCheck,
        title: "Long List Generation",
        description:
            "We build a strong pipeline of qualified candidates from our network and outreach.",
    },
    {
        icon: CheckSquare,
        title: "Implementation",
        description:
            "We run interviews, shortlisting, client meetings, and reference checks to validate fit.",
    },
    {
        icon: FileText,
        title: "Negotiation & Offer",
        description:
            "We support offer discussions with market-aligned guidance for a fair package.",
    },
    {
        icon: Users,
        title: "Follow-up & Handholding",
        description:
            "We stay connected through joining to ensure smooth integration and performance alignment.",
    },
];

const RecruitmentProcessSection = ({
    title = "Our Recruitment Process",
    titleLink = "",
    subtitle = "A structured approach from planning through onboarding, designed to deliver the right talent.",
    className = "",
}) => {
    return (
        <section className={`section-padding ${className}`.trim()}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    {titleLink ? (
                        <Link
                            to={titleLink}
                            className="inline-flex items-center gap-2 text-3xl md:text-4xl font-bold text-gray-900 mb-4 hover:text-blue-700 transition-colors"
                        >
                            <span>{title}</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    ) : (
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {title}
                        </h2>
                    )}
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        {subtitle}
                    </p>
                </div>
                <div className="relative">
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
    );
};

export default RecruitmentProcessSection;
