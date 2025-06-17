import React, { useState } from "react";
import "./ImageUploader.css";
import ToggleSwitch from "../../../components/ToggleSwitch";
import UploadButton from "./UploadButton";
import FileSelectForm from "./FileSelectForm";
import ShowExifIInfo from "./ShowExifIInfo";
import type { ExifData } from "../types";

type Props = {
  setStatusMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setProcessedImage: React.Dispatch<React.SetStateAction<string | null>>;
};

const ImageUploader: React.FC<Props> = ({
  setStatusMessage,
  setProcessedImage,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showExif, setShowExif] = useState<boolean>(true);
  const [exifData, setExifData] = useState<ExifData | null>(null);

  console.log(exifData);

  return (
    <div className="uploader-container">
      <div className="form-item">
        <FileSelectForm
          setSelectedFile={setSelectedFile}
          setProcessedImage={setProcessedImage}
          setStatusMessage={setStatusMessage}
          setExifData={setExifData}
        />
        <UploadButton
          selectedFile={selectedFile}
          showExif={showExif}
          exifData={exifData}
          setStatusMessage={setStatusMessage}
          setProcessedImage={setProcessedImage}
        />
      </div>
      <div className="toggle-item">
        <ToggleSwitch
          checked={showExif}
          onChange={(checked) => setShowExif(checked)}
        />
      </div>
      <ShowExifIInfo
        showExif={showExif}
        exifData={exifData}
        setExifData={setExifData}
      />
    </div>
  );
};

export default ImageUploader;
