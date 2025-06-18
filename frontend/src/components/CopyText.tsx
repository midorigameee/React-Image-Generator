import React from "react";
import { toast } from "react-toastify";
import "./CopyText.css";

type Props = {
  text: string;
};

const CopyText: React.FC<Props> = ({ text }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("キャプションをコピーしました！");
    } catch (err) {
      console.error("コピーに失敗しました:", err);
      toast.error("コピーに失敗しました");
    }
  };

  return (
    <div className="caption-box">
      <textarea className="caption-text" value={text} readOnly />
      <button className="caption-copy-button" onClick={handleCopy}>
        コピー
      </button>
    </div>
  );
};

export default CopyText;
