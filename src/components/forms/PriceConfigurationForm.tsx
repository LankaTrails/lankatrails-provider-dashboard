import React from "react";
import InputField from "./InputField";
import SelectField from "./SelectField";
import CheckboxField from "./CheckboxField";
import type {
  PriceConfigDTO,
  BookingConfigDTO,
  PriceType,
  ServiceType,
} from "@/types/serviceTypes";
import { Info } from "lucide-react";
import { getServiceTypeRecommendations } from "@/utils/serviceRecommendations";

interface PriceConfigurationFormProps {
  priceConfig?: PriceConfigDTO;
  bookingConfig?: BookingConfigDTO;
  serviceType: ServiceType;
  onChange: (config: PriceConfigDTO) => void;
}

const PriceConfigurationForm: React.FC<PriceConfigurationFormProps> = ({
  priceConfig,
  bookingConfig,
  serviceType,
  onChange,
}) => {
  const handleConfigChange = (field: keyof PriceConfigDTO, value: any) => {
    const updatedConfig = {
      ...priceConfig,
      [field]: value,
    } as PriceConfigDTO;

    // Auto-sync child prices with adult prices when separate pricing is disabled
    if (!bookingConfig?.requireChildInfo) {
      if (field === "pricePerAdult") {
        updatedConfig.pricePerChild = value;
      } else if (field === "extraPerAdult") {
        updatedConfig.extraPerChild = value;
      }
    }

    onChange(updatedConfig);
  };

  // Get service-specific price types
  const getPriceTypeOptions = () => {
    const recommendations = getServiceTypeRecommendations(serviceType);
    return recommendations.priceTypes.map((pt) => ({
      value: pt.value,
      label: pt.label,
      description: pt.description,
      recommended: pt.recommended,
    }));
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

  // Check if selected price type is appropriate for service type
  const isPriceTypeAppropriate = () => {
    if (!priceConfig?.priceType) return true;

    const recommendations = getServiceTypeRecommendations(serviceType);
    return recommendations.priceTypes.some(
      (pt) => pt.value === priceConfig.priceType
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

  const getRateLabel = (type?: PriceType) => {
    const priceType = type || priceConfig?.priceType;
    switch (priceType) {
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
      <div className="p-4 rounded-lg border border-gray-200 bg-white">
        {/* Price Type Selection */}
        <div className="space-y-4">
          <div className="relative">
            <SelectField
              label="Price Type"
              options={getPriceTypeOptions().map((option) => ({
                value: option.value,
                label: option.recommended
                  ? `${option.label} (Recommended)`
                  : option.label,
              }))}
              value={priceConfig?.priceType || ""}
              onChange={(value) =>
                handleConfigChange("priceType", value as PriceType)
              }
              required
            />
            {/* Tooltip */}
            {priceConfig?.priceType && (
              <div className="mt-2">
                {/* Show warning only if not appropriate */}
                {!isPriceTypeAppropriate() ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                    <div className="flex items-start space-x-2">
                      <Info className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-amber-700">
                        This price type is not typically recommended for{" "}
                        {serviceType.toLowerCase().replace("_", " ")} services.
                        Consider using one of the recommended options for better
                        pricing structure.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">
                    {
                      getPriceTypeOptions().find(
                        (opt) => opt.value === priceConfig.priceType
                      )?.description
                    }
                  </div>
                )}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                {/* Only show child pricing if requireChildInfo is enabled */}
                {bookingConfig?.requireChildInfo && (
                  <InputField
                    label="Price per Child"
                    type="number"
                    value={priceConfig?.pricePerChild?.toString() || ""}
                    onChange={(value) =>
                      handleConfigChange(
                        "pricePerChild",
                        parseFloat(value) || 0
                      )
                    }
                    placeholder="Enter child price"
                  />
                )}
              </div>

              {!bookingConfig?.requireChildInfo && (
                <p className="text-sm text-gray-600 italic">
                  Child and adult pricing is the same. Child prices are
                  automatically set to match adult prices when "Separate Child &
                  Adult Pricing" is disabled.
                </p>
              )}
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
            <p className="text-sm text-gray-600">
              Configure additional charges for extras like fuel, tolls,
              overtime, special equipment, etc.
            </p>

            <SelectField
              label="Extra Charge Type"
              options={[
                { value: "", label: "No Extra Charges" },
                ...getPriceTypeOptions().map((option) => ({
                  value: option.value,
                  label: option.label,
                })),
              ]}
              value={priceConfig?.extraChargeType || ""}
              onChange={(value) =>
                handleConfigChange(
                  "extraChargeType",
                  (value as PriceType) || undefined
                )
              }
            />

            {priceConfig?.extraChargeType && (
              <div className="space-y-4">
                {/* Per Person Extra Charges */}
                {(priceConfig.extraChargeType === "PER_PERSON" ||
                  priceConfig.extraChargeType === "HYBRID") && (
                  <div className="space-y-4">
                    <div
                      className={`grid ${
                        bookingConfig?.requireChildInfo
                          ? "grid-cols-2"
                          : "grid-cols-1"
                      } gap-4`}
                    >
                      <InputField
                        label={
                          bookingConfig?.requireChildInfo
                            ? "Extra Charge per Adult"
                            : "Extra Charge per Person"
                        }
                        type="number"
                        value={priceConfig?.extraPerAdult?.toString() || ""}
                        onChange={(value) =>
                          handleConfigChange(
                            "extraPerAdult",
                            parseFloat(value) || 0
                          )
                        }
                        placeholder={
                          bookingConfig?.requireChildInfo
                            ? "Enter extra adult charge"
                            : "Enter extra person charge"
                        }
                      />
                      {bookingConfig?.requireChildInfo && (
                        <InputField
                          label="Extra Charge per Child"
                          type="number"
                          value={priceConfig?.extraPerChild?.toString() || ""}
                          onChange={(value) =>
                            handleConfigChange(
                              "extraPerChild",
                              parseFloat(value) || 0
                            )
                          }
                          placeholder="Enter extra child charge"
                        />
                      )}
                    </div>
                    {!bookingConfig?.requireChildInfo && (
                      <p className="text-sm text-muted-foreground italic">
                        Child-specific extra charges are not required for this
                        service. Extra child charges are automatically set to
                        match adult charges.
                      </p>
                    )}
                  </div>
                )}

                {/* Per Unit Extra Charges */}
                {(priceConfig.extraChargeType === "PER_UNIT" ||
                  priceConfig.extraChargeType === "FIXED") && (
                  <InputField
                    label={
                      priceConfig.extraChargeType === "FIXED"
                        ? "Fixed Extra Charge"
                        : `Extra Charge per ${getUnitLabel()}`
                    }
                    type="number"
                    value={priceConfig?.extraChargePerUnit?.toString() || ""}
                    onChange={(value) =>
                      handleConfigChange(
                        "extraChargePerUnit",
                        parseFloat(value) || 0
                      )
                    }
                    placeholder={
                      priceConfig.extraChargeType === "FIXED"
                        ? "Enter fixed extra charge"
                        : `Enter extra charge per ${getUnitLabel().toLowerCase()}`
                    }
                  />
                )}

                {/* Hourly/Daily/KM Extra Charges */}
                {["PER_HOUR", "PER_DAY", "PER_NIGHT", "PER_KM"].includes(
                  priceConfig.extraChargeType
                ) && (
                  <InputField
                    label={`Extra ${getRateLabel(priceConfig.extraChargeType)}`}
                    type="number"
                    value={priceConfig?.extraChargePerUnit?.toString() || ""}
                    onChange={(value) =>
                      handleConfigChange(
                        "extraChargePerUnit",
                        parseFloat(value) || 0
                      )
                    }
                    placeholder={`Enter extra ${getRateLabel(
                      priceConfig.extraChargeType
                    ).toLowerCase()}`}
                  />
                )}
              </div>
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
