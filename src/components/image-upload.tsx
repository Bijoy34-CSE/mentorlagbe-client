"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { uploadImage } from "@/lib/imgbb";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  variant?: "avatar" | "banner";
  fallbackName?: string; // used for the avatar initials
}

// Picks an image file and uploads it directly to ImgBB
export function ImageUpload({ value, onChange, variant = "banner", fallbackName = "User" }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ""; // lets the user pick the same file again
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const fileInput = <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />;

  if (variant === "avatar") {
    return (
      <div className="flex items-center gap-5">
        <div className="relative">
          <UserAvatar name={fallbackName} image={value} className="size-24 text-2xl" />
          {uploading && (
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-background/70">
              <Loader2 className="size-6 animate-spin text-primary" />
            </span>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => inputRef.current?.click()}>
              <ImagePlus className="size-4" /> {value ? "Change photo" : "Upload photo"}
            </Button>
            {value && (
              <Button type="button" variant="ghost" size="sm" disabled={uploading} onClick={() => onChange("")}>
                <Trash2 className="size-4" /> Remove
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">JPG, PNG or WebP. Max size 5 MB.</p>
        </div>
        {fileInput}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-muted/40 transition-colors hover:border-primary hover:bg-muted",
          value && "border-solid"
        )}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Banner preview" className="size-full object-cover" />
        ) : (
          <span className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
            <ImagePlus className="size-8" />
            Click to upload a banner image
          </span>
        )}
        {uploading && (
          <span className="absolute inset-0 flex items-center justify-center bg-background/70">
            <Loader2 className="size-8 animate-spin text-primary" />
          </span>
        )}
      </button>
      {value && (
        <Button type="button" variant="ghost" size="sm" disabled={uploading} onClick={() => onChange("")}>
          <Trash2 className="size-4" /> Remove image
        </Button>
      )}
      {fileInput}
    </div>
  );
}