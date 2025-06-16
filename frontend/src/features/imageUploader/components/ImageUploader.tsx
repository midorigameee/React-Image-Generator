import React, { useState } from "react";
import axios from "axios";
import "./ImageUploader.css";
import { resizeImageWithExif, extractExifDataFromFile } from "../imageUtils";
import ToggleSwitch from "../../../components/ToggleSwitch";
import UploadButton from "./UploadButton";
import FileSelectForm from "./FileSelectForm";
import ShowExifIInfo from "./ShowExifIInfo";

type Props = {
  setStatusMessage: React.Dispatch<React.SetStateAction<string>>;
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

  const handleUpload = async () => {
    if (!selectedFile) return;

    // 念のため再チェック（セキュリティ対策）
    if (
      selectedFile.type !== "image/jpeg" &&
      selectedFile.type !== "image/jpg"
    ) {
      setStatusMessage("JPEG画像（.jpg / .jpeg）のみアップロードできます。");
      return;
    }

    setStatusMessage("画像を処理中です…");

    try {
      const resizedBlob = await resizeImageWithExif(selectedFile);

      const formData = new FormData();
      formData.append("file", resizedBlob, selectedFile.name);
      formData.append("show_exif", String(showExif)); // "true" または "false"
      formData.append("exif", JSON.stringify(exifData));

      const response = await axios.post(
        import.meta.env.VITE_UPLOAD_IMAGE_API_URL,
        formData,
        {
          responseType: "blob",
        }
      );

      const imageUrl = URL.createObjectURL(response.data);
      setProcessedImage(imageUrl);
      setStatusMessage("フレーム画像を作成しました");
    } catch (error) {
      console.error("画像アップロードに失敗しました:", error);
      setStatusMessage("画像アップロードに失敗しました");
    }
  };

  return (
    <div className="uploader-container">
      <div className="form-item">
        <FileSelectForm handleFileChange={handleFileChange} />
        <UploadButton handleUpload={handleUpload} selectedFile={selectedFile} />
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
