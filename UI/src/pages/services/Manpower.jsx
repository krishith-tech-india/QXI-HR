import React from "react";
import { Users } from "lucide-react";
import ServiceDetailLayout from "@/pages/services/ServiceDetailLayout";

const Manpower = () => {
    return (
        <ServiceDetailLayout
            title="Manpower"
            description="Reliable manpower solutions to help you scale teams quickly and maintain workforce continuity."
            overview="We combine strong sourcing networks with rigorous screening to deliver dependable teams across industries. Our manpower services are designed to reduce hiring friction, improve productivity, and keep your operations running smoothly during peak demand."
            features={[
                "Skilled and unskilled manpower supply",
                "On-demand workforce deployment",
                "Compliance-ready documentation",
                "Shift and roster management support",
                "Industry-specific staffing",
                "Quality and performance monitoring",
            ]}
            sections={[
                {
                    title: "Workforce Planning",
                    description:
                        "We align manpower supply with your production cycles and business goals.",
                    bullets: [
                        "Demand forecasting and headcount planning",
                        "Role mapping and skill matching",
                        "Seasonal and surge staffing coverage",
                    ],
                },
                {
                    title: "Compliance and Safety",
                    description:
                        "Our teams are deployed with complete statutory compliance and safety readiness.",
                    bullets: [
                        "Documentation and statutory adherence",
                        "Induction and safety briefings",
                        "Attendance and shift compliance checks",
                    ],
                },
                {
                    title: "Deployment Support",
                    description:
                        "We stay engaged after deployment to keep performance and productivity on track.",
                    bullets: [
                        "Onsite coordination and supervision",
                        "Replacement and backup bench support",
                        "Performance reviews and quality checks",
                    ],
                },
            ]}
            icon={Users}
            metaDescription="Reliable manpower solutions including skilled workforce supply, compliance-ready staffing, and on-demand deployment."
            heroImage="https://images.unsplash.com/photo-1521791136064-7986c2920216"
        />
    );
};

export default Manpower;
