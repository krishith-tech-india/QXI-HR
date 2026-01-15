import React from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const AboutMission = () => {
    return (
        <>
            <Helmet>
                <title>Our Mission - QXI HR (OPC) PRIVATE LIMITED</title>
                <meta
                    name="description"
                    content="Explore the mission of QXI HR (OPC) PRIVATE LIMITED and how we empower organizations through strategic HR solutions."
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
                            Our Mission
                        </h1>
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
                            We empower organizations to achieve business goals
                            through strategic and sustainable HR solutions.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="section-padding">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="bg-white rounded-2xl shadow-xl p-10"
                    >
                        <div className="w-16 h-16 corporate-gradient rounded-full flex items-center justify-center mb-6">
                            <Target className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            What Drives Us
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed mb-6">
                            To provide exceptional HR consultancy services that
                            empower organizations to achieve their business
                            objectives through strategic human resource
                            management, innovative solutions, and sustainable
                            growth practices.
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            We focus on building long-term partnerships,
                            supporting our clients with responsive guidance,
                            and creating measurable impact in talent
                            acquisition, workforce planning, and organizational
                            development.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="section-padding bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Ready to Work With Us?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                            Let us help you build stronger teams and a more
                            resilient organization.
                        </p>
                        <Button
                            asChild
                            size="lg"
                            className="corporate-gradient text-white"
                        >
                            <Link to="/contact">
                                Contact Us{" "}
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default AboutMission;
