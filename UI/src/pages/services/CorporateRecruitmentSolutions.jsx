import React from "react";
import { Building } from "lucide-react";
import ServiceDetailLayout from "@/pages/services/ServiceDetailLayout";

const CorporateRecruitmentSolutions = () => {
    return (
        <ServiceDetailLayout
            title="Corporate Recruitment Solutions"
            description="End-to-end recruitment solutions for large-scale hiring and organizational growth."
            overview="We help organizations execute complex hiring initiatives with speed and consistency. From workforce planning to final onboarding, our teams manage the full recruitment lifecycle."
            features={[
                "Bulk recruitment drives",
                "Campus recruitment programs",
                "Employer branding support",
                "Recruitment process outsourcing",
                "Talent pipeline development",
                "Recruitment analytics and reporting",
            ]}
            sections={[
                {
                    title: "Large-Scale Hiring",
                    description:
                        "Structured hiring programs designed for volume and quality.",
                    bullets: [
                        "Mass hiring campaigns and drives",
                        "Campus and lateral hiring",
                        "Centralized interview coordination",
                    ],
                },
                {
                    title: "Employer Branding",
                    description:
                        "Attract the right talent by strengthening your market presence.",
                    bullets: [
                        "Job marketing and outreach",
                        "Candidate experience improvements",
                        "Offer value proposition alignment",
                    ],
                },
                {
                    title: "Process and Analytics",
                    description:
                        "Data-driven recruitment for better decisions and outcomes.",
                    bullets: [
                        "Recruitment funnel tracking",
                        "Time-to-hire and quality metrics",
                        "Continuous process optimization",
                    ],
                },
            ]}
            icon={Building}
            metaDescription="Corporate recruitment solutions for bulk hiring, campus recruitment, employer branding, and talent pipeline development."
            heroImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c"
        />
    );
};

export default CorporateRecruitmentSolutions;
