import React from "react";
import "./ResultArea.css";
import CopyText from "../../../components/CopyText";
import StatusMessage from "../../../components/StatusMessage";
import ImageViewer from "../../../components/ImageViewer";

type Props = {
  statusMessage: string | null;
  processedImage: string | null;
  caption: string | null;
};

const ResultArea: React.FC<Props> = ({
  statusMessage,
  processedImage,
  caption,
}) => {
  // const captionRaw = "#nikon \\n#nikonzf \\n#nikkorz40mmf2";
  // const caption = captionRaw.replace(/\\n/g, "\n");

  return (
    <>
      <StatusMessage statusMessage={statusMessage} />

      {processedImage && (
        <>
          <ImageViewer processedImage={processedImage} />
          <CopyText caption={caption} />
        </>
      )}
    </>
  );
};

export default ResultArea;
