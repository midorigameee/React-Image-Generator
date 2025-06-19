import "./ImageViewer.css";

type Props = {
  processedImage: string;
};

const ImageViewer: React.FC<Props> = ({ processedImage }) => {
  return (
    <>
      <div className="image-preview">
        <img src={processedImage} alt="Processed" />
      </div>
    </>
  );
};

export default ImageViewer;
