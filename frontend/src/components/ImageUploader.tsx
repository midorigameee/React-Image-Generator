import React, { useState } from "react";
import axios from "axios";
import "./ImageUploader.css";

const ImageUploader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setProcessedImage(null); // 新しくファイルを選択したら過去の画像はリセット
      setStatusMessage(""); // ステータスメッセージもリセット
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    setStatusMessage("画像を処理中です…");

    try {
      const response = await axios.post(
        "http://localhost:8000/upload-image",
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
      <h1>画像をアップロードする</h1>
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
