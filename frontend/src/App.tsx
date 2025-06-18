import "./App.css";
import ImageUploader from "./features/imageUploader/components/ImageUploader";
import Titel from "./components/Title";
import Viewer from "./features/imageUploader/components/ResultArea";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function App() {
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>("");

  return (
    <>
      <div className="app-container">
        <ToastContainer
          position="top-center"
          autoClose={1000}
          hideProgressBar
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
        />
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
