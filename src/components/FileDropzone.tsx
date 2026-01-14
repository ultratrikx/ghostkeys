import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface FileDropzoneProps {
  onFileLoad: (content: string, fileName: string) => void;
  fileName: string | null;
  disabled?: boolean;
}

export function FileDropzone({
  onFileLoad,
  fileName,
  disabled,
}: FileDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;
        onFileLoad(content, file.name);
      };
      reader.readAsText(file);
    },
    [onFileLoad]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/markdown": [".md"],
      "text/plain": [".txt"],
    },
    multiple: false,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-all duration-200 ease-in-out
        ${
          isDragActive
            ? "border-accent-primary bg-accent-primary/5"
            : "border-ghost-700 hover:border-ghost-500 hover:bg-ghost-900/50"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        <svg
          className={`w-10 h-10 ${isDragActive ? "text-accent-primary" : "text-ghost-500"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        {fileName ? (
          <div>
            <p className="text-ghost-200 font-medium">{fileName}</p>
            <p className="text-ghost-500 text-sm mt-1">
              Drop a new file to replace
            </p>
          </div>
        ) : (
          <div>
            <p className="text-ghost-300">
              {isDragActive
                ? "Drop the file here..."
                : "Drag & drop a text file here"}
            </p>
            <p className="text-ghost-500 text-sm mt-1">
              or click to select (.txt, .md)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
