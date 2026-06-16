"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowUpTrayIcon,
  CheckCircleIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

import { updateClubLogoAction } from "@/app/dashboard/club/_lib/actions";
import { createClient } from "@/utils/supabase/client";

type LogoUploadProps = {
  clubId: string;
  clubName: string;
  initialLogoUrl: string | null;
};

export function LogoUpload({
  clubId,
  clubName,
  initialLogoUrl,
}: LogoUploadProps) {
  const supabase = useMemo(() => createClient(), []);
  const [file, setFile] = useState<File | null>(null);
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string | null>(
    initialLogoUrl
  );
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filePreviewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file]
  );
  const previewUrl = filePreviewUrl ?? currentLogoUrl;

  useEffect(() => {
    return () => {
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  }, [filePreviewUrl]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!file) {
      setError("Choose a logo file first.");
      return;
    }

    setIsUploading(true);

    const extension = file.name.split(".").pop()?.toLowerCase() || "png";
    const safeName = file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const path = `${clubId}/${Date.now()}-${safeName || "logo"}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("club-logos")
      .upload(path, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      setError(uploadError.message);
      setIsUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("club-logos").getPublicUrl(path);

    const result = await updateClubLogoAction(publicUrl);

    if (!result.ok) {
      setError(result.message);
      setIsUploading(false);
      return;
    }

    setCurrentLogoUrl(publicUrl);
    setFile(null);
    setMessage(result.message);
    setIsUploading(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
      <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-6">
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={`${clubName} logo preview`}
              className="h-full w-full object-cover"
            />
          ) : (
            <PhotoIcon className="h-20 w-20 text-slate-500" />
          )}
        </div>
        <p className="mt-4 text-sm text-slate-400">
          Preview updates before saving so you can verify the logo crop.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-white/10 bg-slate-950/40 p-6"
      >
        <label
          htmlFor="club-logo"
          className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-white/20 bg-white/[0.04] px-6 py-12 text-center transition hover:border-blue-200/60 hover:bg-blue-300/10"
        >
          <ArrowUpTrayIcon className="h-10 w-10 text-blue-200" />
          <span className="mt-4 text-lg font-semibold text-white">
            Upload a new club logo
          </span>
          <span className="mt-2 text-sm text-slate-400">
            PNG, JPG, or WEBP works best.
          </span>
          <input
            id="club-logo"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </label>

        {file ? (
          <p className="mt-4 text-sm text-slate-300">
            Selected: <span className="font-medium text-white">{file.name}</span>
          </p>
        ) : null}

        {message ? (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-300/25 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">
            <CheckCircleIcon className="h-5 w-5" />
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="mt-4 rounded-2xl border border-rose-300/25 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isUploading}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-blue-200 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading ? "Uploading..." : "Save logo"}
        </button>
      </form>
    </div>
  );
}
