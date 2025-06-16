import React, { useState } from "react";
import "./ImageUploader.css";
import { extractExifDataFromFile } from "../imageUtils";
import ToggleSwitch from "../../../components/ToggleSwitch";
import UploadButton from "./UploadButton";
import FileSelectForm from "./FileSelectForm";
import ShowExifIInfo from "./ShowExifIInfo";

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
  const [exifData, setExifData] = useState<any>(null);

  console.log(exifData);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      // JPEG かどうかをチェック
      if (file.type !== "image/jpeg" && file.type !== "image/jpg") {
        setStatusMessage("JPEG画像（.jpg / .jpeg）のみアップロードできます。");
        setSelectedFile(null);
        return;
      }

      const exif = await extractExifDataFromFile(file);
      if (exif) {
        setExifData(exif);
      }

      setSelectedFile(file);
      setProcessedImage(null); // 新しくファイルを選択したら過去の画像はリセット
      setStatusMessage(""); // ステータスメッセージもリセット
    }
  };

  return (
    <div className="uploader-container">
      <div className="form-item">
        <FileSelectForm handleFileChange={handleFileChange} />
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
