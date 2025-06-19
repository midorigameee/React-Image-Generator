import React from "react";
import "./FileSelectForm.css";
import { extractExifDataFromFile } from "../imageUtils";
import type { ExifData } from "../types";

type Props = {
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  setProcessedImage: React.Dispatch<React.SetStateAction<string | null>>;
  setStatusMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setExifData: React.Dispatch<React.SetStateAction<ExifData | null>>;
};

const FileSelectForm: React.FC<Props> = ({
  setSelectedFile,
  setProcessedImage,
  setStatusMessage,
  setExifData,
}) => {
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
    <div className="file-input-form">
      <label className="custom-file-upload">
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </label>
    </div>
  );
};

export default FileSelectForm;
