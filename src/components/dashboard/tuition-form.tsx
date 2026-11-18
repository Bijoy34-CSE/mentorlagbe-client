"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { FormSelect } from "@/components/form-select";
import { ImageUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CLASS_LEVELS, SUBJECTS } from "@/lib/constants";
import type { Tuition } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface TuitionPayload {
  title: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  bannerImage: string;
  description: string;
}

// Form fields are kept as text, then converted when we submit
interface FormState {
  title: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  location: string;
  monthlyFee: string;
  daysPerWeek: string;
  bannerImage: string;
  description: string;
}

type Errors = Partial<Record<keyof FormState, string>>;

const emptyForm: FormState = {
  title: "",
  subject: "",
  classLevel: "",
  mode: "Online",
  location: "",
  monthlyFee: "",
  daysPerWeek: "",
  bannerImage: "",
  description: "",
};

function fromTuition(tuition: Tuition): FormState {
  return {
    title: tuition.title,
    subject: tuition.subject,
    classLevel: tuition.classLevel,
    mode: tuition.mode,
    location: tuition.location,
    monthlyFee: String(tuition.monthlyFee),
    daysPerWeek: String(tuition.daysPerWeek),
    bannerImage: tuition.bannerImage,
    description: tuition.description,
  };
}

interface TuitionFormProps {
  tuition?: Tuition; // pass this to edit an existing tuition
  submitLabel: string;
  onSubmit: (payload: TuitionPayload) => Promise<void>;
  onCancel?: () => void;
}

export function TuitionForm({ tuition, submitLabel, onSubmit, onCancel }: TuitionFormProps) {
  const [form, setForm] = useState<FormState>(tuition ? fromTuition(tuition) : emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  function validate() {
    const next: Errors = {};
    const fee = Number(form.monthlyFee);
    const days = Number(form.daysPerWeek);

    if (form.title.trim().length < 5) next.title = "Title must be at least 5 characters";
    if (!form.subject) next.subject = "Please select a subject";
    if (!form.classLevel) next.classLevel = "Please select a class level";
    if (!form.location.trim()) next.location = "Location is required";
    if (!form.monthlyFee || !Number.isFinite(fee) || fee <= 0) next.monthlyFee = "Enter a fee greater than 0";
    if (!Number.isInteger(days) || days < 1 || days > 7) next.daysPerWeek = "Days per week must be 1 to 7";
    if (!form.bannerImage) next.bannerImage = "Please upload a banner image";
    if (form.description.trim().length < 20) next.description = "Description must be at least 20 characters";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        subject: form.subject,
        classLevel: form.classLevel,
        mode: form.mode,
        location: form.location.trim(),
        monthlyFee: Number(form.monthlyFee),
        daysPerWeek: Number(form.daysPerWeek),
        bannerImage: form.bannerImage,
        description: form.description.trim(),
      });
    } finally {
      setSaving(false);
    }
  }

  const error = (key: keyof FormState) =>
    errors[key] ? <p className="text-sm text-destructive">{errors[key]}</p> : null;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Tuition Title</Label>
        <Input
          id="title"
          placeholder="e.g. HSC Higher Math Crash Batch"
          value={form.title}
          onChange={(event) => setField("title", event.target.value)}
        />
        {error("title")}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <FormSelect
            id="subject"
            value={form.subject}
            options={SUBJECTS}
            placeholder="Select subject"
            onChange={(value) => setField("subject", value)}
          />
          {error("subject")}
        </div>

        <div className="space-y-2">
          <Label htmlFor="classLevel">Class Level</Label>
          <FormSelect
            id="classLevel"
            value={form.classLevel}
            options={CLASS_LEVELS}
            placeholder="Select class level"
            onChange={(value) => setField("classLevel", value)}
          />
          {error("classLevel")}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Mode</Label>
          <div className="grid grid-cols-2 gap-2">
            {(["Online", "Offline"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setField("mode", mode)}
                className={cn(
                  "h-10 rounded-lg border text-sm font-medium transition-colors",
                  form.mode === mode ? "border-primary bg-primary/10 text-primary" : "hover:bg-muted"
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder={form.mode === "Online" ? "e.g. Online (Zoom)" : "e.g. Dhanmondi, Dhaka"}
            value={form.location}
            onChange={(event) => setField("location", event.target.value)}
          />
          {error("location")}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="monthlyFee">Monthly Fee (৳)</Label>
          <Input
            id="monthlyFee"
            type="number"
            min={1}
            placeholder="3000"
            value={form.monthlyFee}
            onChange={(event) => setField("monthlyFee", event.target.value)}
          />
          {error("monthlyFee")}
        </div>

        <div className="space-y-2">
          <Label htmlFor="daysPerWeek">Days Per Week</Label>
          <Input
            id="daysPerWeek"
            type="number"
            min={1}
            max={7}
            placeholder="3"
            value={form.daysPerWeek}
            onChange={(event) => setField("daysPerWeek", event.target.value)}
          />
          {error("daysPerWeek")}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Banner Image</Label>
        <ImageUpload value={form.bannerImage} onChange={(url) => setField("bannerImage", url)} />
        {error("bannerImage")}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={5}
          placeholder="Describe the syllabus, class style and who this tuition is for"
          value={form.description}
          onChange={(event) => setField("description", event.target.value)}
        />
        {error("description")}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" size="lg" disabled={saving}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          {saving ? "Saving..." : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" size="lg" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}