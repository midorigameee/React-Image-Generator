import React from "react";
import "./ResultArea.css";
import CopyText from "../../../components/CopyText";
import StatusMessage from "../../../components/StatusMessage";
import ImageViewer from "../../../components/ImageViewer";

type Props = {
  statusMessage: string | null;
  processedImage: string | null;
};

const Viewer: React.FC<Props> = ({ statusMessage, processedImage }) => {
  const captionRaw = "#nikon \\n#nikonzf \\n#nikkorz40mmf2";
  const caption = captionRaw.replace(/\\n/g, "\n");

  return (
    <>
      <StatusMessage statusMessage={statusMessage} />

      {processedImage && (
        <>
          <ImageViewer processedImage={processedImage} />
          <CopyText text={caption} />
        </>
      )}
    </>
  );
};

export default Viewer;
