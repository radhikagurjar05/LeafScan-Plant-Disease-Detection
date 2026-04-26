//import { useDropzone } from "react-dropzone";
//import { motion } from "framer-motion";

//export default function UploadCard({ onFile }) {

  //const { getRootProps, getInputProps } = useDropzone({
    //accept: { "image/*": [] },
    //onDrop: (acceptedFiles) => {
      //onFile(acceptedFiles[0]);
    //},
  //});

  //return (
    //<motion.div
   //   {...getRootProps()}
     // className="upload-card"
      //whileHover={{ scale: 1.02 }}
   // >
     // <input {...getInputProps()} />

      //<div className="upload-content">
        //<h3>Upload Plant Image</h3>
       // <p>Click or drag image here</p>
        //<span>PNG, JPG (Max 10MB)</span>
      //</div>
    //</motion.div>
  //);
//}


import { useDropzone } from "react-dropzone";

export default function UploadCard({ onFile }) {

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      onFile(acceptedFiles[0]);
    },
  });

  return (
    <div {...getRootProps()} className="upload-box">
      <input {...getInputProps()} />

      <div className="upload-content">
        <div className="upload-icon">📤</div>

        {isDragActive ? (
          <p>Drop your image here...</p>
        ) : (
          <>
            <h3>Drag & drop your leaf image</h3>
            <p>or click to browse</p>
            <span>JPG, PNG (Max 10MB)</span>
          </>
        )}
      </div>
    </div>
  );
}