import React, { useEffect } from "react";
import { toast } from "react-toastify";
import "./CopyText.css";

type Props = {
  caption: string | null;
};

const CopyText: React.FC<Props> = ({ caption }) => {
  useEffect(() => {
    console.log("受け取ったキャプション:", caption);
  }, [caption]);

  const handleCopy = async () => {
    if (caption) {
      try {
        await navigator.clipboard.writeText(caption);
        toast.success("キャプションをコピーしました！");
      } catch (err) {
        console.error("コピーに失敗しました:", err);
        toast.error("コピーに失敗しました");
      }
    }
  };

  console.log(`text : ${caption}`);

  return (
    <div className="caption-box">
      <textarea className="caption-text" value={caption ?? ""} readOnly />
      <button className="caption-copy-button" onClick={handleCopy}>
        コピー
      </button>
    </div>
  );
};

export default CopyText;
