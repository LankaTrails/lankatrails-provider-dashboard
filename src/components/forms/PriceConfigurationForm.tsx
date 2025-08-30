import React from "react";
import InputField from "./InputField";
import SelectField from "./SelectField";
import CheckboxField from "./CheckboxField";
import type {
  PriceConfigDTO,
  PriceType,
  ServiceType,
} from "@/types/serviceTypes";
import { Info } from "lucide-react";

interface PriceConfigurationFormProps {
  priceConfig?: PriceConfigDTO;
  serviceType: ServiceType;
  onChange: (config: PriceConfigDTO) => void;
}

const PRICE_TYPE_OPTIONS = [
  {
    value: "FIXED",
    label: "Fixed Price",
    description:
      "Provider enters a single fixed amount.",
  },
  {
    value: "PER_PERSON",
    label: "Per Person",
    description:
      "Provider enters price per adult and optionally per child..",
  },
  {
    value: "PER_UNIT",
    label: "Per Unit",
    description:
      "Provider enters price per unit type (e.g., room, villa, vehicle). Must specify unit capacity.",
  },
  {
    value: "HYBRID",
    label: "Hybrid",
    description:
      "Provider defines a base price + per person or unit price.",
  },
  {
    value: "PER_HOUR",
    label: "Per Hour",
    description: "Provider sets hourly price.",
  },
  {
    value: "PER_DAY",
    label: "Per Day",
    description: "Provider sets daily price.",
  },
  {
    value: "PER_NIGHT",
    label: "Per Night",
    description:
      "Provider sets per-night price (accommodation only).",
  },
  {
    value: "PER_KM",
    label: "Per KM",
    description:
      "Provider sets price per kilometer (transport services).",
  },
];

