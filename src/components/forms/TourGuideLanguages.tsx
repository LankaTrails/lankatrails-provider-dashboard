import React, { useState } from "react";
import MultiSelectField from "@/components/forms/MultiSelectField";
import { Globe } from "lucide-react";

const languageOptions = [
  { value: "en", label: "English" },
  { value: "si", label: "Sinhala" },
  { value: "ta", label: "Tamil" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "es", label: "Spanish" },
  { value: "zh", label: "Chinese" },
];

const TourGuideLanguages = () => {
  const [preferredLanguages, setPreferredLanguages] = useState<string[]>([]);

  return (
    <MultiSelectField
      label="Preferred Languages"
      options={languageOptions}
      value={preferredLanguages}
      onChange={setPreferredLanguages}
      required
      icon={<Globe size={16} />}
      placeholder="Select languages..."
    />
  );
};

export default TourGuideLanguages;
