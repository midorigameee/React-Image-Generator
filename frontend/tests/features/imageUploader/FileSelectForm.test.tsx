// tests/components/FileSelectForm.test.tsx
import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import FileSelectForm from "../../../src/features/imageUploader/components/FileSelectForm";

// extractExifDataFromFile をモック
jest.mock("../../imageUtils", () => ({
  extractExifDataFromFile: jest.fn().mockResolvedValue({
    Model: "Test Camera",
    LensModel: "Test Lens",
    FNumber: 2.8,
    ExposureTime: "1/125",
    ISOSpeedRatings: 100,
    DateTimeOriginal: "2023:06:01 10:00:00",
  }),
}));

describe("FileSelectForm", () => {
  const setSelectedFile = jest.fn();
  const setProcessedImage = jest.fn();
  const setStatusMessage = jest.fn();
  const setExifData = jest.fn();

  const setup = () => {
    render(
      <FileSelectForm
        setSelectedFile={setSelectedFile}
        setProcessedImage={setProcessedImage}
        setStatusMessage={setStatusMessage}
        setExifData={setExifData}
      />
    );
    return screen.getByLabelText(/file/i) || screen.getByRole("textbox");
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("JPEG以外のファイルを選択したら警告を出す", async () => {
    const input = setup();
    const file = new File(["dummy"], "test.png", { type: "image/png" });

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(setStatusMessage).toHaveBeenCalledWith(
        "JPEG画像（.jpg / .jpeg）のみアップロードできます。"
      );
      expect(setSelectedFile).toHaveBeenCalledWith(null);
    });
  });

  it("JPEGファイルを選択したらexif取得と状態更新が行われる", async () => {
    const input = setup();
    const file = new File(["dummy"], "test.jpg", { type: "image/jpeg" });

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(setSelectedFile).toHaveBeenCalledWith(file);
      expect(setExifData).toHaveBeenCalledWith(
        expect.objectContaining({ Model: "Test Camera" })
      );
      expect(setProcessedImage).toHaveBeenCalledWith(null);
      expect(setStatusMessage).toHaveBeenCalledWith("");
    });
  });
});
