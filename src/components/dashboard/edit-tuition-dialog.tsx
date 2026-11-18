"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { TuitionForm, type TuitionPayload } from "@/components/dashboard/tuition-form";
import type { Tuition } from "@/lib/types";

interface EditTuitionDialogProps {
  tuition: Tuition | null;
  onClose: () => void;
  onSubmit: (payload: TuitionPayload) => Promise<void>;
}

export function EditTuitionDialog({ tuition, onClose, onSubmit }: EditTuitionDialogProps) {
  // Close with the Escape key
  useEffect(() => {
    if (!tuition) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [tuition, onClose]);

  if (!tuition) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto p-4 sm:p-8" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border bg-card p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Edit Tuition</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              After you save, the tuition goes back to admin review before it is public again.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex size-8 shrink-0 items-center justify-center rounded-md hover:bg-muted"
          >
            <X className="size-5" />
          </button>
        </div>

        <TuitionForm key={tuition._id} tuition={tuition} submitLabel="Save Changes" onSubmit={onSubmit} onCancel={onClose} />
      </div>
    </div>
  );
}