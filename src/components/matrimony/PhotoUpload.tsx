import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Camera, X, Loader2 } from "lucide-react";

interface PhotoUploadProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
}

export function PhotoUpload({ photos, onPhotosChange, maxPhotos = 5 }: PhotoUploadProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !user) return;
    if (photos.length + files.length > maxPhotos) {
      toast({ title: `Maximum ${maxPhotos} photos allowed`, variant: "destructive" });
      return;
    }

    setUploading(true);
    const newPhotos = [...photos];

    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: "Max 5MB per photo", variant: "destructive" });
        continue;
      }
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("matrimony-photos").upload(path, file);
      if (error) {
        toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      } else {
        const { data } = supabase.storage.from("matrimony-photos").getPublicUrl(path);
        newPhotos.push(data.publicUrl);
      }
    }

    onPhotosChange(newPhotos);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function removePhoto(index: number) {
    const url = photos[index];
    // Extract path from URL
    const parts = url.split("/matrimony-photos/");
    if (parts[1]) {
      await supabase.storage.from("matrimony-photos").remove([parts[1]]);
    }
    const updated = photos.filter((_, i) => i !== index);
    onPhotosChange(updated);
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        {photos.map((url, i) => (
          <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
            <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removePhoto(i)}
              className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {photos.length < maxPhotos && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            disabled={uploading}
          >
            {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Camera className="h-6 w-6" />}
            <span className="text-xs">{uploading ? "Uploading..." : "Add Photo"}</span>
          </button>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
      <p className="text-xs text-muted-foreground">{photos.length}/{maxPhotos} photos • Max 5MB each</p>
    </div>
  );
}
