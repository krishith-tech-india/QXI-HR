import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useLoader } from "@/contexts/LoaderContext";
import { API_ENDPOINTS } from "@/config/apiConfig";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: "",
    });
    const { toast } = useToast();
    const { showLoader, hideLoader } = useLoader();

    const contactInfo = [
        {
            icon: MapPin,
            title: "Our Office",
            details: [
                "Head Office – 804, 8Th Floor A-Wing RK Iconic Ayodhiya Chowk, 150 Feet Ring Rd, Rajkot, Gujarat 360007 (India)",
            ],
            color: "text-blue-600",
        },
        {
            icon: Phone,
            title: "Phone Numbers",
            details: ["Phone: 7778880721", "Telephone: 0281-2992804"],
            color: "text-green-600",
        },
        {
            icon: Mail,
            title: "Email Addresses",
            details: ["qxihroffice@gmail.com"],
            color: "text-purple-600",
        },
        {
            icon: Clock,
            title: "Business Hours",
            details: [
                "Monday - Friday: 9:00 AM - 6:00 PM",
                "Saturday: 10:00 AM - 4:00 PM",
                "Sunday: Closed",
            ],
            color: "text-orange-600",
        },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.name ||
            !formData.email ||
            !formData.subject ||
            !formData.message
        ) {
            toast({
                title: "Error",
                description: "Please fill in all required fields.",
                variant: "destructive",
            });
            return;
        }

        showLoader();
        try {
            const response = await fetch(API_ENDPOINTS.sendContactEmail, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phoneNo: formData.phone,
                    comapny: formData.company,
                    subject: formData.subject,
                    message: formData.message,
                }),
            });

            // API returns text/plain on success, so we can't always parse as JSON
            if (response.ok) {
                toast({
                    title: "Success!",
                    description:
                        "Your message has been sent successfully. We'll get back to you soon!",
                });
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    company: "",
                    subject: "",
                    message: "",
                });
            } else {
                try {
                    const result = await response.json();
                    toast({
                        title: "Error",
                        description:
                            result.message || "Failed to send message.",
                        variant: "destructive",
                    });
                } catch (jsonError) {
                    toast({
                        title: "Error",
                        description:
                            "An unexpected error occurred. Please try again.",
                        variant: "destructive",
                    });
                }
            }
        } catch (error) {
            toast({
                title: "Network Error",
                description: "Could not connect to the server.",
                variant: "destructive",
            });
        } finally {
            hideLoader();
        }
    };

    return (
        <>
            <Helmet>
                <title>Contact Us - QXI HR (OPC) PRIVATE LIMITED</title>
                <meta
                    name="description"
                    content="Get in touch with QXI HR (OPC) PRIVATE LIMITED. Contact our team for HR consultancy services, recruitment solutions, and professional support."
                />
                <meta
                    property="og:title"
                    content="Contact Us - QXI HR (OPC) PRIVATE LIMITED"
                />
                <meta
                    property="og:description"
                    content="Reach out to our experienced HR consultancy team. We're here to help with all your human resource needs."
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
                            Contact Us
                        </h1>
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
                            Ready to transform your HR operations? Let's start
                            the conversation.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Information */}
            <section className="section-padding bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Get In Touch
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            We're here to help you with all your HR needs. Reach
                            out to us through any of the following channels.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {contactInfo.map((info, index) => {
                            const Icon = info.icon;
                            return (
                                <motion.div
                                    key={info.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: index * 0.1,
                                    }}
                                    className="bg-white rounded-xl p-6 shadow-lg hover-lift text-center"
                                >
                                    <div
                                        className={`w-16 h-16 mx-auto mb-4 ${info.color} bg-gray-100 rounded-full flex items-center justify-center`}
                                    >
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {info.title}
                                    </h3>
                                    <div className="space-y-1">
                                        {info.details.map(
                                            (detail, detailIndex) => (
                                                <p
                                                    key={detailIndex}
                                                    className="text-gray-600 text-sm"
                                                >
                                                    {detail}
                                                </p>
                                            )
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Contact Form & Map */}
            <section className="section-padding">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="bg-white rounded-xl shadow-lg p-8"
                        >
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                Send Us a Message
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    name: e.target.value,
                                                })
                                            }
                                            className="custom-input"
                                            placeholder="Your full name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    email: e.target.value,
                                                })
                                            }
                                            className="custom-input"
                                            placeholder="your.email@example.com"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    phone: e.target.value,
                                                })
                                            }
                                            className="custom-input"
                                            placeholder="+91 12345 67890"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Company
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.company}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    company: e.target.value,
                                                })
                                            }
                                            className="custom-input"
                                            placeholder="Your company name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject *
                                    </label>
                                    <select
                                        value={formData.subject}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                subject: e.target.value,
                                            })
                                        }
                                        className="custom-select"
                                        required
                                    >
                                        <option value="">
                                            Select a subject
                                        </option>
                                        <option value="General Inquiry">
                                            General Inquiry
                                        </option>
                                        <option value="HR Payroll Services">
                                            HR Payroll Services
                                        </option>
                                        <option value="Placement Services">
                                            Placement Services
                                        </option>
                                        <option value="Staffing Solutions">
                                            Staffing Solutions
                                        </option>
                                        <option value="Corporate Training">
                                            Corporate Training
                                        </option>
                                        <option value="Recruitment Solutions">
                                            Recruitment Solutions
                                        </option>
                                        <option value="Partnership Opportunity">
                                            Partnership Opportunity
                                        </option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                message: e.target.value,
                                            })
                                        }
                                        rows={6}
                                        className="custom-input"
                                        placeholder="Tell us about your requirements or questions..."
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full corporate-gradient text-white"
                                >
                                    <Send className="w-5 h-5 mr-2" />
                                    Send Message
                                </Button>
                            </form>
                        </motion.div>

                        {/* Map */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden"
                        >
                            <div className="h-full min-h-[500px] relative">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3690.912109862135!2d70.7653029752366!3d22.31916347967307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959c982bebed309%3A0xd9f9e8542a0d4daa!2sQXI%20HR%20(OPC)%20PVT%20LTD!5e0!3m2!1sen!2sin!4v1765904199803!5m2!1sen!2sin"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, minHeight: "500px" }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="QXI HR (OPC) PRIVATE LIMITED's Office Location"
                                ></iframe>
                            </div>
                        </motion.div>
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
                            Don't wait to transform your HR operations. Contact
                            us today and let's discuss how we can help your
                            business succeed.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button
                                asChild
                                size="lg"
                                className="bg-white text-gray-900 hover:bg-gray-100"
                            >
                                <a href="tel:7778880721">
                                    <Phone className="w-5 h-5 mr-2" />
                                    Call Now
                                </a>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="border-white text-white bg-transparent hover:bg-white hover:text-gray-900"
                            >
                                <a href="mailto:qxihroffice@gmail.com">
                                    <Mail className="w-5 h-5 mr-2" />
                                    Email Us
                                </a>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default Contact;
