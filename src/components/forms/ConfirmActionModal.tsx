import React from "react";
import { Dialog } from "@headlessui/react";
import { Trash2, PowerOff, Power } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  actionType?: "delete" | "deactivate" | "activate";
}

const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Service",
  description = "Are you sure you want to delete this service? This action cannot be undone.",
  actionType = "delete",
}) => {
  // Determine icon and button styling based on action type
  const getIcon = () => {
    switch (actionType) {
      case "deactivate":
        return <PowerOff className="text-orange-500 w-6 h-6" />;
      case "activate":
        return <Power className="text-green-500 w-6 h-6" />;
      default:
        return <Trash2 className="text-red-500 w-6 h-6" />;
    }
  };

  const getButtonText = () => {
    switch (actionType) {
      case "deactivate":
        return "Deactivate";
      case "activate":
        return "Activate";
      default:
        return "Delete";
    }
  };

  const getButtonVariant = () => {
    switch (actionType) {
      case "deactivate":
        return "default";
      case "activate":
        return "default";
      default:
        return "destructive";
    }
  };
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 space-y-4">
          <div className="flex items-center gap-3">
            {getIcon()}
            <Dialog.Title className="text-lg font-semibold text-gray-800">
              {title}
            </Dialog.Title>
          </div>
          <Dialog.Description className="text-gray-600 text-sm">
            {description}
          </Dialog.Description>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button variant={getButtonVariant() as any} onClick={onConfirm}>
              {getButtonText()}
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ConfirmActionModal;
