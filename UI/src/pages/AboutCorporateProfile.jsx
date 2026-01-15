import React from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const AboutCorporateProfile = () => {
    return (
        <>
            <Helmet>
                <title>
                    Corporate Profile - QXI HR (OPC) PRIVATE LIMITED
                </title>
                <meta
                    name="description"
                    content="Discover the corporate profile of QXI HR (OPC) PRIVATE LIMITED and our commitment to excellence in HR solutions."
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
                            Corporate Profile
                        </h1>
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
                            A trusted HR consultancy delivering comprehensive
                            solutions for growing businesses.
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
                                className="rounded-lg shadow-2xl w-full h-96 object-cover"
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
        </>
    );
};

export default AboutCorporateProfile;
