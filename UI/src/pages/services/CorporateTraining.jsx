import React from "react";
import { GraduationCap } from "lucide-react";
import ServiceDetailLayout from "@/pages/services/ServiceDetailLayout";

const CorporateTraining = () => {
    return (
        <ServiceDetailLayout
            title="Corporate Training"
            description="Professional development and training programs designed to enhance your team's skills and productivity."
            overview="Our learning programs are built around measurable outcomes and real-world application. We tailor training to your business goals and deliver it through flexible formats that keep teams engaged."
            features={[
                "Leadership development programs",
                "Technical skills training",
                "Soft skills enhancement",
                "Compliance training",
                "Custom training modules",
                "Performance improvement workshops",
            ]}
            sections={[
                {
                    title: "Training Needs Analysis",
                    description:
                        "We identify skill gaps and align programs to your business objectives.",
                    bullets: [
                        "Role-specific competency mapping",
                        "Leadership and succession planning",
                        "Performance gap assessments",
                    ],
                },
                {
                    title: "Learning Formats",
                    description:
                        "Programs are delivered in formats that work for your team.",
                    bullets: [
                        "Instructor-led workshops",
                        "Virtual and hybrid sessions",
                        "Custom learning paths and modules",
                    ],
                },
                {
                    title: "Outcomes and Measurement",
                    description:
                        "We track impact to ensure training drives results.",
                    bullets: [
                        "Pre and post-training assessments",
                        "Feedback and engagement insights",
                        "Action plans for applied learning",
                    ],
                },
            ]}
            icon={GraduationCap}
            metaDescription="Corporate training programs for leadership development, technical skills, compliance, and performance improvement."
            heroImage="https://images.unsplash.com/photo-1524178232363-1fb2b075b655"
        />
    );
};

export default CorporateTraining;
