import React from "react";
import type { ExifData } from "../types";
import "./ShowExifIInfo.css";

type Props = {
  showExif: boolean;
  exifData: ExifData | null;
  setExifData: React.Dispatch<React.SetStateAction<ExifData | null>>;
};

const ShowExifIInfo: React.FC<Props> = ({
  showExif,
  exifData,
  setExifData,
}) => {
  return (
    <>
      {showExif && exifData && (
        <div className="exif-container">
          <div className="exif-item">
            <span>Camera : </span>
            <input
              type="text"
              value={exifData.Model}
              onChange={(e) =>
                setExifData({ ...exifData, Model: e.target.value })
              }
            />
          </div>
          <div className="exif-item">
            <span>Lens : </span>
            <input
              type="text"
              value={exifData.LensModel}
              onChange={(e) =>
                setExifData({ ...exifData, LensModel: e.target.value })
              }
            />
          </div>
          <div className="exif-item">
            <span>Date : </span>
            <input
              type="text"
              value={exifData.DateTime}
              onChange={(e) =>
                setExifData({ ...exifData, DateTime: e.target.value })
              }
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ShowExifIInfo;
