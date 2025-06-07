import React, { useState } from "react";
import axios from "axios";

const ImageUploader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:8000/upload-image",
        formData,
        {
          responseType: "blob", // バイナリデータとして受け取る
        }
      );

      const imageUrl = URL.createObjectURL(response.data);
      setProcessedImage(imageUrl);
    } catch (error) {
      console.error("画像アップロードに失敗しました:", error);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>画像をアップロードする</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile}>
        アップロード
      </button>
      {processedImage && (
        <div>
          <h2>処理済み画像</h2>
          <img
            src={processedImage}
            alt="Processed"
            style={{ maxWidth: "100%" }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
