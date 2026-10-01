import React from "react";
import { ConsultationSection } from "@/components/home/ConsultationSection";
import { SanityCta } from "@/types/sanity";

interface ConsultationMobileProps {
  heading?: string;
  description?: string;
  cta?: SanityCta;
}

export default function ConsultationMobile({ heading, description }: ConsultationMobileProps) {
  return (
    <div className="w-full lg:hidden">
      <ConsultationSection id="consultation-mobile" showMap={true} heading={heading} description={description} />
    </div>
  );
}
