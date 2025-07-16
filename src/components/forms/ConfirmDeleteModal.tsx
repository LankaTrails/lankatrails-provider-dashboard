import React from "react";
import { Dialog } from "@headlessui/react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Service",
  description = "Are you sure you want to delete this service? This action cannot be undone.",
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Trash2 className="text-red-500 w-6 h-6" />
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
            <Button variant="destructive" onClick={onConfirm}>
              Delete
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ConfirmDeleteModal;