const PriceConfigurationForm: React.FC<PriceConfigurationFormProps> = ({
  priceConfig,
  serviceType,
  onChange,
}) => {
  const handleConfigChange = (field: keyof PriceConfigDTO, value: any) => {
    const updatedConfig = {
      ...priceConfig,
      [field]: value,
    } as PriceConfigDTO;
    onChange(updatedConfig);
  };

  const getAvailablePriceTypes = () => {
    const baseTypes = ["FIXED", "PER_PERSON", "HYBRID"];

    switch (serviceType) {
      case "ACCOMMODATION":
        return [...baseTypes, "PER_UNIT", "PER_NIGHT"];
      case "TRANSPORT":
        return [...baseTypes, "PER_UNIT", "PER_KM", "PER_HOUR", "PER_DAY"];
      case "ACTIVITY":
        return [...baseTypes, "PER_HOUR", "PER_DAY"];
      case "FOOD_BEVERAGE":
        return [...baseTypes];
      case "TOUR_GUIDE":
        return [...baseTypes, "PER_HOUR", "PER_DAY"];
      default:
        return baseTypes;
    }
  };

  const getFilteredPriceOptions = () => {
    const availableTypes = getAvailablePriceTypes();
    return PRICE_TYPE_OPTIONS.filter((option) =>
      availableTypes.includes(option.value)
    );
  };

  const showFixedPrice = () => {
    return (
      priceConfig?.priceType === "FIXED" || priceConfig?.priceType === "HYBRID"
    );
  };

  const showPerPersonPricing = () => {
    return (
      priceConfig?.priceType === "PER_PERSON" ||
      priceConfig?.priceType === "HYBRID"
    );
  };

  const showPerUnitPricing = () => {
    return priceConfig?.priceType === "PER_UNIT";
  };

  const showHourlyDailyPricing = () => {
    return ["PER_HOUR", "PER_DAY", "PER_NIGHT", "PER_KM"].includes(
      priceConfig?.priceType || ""
    );
  };

  const getUnitLabel = () => {
    switch (serviceType) {
      case "ACCOMMODATION":
        return "Room/Villa";
      case "TRANSPORT":
        return "Vehicle";
      default:
        return "Unit";
    }
  };

  const getRateLabel = () => {
    switch (priceConfig?.priceType) {
      case "PER_HOUR":
        return "Hourly Rate";
      case "PER_DAY":
        return "Daily Rate";
      case "PER_NIGHT":
        return "Per Night Rate";
      case "PER_KM":
        return "Per KM Rate";
      default:
        return "Rate";
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-green-50 p-4 rounded-xl border border-green-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
          Price Configuration
        </h3>

        {/* Price Type Selection */}
        <div className="space-y-4">
          <div className="relative">
            <SelectField
              label="Price Type"
              options={getFilteredPriceOptions().map((option) => ({
                value: option.value,
                label: option.label,
              }))}
              value={priceConfig?.priceType || ""}
              onChange={(value) =>
                handleConfigChange("priceType", value as PriceType)
              }
              required
            />
            {/* Tooltip */}
            {priceConfig?.priceType && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-green-700">
                    {
                      PRICE_TYPE_OPTIONS.find(
                        (opt) => opt.value === priceConfig.priceType
                      )?.description
                    }
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Fixed Price */}
          {showFixedPrice() && (
            <InputField
              label={
                priceConfig?.priceType === "HYBRID"
                  ? "Base Price"
                  : "Fixed Price"
              }
              type="number"
              value={priceConfig?.fixedPrice?.toString() || ""}
              onChange={(value) =>
                handleConfigChange("fixedPrice", parseFloat(value) || 0)
              }
              placeholder="Enter fixed price"
              required
            />
          )}

          {/* Per Person Pricing */}
          {showPerPersonPricing() && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h4 className="font-medium text-gray-800">Per Person Pricing</h4>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Price per Adult"
                  type="number"
                  value={priceConfig?.pricePerAdult?.toString() || ""}
                  onChange={(value) =>
                    handleConfigChange("pricePerAdult", parseFloat(value) || 0)
                  }
                  placeholder="Enter adult price"
                  required
                />
                <InputField
                  label="Price per Child"
                  type="number"
                  value={priceConfig?.pricePerChild?.toString() || ""}
                  onChange={(value) =>
                    handleConfigChange("pricePerChild", parseFloat(value) || 0)
                  }
                  placeholder="Enter child price"
                />
              </div>
            </div>
          )}

          {/* Per Unit Pricing */}
          {showPerUnitPricing() && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h4 className="font-medium text-gray-800">
                Per {getUnitLabel()} Pricing
              </h4>
              <InputField
                label={`Price per ${getUnitLabel()}`}
                type="number"
                value={priceConfig?.pricePerUnit?.toString() || ""}
                onChange={(value) =>
                  handleConfigChange("pricePerUnit", parseFloat(value) || 0)
                }
                placeholder={`Enter price per ${getUnitLabel().toLowerCase()}`}
                required
              />
            </div>
          )}

          {/* Hourly/Daily/KM Pricing */}
          {showHourlyDailyPricing() && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h4 className="font-medium text-gray-800">{getRateLabel()}</h4>
              <div className="grid grid-cols-1 gap-4">
                {priceConfig?.priceType === "PER_KM" ? (
                  <>
                    <InputField
                      label="Base Fare (Optional)"
                      type="number"
                      value={priceConfig?.fixedPrice?.toString() || ""}
                      onChange={(value) =>
                        handleConfigChange("fixedPrice", parseFloat(value) || 0)
                      }
                      placeholder="Enter base fare"
                    />
                    <InputField
                      label="Price per KM"
                      type="number"
                      value={priceConfig?.pricePerUnit?.toString() || ""}
                      onChange={(value) =>
                        handleConfigChange(
                          "pricePerUnit",
                          parseFloat(value) || 0
                        )
                      }
                      placeholder="Enter price per kilometer"
                      required
                    />
                  </>
                ) : (
                  <InputField
                    label={getRateLabel()}
                    type="number"
                    value={priceConfig?.pricePerUnit?.toString() || ""}
                    onChange={(value) =>
                      handleConfigChange("pricePerUnit", parseFloat(value) || 0)
                    }
                    placeholder={`Enter ${getRateLabel().toLowerCase()}`}
                    required
                  />
                )}
              </div>
            </div>
          )}

          {/* Extra Charges */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-800">
              Extra Charges (Optional)
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Extra Charge per Adult"
                type="number"
                value={priceConfig?.extraPerAdult?.toString() || ""}
                onChange={(value) =>
                  handleConfigChange("extraPerAdult", parseFloat(value) || 0)
                }
                placeholder="Enter extra adult charge"
              />
              <InputField
                label="Extra Charge per Child"
                type="number"
                value={priceConfig?.extraPerChild?.toString() || ""}
                onChange={(value) =>
                  handleConfigChange("extraPerChild", parseFloat(value) || 0)
                }
                placeholder="Enter extra child charge"
              />
            </div>
            {showPerUnitPricing() && (
              <InputField
                label={`Extra Charge per ${getUnitLabel()}`}
                type="number"
                value={priceConfig?.extraChargePerUnit?.toString() || ""}
                onChange={(value) =>
                  handleConfigChange(
                    "extraChargePerUnit",
                    parseFloat(value) || 0
                  )
                }
                placeholder={`Enter extra charge per ${getUnitLabel().toLowerCase()}`}
              />
            )}
          </div>

          {/* Payment Options */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-800">Payment Options</h4>

            <CheckboxField
              label="Allow Advance Payment"
              checked={priceConfig?.allowAdvancePayment || false}
              onChange={(value) =>
                handleConfigChange("allowAdvancePayment", value)
              }
            />

            {priceConfig?.allowAdvancePayment && (
              <div className="grid grid-cols-2 gap-4 ml-6">
                <InputField
                  label="Advance Payment Percentage"
                  type="number"
                  value={
                    priceConfig?.advancePaymentPercentage?.toString() || ""
                  }
                  onChange={(value) =>
                    handleConfigChange(
                      "advancePaymentPercentage",
                      parseFloat(value) || 0
                    )
                  }
                  placeholder="e.g., 30"
                />
                <InputField
                  label="Advance Payment Fixed Amount"
                  type="number"
                  value={
                    priceConfig?.advancePaymentFixedAmount?.toString() || ""
                  }
                  onChange={(value) =>
                    handleConfigChange(
                      "advancePaymentFixedAmount",
                      parseFloat(value) || 0
                    )
                  }
                  placeholder="Enter fixed advance amount"
                />
              </div>
            )}

            <CheckboxField
              label="Requires Deposit"
              checked={priceConfig?.requiresDeposit || false}
              onChange={(value) => handleConfigChange("requiresDeposit", value)}
            />

            {priceConfig?.requiresDeposit && (
              <div className="ml-6">
                <InputField
                  label="Deposit Amount"
                  type="number"
                  value={priceConfig?.depositAmount?.toString() || ""}
                  onChange={(value) =>
                    handleConfigChange("depositAmount", parseFloat(value) || 0)
                  }
                  placeholder="Enter deposit amount"
                  required
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceConfigurationForm;
