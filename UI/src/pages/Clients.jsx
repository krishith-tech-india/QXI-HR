import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Building, Users, Award, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useLoader } from "@/contexts/LoaderContext";
import { API_ENDPOINTS } from "@/config/apiConfig";

const Clients = () => {
    const { toast } = useToast();
    const { showLoader, hideLoader } = useLoader();

    const [clients, setClients] = useState([]);
    const [role, setRole] = useState("");
    const [logoFile, setLogoFile] = useState(null);
    const [clientName, setClientName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const canManage = useMemo(() => ["Admin", "Staff"].includes(role), [role]);

    const fetchClients = async () => {
        showLoader();
        try {
            const response = await fetch(API_ENDPOINTS.getClients, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    page: 1,
                    pageSize: 100,
                    isDescending: true,
                }),
            });
            const result = await response.json();
            if (result.isSuccess) {
                setClients(result.data || []);
            } else {
                toast({
                    title: "Error",
                    description: "Failed to load clients.",
                    variant: "destructive",
                });
                setClients([]);
            }
        } catch (err) {
            toast({
                title: "Network Error",
                description: "Could not load clients.",
                variant: "destructive",
            });
        } finally {
            hideLoader();
        }
    };

    const resetForm = () => {
        setClientName("");
        setLogoFile(null);
    };

    const handleAddClient = async () => {
        if (!logoFile) {
            toast({
                title: "Validation",
                description: "Logo file is required.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        showLoader();
        try {
            const token = sessionStorage.getItem("token");
            const uploadResp = await fetch(
                API_ENDPOINTS.getClientUploadUrl(logoFile.name),
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const uploadData = await uploadResp.json();
            if (!uploadData.isSuccess)
                throw new Error("Unable to get upload URL.");

            await fetch(uploadData.data.uploadUrl, {
                method: "PUT",
                body: logoFile,
                headers: { "Content-Type": logoFile.type },
            });

            const createResp = await fetch(API_ENDPOINTS.createClient, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: clientName,
                    logoUrl: uploadData.data.fileUrl,
                }),
            });
            const createResult = await createResp.json();
            if (createResult.isSuccess) {
                toast({ title: "Added", description: "Client logo added." });
                resetForm();
                fetchClients();
            } else {
                throw new Error(
                    createResult.message || "Failed to add client."
                );
            }
        } catch (err) {
            toast({
                title: "Error",
                description: err.message,
                variant: "destructive",
            });
        } finally {
            hideLoader();
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (
            !window.confirm("Are you sure you want to delete this client logo?")
        )
            return;

        const token = sessionStorage.getItem("token");
        showLoader();
        try {
            const resp = await fetch(API_ENDPOINTS.deleteClient(id), {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await resp.json();
            if (result.isSuccess) {
                toast({
                    title: "Removed",
                    description: "Client logo removed.",
                });
                fetchClients();
            } else {
                throw new Error(result.message || "Failed to delete.");
            }
        } catch (err) {
            toast({
                title: "Error",
                description: err.message,
                variant: "destructive",
            });
        } finally {
            hideLoader();
        }
    };

    useEffect(() => {
        setRole(sessionStorage.getItem("role") || "");
        fetchClients();
    }, []);

    const industries = [
        {
            name: "Technology",
            icon: "💻",
            description: "Software development, IT services, and tech startups",
            count: "50+",
        },
        {
            name: "Healthcare",
            icon: "🏥",
            description: "Hospitals, clinics, and medical device companies",
            count: "30+",
        },
        {
            name: "Finance",
            icon: "🏦",
            description: "Banks, insurance companies, and fintech firms",
            count: "25+",
        },
        {
            name: "Manufacturing",
            icon: "🏭",
            description: "Industrial manufacturing and production companies",
            count: "40+",
        },
        {
            name: "Retail",
            icon: "🛍️",
            description: "E-commerce, retail chains, and consumer goods",
            count: "35+",
        },
        {
            name: "Education",
            icon: "🎓",
            description: "Universities, schools, and educational institutions",
            count: "20+",
        },
    ];

    const testimonials = [
        {
            quote: "QXI HR has been instrumental in transforming our recruitment process. Their expertise and dedication have helped us build a world-class team.",
            author: "Sarah Mitchell",
            position: "CEO, TechCorp Solutions",
            company: "TechCorp Solutions",
        },
        {
            quote: "The payroll management services provided by QXI HR have streamlined our operations significantly. Highly professional and reliable.",
            author: "Michael Chen",
            position: "HR Director, Global Industries",
            company: "Global Industries",
        },
        {
            quote: "Outstanding staffing solutions that perfectly matched our project requirements. QXI HR understands our business needs exceptionally well.",
            author: "Emily Rodriguez",
            position: "Operations Manager, Innovation Labs",
            company: "Innovation Labs",
        },
    ];

    return (
        <>
            <Helmet>
                <title>Our Clients - QXI HR (OPC) PRIVATE LIMITED</title>
                <meta
                    name="description"
                    content="Discover the diverse range of clients we serve at QXI HR (OPC) PRIVATE LIMITED. From startups to Fortune 500 companies across various industries."
                />
                <meta
                    property="og:title"
                    content="Our Clients - QXI HR (OPC) PRIVATE LIMITED"
                />
                <meta
                    property="og:description"
                    content="Trusted by leading companies across technology, healthcare, finance, manufacturing, retail, and education sectors."
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
                            Our Valued Clients
                        </h1>
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
                            Trusted by leading companies across diverse
                            industries
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="section-padding bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            {
                                number: "200+",
                                label: "Happy Clients",
                                icon: Building,
                            },
                            {
                                number: "5000+",
                                label: "Successful Placements",
                                icon: Users,
                            },
                            {
                                number: "15+",
                                label: "Years of Excellence",
                                icon: Award,
                            },
                            {
                                number: "98%",
                                label: "Client Retention Rate",
                                icon: TrendingUp,
                            },
                        ].map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: index * 0.1,
                                    }}
                                    className="text-center"
                                >
                                    <div className="w-16 h-16 mx-auto mb-4 corporate-gradient rounded-full flex items-center justify-center">
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                        {stat.number}
                                    </div>
                                    <div className="text-gray-600 font-medium">
                                        {stat.label}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Client Logos */}
            <section className="section-padding pt-12 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Trusted by Industry Leaders
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            We're proud to partner with companies of all sizes,
                            from innovative startups to established enterprises.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {canManage && (
                            <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col gap-3 justify-between border border-dashed border-blue-200">
                                <div>
                                    <div className="font-semibold text-gray-800 mb-2">
                                        Add Client
                                    </div>
                                    <Input
                                        placeholder="Client name (optional)"
                                        value={clientName}
                                        onChange={(e) =>
                                            setClientName(e.target.value)
                                        }
                                        className="mb-3"
                                    />
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setLogoFile(
                                                e.target.files?.[0] || null
                                            )
                                        }
                                    />
                                </div>
                                <Button
                                    onClick={handleAddClient}
                                    disabled={isSubmitting}
                                    className="mt-2"
                                >
                                    {isSubmitting ? "Saving..." : "Upload logo"}
                                </Button>
                            </div>
                        )}
                        {clients.map((client, index) => (
                            <motion.div
                                key={`${client.id}-${client.logoUrl}`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                whileHover={{
                                    scale: 1.03,
                                    rotateX: 2,
                                    rotateY: -2,
                                }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.04,
                                }}
                                className="relative bg-white rounded-xl shadow-xl p-4 flex items-center justify-center hover:-translate-y-1 hover:shadow-2xl transform-gpu"
                                style={{ perspective: "900px" }}
                            >
                                {canManage && (
                                    <button
                                        aria-label="Delete logo"
                                        onClick={() => handleDelete(client.id)}
                                        className="absolute top-2 right-2 text-sm text-red-600 hover:text-red-800"
                                    >
                                        ✕
                                    </button>
                                )}
                                <img
                                    src={
                                        client.logoUrl?.startsWith("http")
                                            ? client.logoUrl
                                            : `https://${client.logoUrl}`
                                    }
                                    alt={`${client.name || "Client"} logo`}
                                    className="max-w-full h-20 md:h-24 object-contain drop-shadow-lg"
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Industries We Serve */}
            <section className="section-padding bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Industries We Serve
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Our expertise spans across multiple industries,
                            providing specialized HR solutions for each sector.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {industries.map((industry, index) => (
                            <motion.div
                                key={industry.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                }}
                                className="bg-white rounded-xl p-6 shadow-lg hover-lift text-center"
                            >
                                <div className="text-4xl mb-4">
                                    {industry.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {industry.name}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    {industry.description}
                                </p>
                                <div className="text-2xl font-bold text-blue-600">
                                    {industry.count}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Clients Served
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Client Testimonials */}
            <section className="section-padding">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            What Our Clients Say
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Don't just take our word for it. Here's what our
                            clients have to say about our services.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                }}
                                className="bg-white rounded-xl p-8 shadow-lg hover-lift"
                            >
                                <div className="text-4xl text-blue-600 mb-4">
                                    "
                                </div>
                                <p className="text-gray-600 mb-6 leading-relaxed italic">
                                    {testimonial.quote}
                                </p>
                                <div className="border-t pt-4">
                                    <div className="font-bold text-gray-900">
                                        {testimonial.author}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {testimonial.position}
                                    </div>
                                    <div className="text-sm text-blue-600 font-medium">
                                        {testimonial.company}
                                    </div>
                                </div>
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
                            Ready to Join Our Success Stories?
                        </h2>
                        <p className="text-xl max-w-3xl mx-auto mb-8 opacity-90">
                            Let us help you achieve your HR goals and become our
                            next success story.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <motion.a
                                href="/contact"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
                            >
                                Get Started Today
                            </motion.a>
                            <motion.a
                                href="/services"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors duration-200"
                            >
                                View Our Services
                            </motion.a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default Clients;
