import "./App.css";
import ImageUploader from "./components/ImageUploader";
import Titel from "./components/Title";

function App() {
  return (
    <>
      <div className="app-container">
        <Titel />
        <ImageUploader />
      </div>
    </>
  );
}

export default App;
