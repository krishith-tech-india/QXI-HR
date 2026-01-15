import React from "react";
import { Briefcase } from "lucide-react";
import ServiceDetailLayout from "@/pages/services/ServiceDetailLayout";

const PlacementServices = () => {
    return (
        <ServiceDetailLayout
            title="Placement Services"
            description="Expert recruitment and placement services to help you find the right talent for your organization."
            overview="Our placement process combines targeted sourcing with structured evaluation to deliver the best-fit candidates. From requisition analysis to offer closure, we work as an extension of your hiring team."
            features={[
                "Executive search and recruitment",
                "Candidate screening and assessment",
                "Interview coordination",
                "Background verification",
                "Salary negotiation support",
                "Post-placement follow-up",
            ]}
            sections={[
                {
                    title: "Talent Sourcing",
                    description:
                        "We tap into active and passive talent pools to reach the right candidates fast.",
                    bullets: [
                        "Role-specific sourcing strategy",
                        "Multi-channel outreach and referrals",
                        "Pre-screened candidate pipelines",
                    ],
                },
                {
                    title: "Evaluation and Selection",
                    description:
                        "Structured screening ensures quality and cultural fit.",
                    bullets: [
                        "Skill and competency assessments",
                        "Behavioral and technical interviews",
                        "Reference and background validation",
                    ],
                },
                {
                    title: "Offer and Onboarding Support",
                    description:
                        "We help you close roles and enable smooth onboarding.",
                    bullets: [
                        "Offer negotiation guidance",
                        "Joining assurance and follow-ups",
                        "Post-placement feedback tracking",
                    ],
                },
            ]}
            icon={Briefcase}
            metaDescription="Placement services covering executive search, candidate screening, interview coordination, and post-placement follow-up."
            heroImage="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a"
        />
    );
};

export default PlacementServices;
