import React from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import {
    Briefcase,
    ClipboardList,
    FileText,
    UserCheck,
} from "lucide-react";

const AboutBusinessProposal = () => {
    return (
        <>
            <Helmet>
                <title>Business Proposal - QXI HR (OPC) PRIVATE LIMITED</title>
                <meta
                    name="description"
                    content="Explore QXI HR's business proposal and see how we structure recruitment partnerships and delivery."
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
                            Business Proposal
                        </h1>
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
                            A transparent view of our recruitment partnership,
                            delivery process, and service terms.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="section-padding">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            className="bg-white rounded-2xl shadow-xl p-8"
                        >
                            <div className="w-14 h-14 corporate-gradient rounded-full flex items-center justify-center mb-5">
                                <UserCheck className="w-7 h-7 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Partnership Note
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed mb-6">
                                We value long-term hiring partnerships and
                                approach every requirement with accountability
                                and speed. Our proposal outlines how we source,
                                evaluate, and recommend talent that matches
                                both role needs and team culture.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                The intent is simple: to help clients reduce
                                hiring risk while improving quality and time to
                                fill.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            className="bg-white rounded-2xl shadow-xl p-8"
                        >
                            <div className="w-14 h-14 corporate-gradient rounded-full flex items-center justify-center mb-5">
                                <Briefcase className="w-7 h-7 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Service Coverage
                            </h2>
                            <div className="space-y-4 text-gray-600 text-lg">
                                <div className="flex items-start gap-3">
                                    <ClipboardList className="w-5 h-5 text-blue-600 mt-1" />
                                    <span>
                                        End-to-end recruitment across levels,
                                        departments, and industries.
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <UserCheck className="w-5 h-5 text-blue-600 mt-1" />
                                    <span>
                                        Shortlisting, assessment, and interview
                                        coordination for role-ready candidates.
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FileText className="w-5 h-5 text-blue-600 mt-1" />
                                    <span>
                                        Clear documentation of profiles, client
                                        feedback, and joining details.
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="section-padding bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Commercial Terms Snapshot
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Fees scale by role level and annual compensation,
                            with a clear replacement window for early exits.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="bg-white rounded-xl p-6 shadow-lg hover-lift"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Junior Roles
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Typical fee around 8.33% for entry-level annual
                                packages in the 1–3 LPA range.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="bg-white rounded-xl p-6 shadow-lg hover-lift"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Mid-Level Roles
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Standard fee around 10.5% for packages in the
                                3–6 LPA band.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-white rounded-xl p-6 shadow-lg hover-lift"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Senior Roles
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Typical fee around 12.5% for packages in the
                                6–12 LPA range, with special terms above that.
                            </p>
                        </motion.div>
                    </div>
                    <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-start gap-3">
                            <UserCheck className="w-6 h-6 text-blue-600 mt-1" />
                            <p className="text-gray-600 leading-relaxed">
                                Invoicing is typically raised within a week of
                                joining. If a candidate exits within the first
                                60 days, we provide a replacement at no
                                additional fee.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AboutBusinessProposal;
