import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import InputField from "@/components/forms/InputField";
import { AlertTriangle, UserX, Eye, EyeOff } from "lucide-react";
import type { User } from "@/types/authTypes";

interface DeactivateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeactivate: (password: string, reason: string) => void;
  user: User;
}

const DeactivateAccountModal: React.FC<DeactivateAccountModalProps> = ({
  isOpen,
  onClose,
  onDeactivate,
  user,
}) => {
  const [password, setPassword] = useState("");
  const [reason, setReason] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const expectedConfirmText = "DEACTIVATE MY ACCOUNT";

  const handleChange = (field: string, value: string) => {
    if (field === "password") setPassword(value);
    if (field === "reason") setReason(value);
    if (field === "confirmText") setConfirmText(value);

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!password.trim()) {
      newErrors.password = "Password is required to deactivate account";
    }

    if (!reason.trim()) {
      newErrors.reason = "Please provide a reason for deactivation";
    }

    if (confirmText !== expectedConfirmText) {
      newErrors.confirmText = `Please type "${expectedConfirmText}" to confirm`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDeactivate = () => {
    if (validateForm()) {
      onDeactivate(password, reason);
      handleClose();
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setPassword("");
    setReason("");
    setConfirmText("");
    setShowPassword(false);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Deactivate Account
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-start gap-3">
              <UserX className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800 mb-2">
                  Are you sure you want to deactivate your account?
                </p>
                <ul className="text-xs text-red-700 space-y-1">
                  <li>• Your profile will be hidden from users</li>
                  <li>• Your services will be temporarily unavailable</li>
                  <li>• You can reactivate your account later</li>
                  <li>• Your data will be preserved</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <InputField
              label="Reason for Deactivation"
              value={reason}
              onChange={(value) => handleChange("reason", value)}
              placeholder="Please tell us why you're deactivating your account..."
              required
              error={errors.reason}
            />

            <div className="relative">
              <InputField
                label="Enter your password to confirm"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(value) => handleChange("password", value)}
                required
                error={errors.password}
              />
              <button
                type="button"
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <InputField
              label={`Type "${expectedConfirmText}" to confirm`}
              value={confirmText}
              onChange={(value) => handleChange("confirmText", value)}
              placeholder={expectedConfirmText}
              required
              error={errors.confirmText}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Account:</strong> {user.businessName || "Business Name"}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            onClick={handleDeactivate}
            variant="destructive"
            className="w-full"
            disabled={confirmText !== expectedConfirmText}
          >
            <UserX className="w-4 h-4 mr-2" />
            Deactivate Account
          </Button>
          <Button variant="outline" onClick={handleClose} className="w-full">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeactivateAccountModal;
