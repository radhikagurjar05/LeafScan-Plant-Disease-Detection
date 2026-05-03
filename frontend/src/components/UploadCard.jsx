import { useDropzone } from "react-dropzone";
import { useState, useRef } from "react";


export default function UploadCard({ onFile }) {
  const [preview, setPreview] = useState(null);
  const cameraRef = useRef();

  // 📁 HANDLE FILE
  const handleFile = (file) => {
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    if (onFile) {
      onFile(file); // ✅ safe call
    }
  };

  // 📦 DRAG & DROP
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      handleFile(acceptedFiles[0]);
    },
  });

  return (
    <div className="upload-wrapper">

      {/* 📤 DROP AREA */}
      <div {...getRootProps()} className="upload-box">
        <input {...getInputProps()} />

        <div className="upload-content">
          {preview ? (
            <>
              <img src={preview} alt="preview" className="preview-img" />
              <p>Image selected ✔</p>
            </>
          ) : (
            <>
             <div className="upload-content">
  <div className="upload-icon">📤</div>

  {isDragActive ? (
    <p className="upload-text active">
      Drop your image here...
    </p>
  ) : (
    <>
      <h3 className="upload-title">
        Drag & Drop your leaf image
      </h3>

      <p className="upload-sub">
        or click to browse
      </p>

      <span className="upload-format">
        JPG, PNG • Max 10MB
      </span>
    </>
  )}
</div>
            </>
          )}
        </div>
      </div>

      {/* 📷 CAMERA BUTTON */}
      <button
        className="camera-btn"
        onClick={() => cameraRef.current.click()}
      >
        📷 Open Camera
      </button>

      {/* 📷 CAMERA INPUT */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraRef}
        style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  );
}