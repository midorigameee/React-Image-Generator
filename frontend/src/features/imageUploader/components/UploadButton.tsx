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
  setCaption: React.Dispatch<React.SetStateAction<string | null>>;
};

const UploadButton: React.FC<Props> = ({
  selectedFile,
  showExif,
  exifData,
  setStatusMessage,
  setProcessedImage,
  setCaption,
}) => {
  const handleUpload = async () => {
    if (!selectedFile) return;

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
      formData.append("show_exif", String(showExif));
      formData.append("exif", JSON.stringify(exifData));

      // 並列リクエスト
      const [imageRes, captionRes] = await Promise.all([
        axios.post(import.meta.env.VITE_UPLOAD_IMAGE_API_URL, formData, {
          responseType: "blob",
        }),
        axios.post(import.meta.env.VITE_CAPTION_API_URL, formData),
      ]);

      // レスポンスの画像をセットする
      const imageUrl = URL.createObjectURL(imageRes.data);
      setProcessedImage(imageUrl);

      // レスポンスのキャプションをセットする
      const captionText = captionRes.data.caption || "";
      setCaption(captionText);

      setStatusMessage("画像とキャプションを取得しました");
    } catch (error) {
      console.error("アップロードに失敗:", error);
      setStatusMessage("アップロードに失敗しました");
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
