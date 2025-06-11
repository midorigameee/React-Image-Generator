import React, { useState } from "react";
import axios from "axios";
import "./ImageUploader.css";
import { resizeImageWithExif } from "../utils/imageUtils";

const ImageUploader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      // JPEG かどうかをチェック
      if (file.type !== "image/jpeg" && file.type !== "image/jpg") {
        setStatusMessage("JPEG画像（.jpg / .jpeg）のみアップロードできます。");
        setSelectedFile(null);
        return;
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

    const formData = new FormData();
    formData.append("file", selectedFile);

    setStatusMessage("画像を処理中です…");

    try {
      const resizedBlob = await resizeImageWithExif(selectedFile);

      const formData = new FormData();
      formData.append("file", resizedBlob, selectedFile.name);

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
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile}>
        アップロード
      </button>

      {/* ステータスメッセージ */}
      {statusMessage && <p>{statusMessage}</p>}

      {processedImage && (
        <div className="image-preview">
          <img src={processedImage} alt="Processed" />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
