import React from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ServiceDetailLayout = ({
    title,
    description,
    overview,
    features,
    sections,
    icon: Icon,
    metaDescription,
    heroImage,
}) => {
    const imageSrc =
        heroImage ||
        "https://images.unsplash.com/photo-1521791136064-7986c2920216";

    return (
        <>
            <Helmet>
                <title>{title} - QXI HR (OPC) PRIVATE LIMITED</title>
                <meta name="description" content={metaDescription} />
                <meta
                    property="og:title"
                    content={`${title} - QXI HR (OPC) PRIVATE LIMITED`}
                />
                <meta property="og:description" content={metaDescription} />
            </Helmet>

            <section className="relative py-20 corporate-gradient text-white">
                <div className="absolute inset-0 hero-pattern opacity-10"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/15 flex items-center justify-center">
                            {Icon && <Icon className="w-8 h-8" />}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-shadow">
                            {title}
                        </h1>
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
                            {description}
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
                                What We Deliver
                            </h2>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                {description}
                            </p>
                            {overview && (
                                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                    {overview}
                                </p>
                            )}
                            <div className="space-y-3">
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-3"
                                    >
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span className="text-gray-700">
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <img
                                className="rounded-xl shadow-2xl w-full h-80 object-cover"
                                alt={`${title} service illustration`}
                                src={imageSrc}
                            />
                            <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full corporate-gradient flex items-center justify-center shadow-lg">
                                {Icon && <Icon className="w-10 h-10 text-white" />}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {sections?.length ? (
                <section className="section-padding bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {sections.map((section, index) => (
                                <motion.div
                                    key={section.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: index * 0.1,
                                    }}
                                    className="bg-white rounded-xl p-8 shadow-lg hover-lift"
                                >
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {section.title}
                                    </h3>
                                    {section.description && (
                                        <p className="text-gray-600 mb-4 leading-relaxed">
                                            {section.description}
                                        </p>
                                    )}
                                    {section.bullets?.length && (
                                        <ul className="space-y-2 text-gray-600">
                                            {section.bullets.map(
                                                (bullet, bulletIndex) => (
                                                    <li
                                                        key={bulletIndex}
                                                        className="flex items-start space-x-2"
                                                    >
                                                        <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                                                        <span>{bullet}</span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}

            <section className="section-padding bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                            Talk to our team about your requirements and we
                            will tailor a solution that fits your business.
                        </p>
                        <Button asChild size="lg" className="corporate-gradient text-white">
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

export default ServiceDetailLayout;
