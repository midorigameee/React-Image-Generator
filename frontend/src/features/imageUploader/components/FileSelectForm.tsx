import React from "react";
import "./FileSelectForm.css";

type Props = {
  handleFileChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
  /* 解説
    onChangeイベントの時は、Reactは event: React.ChangeEvent<HTMLInputElement> を
    暗黙的にpropsに渡しているため、引数として定義する必要がある。
   */
};

const FileSelectForm: React.FC<Props> = ({ handleFileChange }) => {
  return (
    <div className="file-input-form">
      <label className="custom-file-upload">
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </label>
    </div>
  );
};

export default FileSelectForm;
