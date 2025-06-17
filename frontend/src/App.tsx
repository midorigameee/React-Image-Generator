import "./App.css";
import ImageUploader from "./features/imageUploader/components/ImageUploader";
import Titel from "./components/Title";
import Viewer from "./components/Viewer";
import { useState } from "react";

function App() {
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>("");

  return (
    <>
      <div className="app-container">
        <Titel />
        <ImageUploader
          setProcessedImage={setProcessedImage}
          setStatusMessage={setStatusMessage}
        />
        <Viewer statusMessage={statusMessage} processedImage={processedImage} />
      </div>
    </>
  );
}

export default App;
