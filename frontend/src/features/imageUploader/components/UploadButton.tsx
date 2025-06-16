import React from "react";
import "./UploadButton.css";

type Props = {
  handleUpload: () => Promise<void>;
  selectedFile: File | null;
};

const UploadButton: React.FC<Props> = ({ handleUpload, selectedFile }) => {
  return (
    <>
      <button
        className="upload-button"
        onClick={handleUpload}
        disabled={!selectedFile}
      >
        アップロード
      </button>
    </>
  );
};

export default UploadButton;
