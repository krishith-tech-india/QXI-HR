import React from "react";
import { Building } from "lucide-react";
import ServiceDetailLayout from "@/pages/services/ServiceDetailLayout";

const StaffingSolutions = () => {
    return (
        <ServiceDetailLayout
            title="Staffing Solutions"
            description="Flexible staffing solutions tailored to meet your temporary, contract, and permanent staffing needs."
            overview="We design staffing models that balance cost, speed, and quality so you can scale without sacrificing performance. Our teams handle sourcing, onboarding, and workforce management end-to-end."
            features={[
                "Temporary staffing",
                "Contract-to-hire solutions",
                "Project-based staffing",
                "Seasonal workforce management",
                "Skill-based matching",
                "Workforce planning and analytics",
            ]}
            sections={[
                {
                    title: "Flexible Engagement Models",
                    description:
                        "Choose the staffing structure that aligns with your operational goals.",
                    bullets: [
                        "Temporary and contract staffing",
                        "Contract-to-hire flexibility",
                        "Project and site-based teams",
                    ],
                },
                {
                    title: "Workforce Optimization",
                    description:
                        "We keep your workforce productive with proactive planning.",
                    bullets: [
                        "Skill and role alignment",
                        "Productivity and utilization tracking",
                        "Backup bench and replacement support",
                    ],
                },
                {
                    title: "Governance and Reporting",
                    description:
                        "Transparent reporting keeps staffing performance measurable.",
                    bullets: [
                        "Compliance and documentation audits",
                        "Attendance and shift reporting",
                        "Monthly performance reviews",
                    ],
                },
            ]}
            icon={Building}
            metaDescription="Staffing solutions for temporary, contract, and permanent workforce needs with skill-based matching."
            heroImage="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
        />
    );
};

export default StaffingSolutions;
