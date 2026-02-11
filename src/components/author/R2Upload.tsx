"use client";

import React from "react";
import { CloudArrowUpIcon } from "@heroicons/react/24/solid";

type R2UploadProps = {
  label: string;
  accept: string;
  onUploaded: (url: string) => void;
};

export default function R2Upload({
  label,
  accept,
  onUploaded,
}: R2UploadProps) {
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  async function handleFileChange(file: File) {
    try {
      setUploading(true);
      setError("");
      setSuccess(false);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Upload failed");
        return;
      }

      setSuccess(true);
      onUploaded(data.url); // ✅ R2 URL parent ko bhejo
    } catch (err) {
      setError("Something went wrong during upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-800">
        {label}
      </label>

      <div className="rounded-2xl border border-dashed p-5 text-center">
        <CloudArrowUpIcon className="mx-auto h-8 w-8 text-gray-700" />

        <input
          type="file"
          accept={accept}
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileChange(file);
          }}
          className="mt-3 block w-full text-sm"
        />

        {uploading && (
          <p className="mt-2 text-xs text-blue-600">
            Uploading...
          </p>
        )}

        {success && (
          <p className="mt-2 text-xs text-green-600">
            Uploaded successfully ✔
          </p>
        )}

        {error && (
          <p className="mt-2 text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
