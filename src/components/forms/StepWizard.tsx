import React from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isRequired?: boolean;
}

interface StepWizardProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  isNextDisabled?: boolean;
  isSubmitDisabled?: boolean;
  submitButtonText?: string;
  isSubmitting?: boolean;
  children: React.ReactNode;
}

const StepWizard: React.FC<StepWizardProps> = ({
  steps,
  currentStep,
  onStepChange,
  onNext,
  onPrevious,
  onSubmit,
  isNextDisabled = false,
  isSubmitDisabled = false,
  submitButtonText = "Create Service",
  isSubmitting = false,
  children,
}) => {
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return "completed";
    if (stepIndex === currentStep) return "current";
    return "pending";
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Step Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            return (
              <div key={step.id} className="flex items-center">
                {/* Step Circle */}
                <button
                  onClick={() => onStepChange(index)}
                  disabled={index > currentStep}
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200
                    ${
                      status === "completed"
                        ? "bg-green-500 border-green-500 text-white"
                        : status === "current"
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "bg-gray-100 border-gray-300 text-gray-400"
                    }
                    ${
                      index <= currentStep
                        ? "cursor-pointer hover:scale-105"
                        : "cursor-not-allowed"
                    }
                  `}
                >
                  {status === "completed" ? (
                    <Check className="w-5 h-5" />
                  ) : status === "current" ? (
                    step.icon
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </button>

                {/* Step Info */}
                <div className="ml-3 min-w-0 flex-1">
                  <div className="flex items-center">
                    <h3
                      className={`text-sm font-medium ${
                        status === "current"
                          ? "text-blue-600"
                          : status === "completed"
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      {step.title}
                      {step.isRequired && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </h3>
                  </div>
                  <p
                    className={`text-xs ${
                      status === "current" ? "text-blue-500" : "text-gray-400"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 w-12 mx-4 ${
                      index < currentStep ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[500px]">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            {steps[currentStep].icon}
            <span className="ml-3">{steps[currentStep].title}</span>
          </h2>
          <p className="text-gray-600 mt-2">{steps[currentStep].description}</p>
        </div>

        <div className="flex-1">{children}</div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between mt-6 p-4 bg-gray-50 rounded-lg">
        <button
          onClick={onPrevious}
          disabled={isFirstStep}
          className={`
            flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors
            ${
              isFirstStep
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }
          `}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </button>

        <div className="text-sm text-gray-500">
          Step {currentStep + 1} of {steps.length}
        </div>

        {isLastStep ? (
          <button
            onClick={onSubmit}
            disabled={isSubmitDisabled || isSubmitting}
            className={`
              flex items-center px-6 py-2 rounded-md text-sm font-medium transition-colors
              ${
                isSubmitDisabled || isSubmitting
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }
            `}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {submitButtonText === "Update Service"
                  ? "Updating..."
                  : "Creating..."}
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                {submitButtonText}
              </>
            )}
          </button>
        ) : (
          <button
            onClick={onNext}
            disabled={isNextDisabled}
            className={`
              flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${
                isNextDisabled
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }
            `}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default StepWizard;
