import React from "react";
import "./Viewer.css";

type Props = {
  statusMessage: string;
  processedImage: string | null;
};

const Viewer: React.FC<Props> = ({ statusMessage, processedImage }) => {
  return (
    <>
      {statusMessage && <p className="status-message">{statusMessage}</p>}

      {processedImage && (
        <div className="image-preview">
          <img src={processedImage} alt="Processed" />
        </div>
      )}
    </>
  );
};

export default Viewer;
