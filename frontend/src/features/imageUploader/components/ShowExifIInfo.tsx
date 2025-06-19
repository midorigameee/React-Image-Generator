// import React, { useEffect, useState } from "react";
import type { ExifData } from "../types";
import "./ShowExifIInfo.css";
// import Dropdown from "../../../components/Dropdown";
// import {
//   formatFNumber,
//   formatExposureTime,
//   formatISO,
//   apertureOptions,
//   shutterSpeedOptions,
//   isoOptions,
// } from "../exifUtils";

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
  // const [aperture, setAperture] = useState("");
  // const [shutterSpeed, setShutterSpeed] = useState("");
  // const [iso, setIso] = useState("");

  // exifDataが更新されたら、Dropdown初期値に反映
  // useEffect(() => {
  //   if (exifData) {
  //     setAperture(formatFNumber(exifData.FNumber));
  //     setShutterSpeed(formatExposureTime(exifData.ExposureTime));
  //     setIso(formatISO(exifData.ISOSpeedRatings));
  //   }
  // }, [exifData]);

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
          {/* <div>
            <Dropdown
              label="F値"
              options={apertureOptions}
              value={aperture}
              onChange={setAperture}
            />
            <Dropdown
              label="SS"
              options={shutterSpeedOptions}
              value={shutterSpeed}
              onChange={setShutterSpeed}
            />
            <Dropdown
              label="ISO"
              options={isoOptions}
              value={iso}
              onChange={setIso}
            />
          </div> */}
        </div>
      )}
    </>
  );
};

export default ShowExifIInfo;
