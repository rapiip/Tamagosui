import { useEffect, useMemo, useState } from "react";
import { Trash2, Plus, Upload } from "lucide-react";

type PetGalleryProps = {
  petId: string;
  images?: string[];         // optional: kalau kamu mau inject default images dari props
  fallbackImages?: string[]; // optional fallback dari Parent (mis. avatar pet)
};

/** Kunci penyimpanan di localStorage per pet */
const storageKey = (petId: string) => `petGallery:${petId}`;

/** Util: load & save ke localStorage */
function loadImages(petId: string): string[] {
  try {
    const raw = localStorage.getItem(storageKey(petId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter((s) => typeof s === "string");
  } catch {}
  return [];
}

function saveImages(petId: string, list: string[]) {
  try {
    localStorage.setItem(storageKey(petId), JSON.stringify(list));
  } catch {}
}

export default function PetGallery({
  petId,
  images,
  fallbackImages = [],
}: PetGalleryProps) {
  const initial = useMemo(() => {
    // Urutan prioritas: localStorage -> props.images -> fallback
    const fromStorage = loadImages(petId);
    if (fromStorage.length > 0) return fromStorage;
    if (images && images.length > 0) return images;
    return fallbackImages;
  }, [petId, images, fallbackImages]);

  const [urls, setUrls] = useState<string[]>(initial);
  const [urlInput, setUrlInput] = useState("");

  useEffect(() => {
    saveImages(petId, urls);
  }, [petId, urls]);

  /** Tambah gambar dari URL */
  const addFromUrl = () => {
    const cleaned = urlInput.trim();
    if (!cleaned) return;
    try {
      // validasi sederhana
      const u = new URL(cleaned);
      const next = Array.from(new Set([...urls, u.toString()]));
      setUrls(next);
      setUrlInput("");
    } catch {
      // URL tidak valid → abaikan saja atau tambahkan toast jika kamu punya
    }
  };

  /** Upload file dan simpan sebagai DataURL (persist di localStorage) */
  const addFromFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      if (!dataUrl) return;
      setUrls((prev) => Array.from(new Set([...prev, dataUrl])));
    };
    reader.readAsDataURL(file);
  };

  const removeAt = (idx: number) => {
    setUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      {/* Input Area */}
      <div className="rounded-lg border bg-muted/40 p-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex-1">
            <input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste image URL (IPFS/Pinata/HTTPS)"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={addFromUrl}
            className="inline-flex items-center justify-center rounded-md border bg-background px-3 py-2 text-sm font-medium hover:bg-accent"
            title="Add from URL"
          >
            <Plus className="mr-1 h-4 w-4" /> Add
          </button>

          <label
            className="inline-flex cursor-pointer items-center justify-center rounded-md border bg-background px-3 py-2 text-sm font-medium hover:bg-accent"
            title="Upload image file"
          >
            <Upload className="mr-1 h-4 w-4" /> Upload
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) addFromFile(f);
                e.currentTarget.value = ""; // reset agar bisa upload file sama lagi
              }}
            />
          </label>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          • URL bisa dari IPFS/Pinata atau gambar biasa. • File yang di‑upload disimpan lokal (localStorage) sebagai data
          URL. Untuk penyimpanan permanen/kolaboratif, integrasikan ke backend atau IPFS.
        </p>
      </div>

      {/* Grid Gallery */}
      {urls.length === 0 ? (
        <div className="rounded-lg border bg-muted p-4 text-sm text-muted-foreground">
          Belum ada gambar. Tambahkan via URL atau Upload file.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {urls.map((u, i) => (
            <div
              key={`${u}-${i}`}
              className="group relative overflow-hidden rounded-lg border bg-background"
            >
              <img
                src={u}
                alt={`pet-${i}`}
                className="h-32 w-full object-cover rounded-md transition-transform hover:scale-105"

                onClick={() => window.open(u, "_blank")}
                title="Open image"
                
              />

              
              <button
                onClick={() => removeAt(i)}
                className="absolute right-1 top-1 hidden rounded-md bg-black/60 p-1 text-white group-hover:block"
                title="Remove"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
