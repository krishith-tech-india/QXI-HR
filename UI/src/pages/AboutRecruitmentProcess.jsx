import React from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import RecruitmentProcessSection from "@/components/RecruitmentProcessSection";

const AboutRecruitmentProcess = () => {
    return (
        <>
            <Helmet>
                <title>Recruitment Process - QXI HR (OPC) PRIVATE LIMITED</title>
                <meta
                    name="description"
                    content="Learn about the QXI HR recruitment process designed to identify, assess, and place the right talent."
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
                            Recruitment Process
                        </h1>
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
                            A streamlined process designed to deliver the right
                            talent for your organization.
                        </p>
                    </motion.div>
                </div>
            </section>

            <RecruitmentProcessSection
                title="Our Proven Steps"
                subtitle="From planning to onboarding, we keep the process transparent, efficient, and aligned with your goals."
            />
        </>
    );
};

export default AboutRecruitmentProcess;
