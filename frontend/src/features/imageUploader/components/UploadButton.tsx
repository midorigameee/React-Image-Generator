import React from "react";
import axios from "axios";
import type { ExifData } from "../types";
import "./UploadButton.css";
import { resizeImageWithExif } from "../imageUtils";

type Props = {
  selectedFile: File | null;
  showExif: boolean;
  exifData: ExifData | null;
  setStatusMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setProcessedImage: React.Dispatch<React.SetStateAction<string | null>>;
};

const UploadButton: React.FC<Props> = ({
  selectedFile,
  showExif,
  exifData,
  setStatusMessage,
  setProcessedImage,
}) => {
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
