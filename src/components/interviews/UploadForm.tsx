import { useState } from "react";

export default function UploadForm({ onUploadComplete }: { onUploadComplete: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    setStatus("Requesting upload URL...");
    try {
      const res = await fetch("https://5t0g67xj4l.execute-api.us-east-1.amazonaws.com/upload-url", {
        method: "POST",
      });
      const { uploadUrl } = await res.json();
      setStatus("Uploading...");
      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": "video/mp4" },
        body: file,
      });
      setStatus("✅ Uploaded! Waiting for analysis...");
      onUploadComplete();
    } catch (err) {
      console.error(err);
      setStatus("❌ Upload failed.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Upload Interview Video</h2>
      <input
        type="file"
        accept="video/mp4"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        disabled={!file}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        Upload
      </button>
      {status && <p className="mt-2 text-gray-600">{status}</p>}
    </div>
  );
}