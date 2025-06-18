import "./App.css";
import ImageUploader from "./features/imageUploader/components/ImageUploader";
import Titel from "./components/Title";
import ResultArea from "./features/imageUploader/components/ResultArea";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function App() {
  const [statusMessage, setStatusMessage] = useState<string | null>("");
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState<string | null>("");

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
          setCaption={setCaption}
        />
        <ResultArea
          statusMessage={statusMessage}
          processedImage={processedImage}
          caption={caption}
        />
      </div>
    </>
  );
}

export default App;
