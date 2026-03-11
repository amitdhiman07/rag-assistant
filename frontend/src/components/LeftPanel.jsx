import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useDropzone } from "react-dropzone";

const LeftPanel = () => {
  const { uploadFile, pdf } = useAppContext();
  const [toasts, setToasts] = useState([]);

  const showToast = (filename, status = "uploading") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, filename, status, progress: 0 }]);
    return id;
  };

  const updateToast = (id, updates) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.map((t) => t.id === id ? { ...t, leaving: true } : t));
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 400);
  };

  const onDrop = async (acceptedFiles) => {
    for (const file of acceptedFiles) {
      const id = showToast(file.name, "uploading");

      // Simulate progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 25;
        if (progress >= 90) {
          clearInterval(interval);
          progress = 90;
        }
        updateToast(id, { progress: Math.min(progress, 90) });
      }, 200);

      try {
        await uploadFile(file);
        clearInterval(interval);
        updateToast(id, { progress: 100, status: "done" });
        setTimeout(() => removeToast(id), 2000);
      } catch {
        clearInterval(interval);
        updateToast(id, { status: "error" });
        setTimeout(() => removeToast(id), 3000);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
  });

  return (
    <div className="h-full flex flex-col p-4 bg-[#141414] relative">

      {/* Header */}
      <div className="mb-6 px-1 pt-2">
        <h1 className="text-white text-base font-semibold tracking-tight">PDF Reader</h1>
        <p className="text-white/30 text-xs mt-0.5">Upload & explore documents</p>
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border border-dashed rounded-lg p-5 text-center cursor-pointer transition-all duration-200
          ${isDragActive
            ? "border-indigo-500 bg-indigo-500/10"
            : "border-white/10 hover:border-white/25 hover:bg-white/[0.03]"
          }`}
      >
        <input {...getInputProps()} />
        <div className="text-2xl mb-2">↑</div>
        <p className="text-white/60 text-xs font-medium">
          Drop <span className="text-white/90">PDF files</span> here
        </p>
        <p className="text-white/25 text-xs mt-1">or click to browse</p>
      </div>

      {/* Uploaded Files */}
      <div className="mt-6 flex-1 overflow-y-auto">
        <p className="text-white/30 text-[11px] font-medium uppercase tracking-widest mb-3 px-1">
          Files
        </p>

        {pdf.length === 0 ? (
          <p className="text-white/20 text-xs px-1">No files uploaded yet</p>
        ) : (
          <ul className="space-y-1">
            {pdf.map((filename, index) => (
              <li
                key={index}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] transition-colors duration-150 cursor-pointer group"
              >
                {/* PDF icon */}
                <svg className="w-3.5 h-3.5 text-white/30 group-hover:text-white/50 shrink-0 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                </svg>
                <span className="text-white/70 text-xs truncate group-hover:text-white/90 transition-colors">
                  {filename}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Toasts */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{ opacity: toast.leaving ? 0 : 1, transform: toast.leaving ? "translateY(8px)" : "translateY(0)" }}
            className="bg-[#1e1e1e] border border-white/[0.08] rounded-lg px-3 py-2.5 transition-all duration-300"
          >
            {/* Filename + status */}
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-white/70 text-xs truncate max-w-[160px]">
                {toast.filename}
              </span>
              <span className={`text-[10px] font-medium ml-2 shrink-0 ${
                toast.status === "done" ? "text-emerald-400"
                : toast.status === "error" ? "text-red-400"
                : "text-indigo-400"
              }`}>
                {toast.status === "done" ? "✓ Done"
                : toast.status === "error" ? "✗ Failed"
                : "Uploading..."}
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-0.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  toast.status === "done" ? "bg-emerald-400"
                  : toast.status === "error" ? "bg-red-400"
                  : "bg-indigo-500"
                }`}
                style={{ width: `${toast.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default LeftPanel;