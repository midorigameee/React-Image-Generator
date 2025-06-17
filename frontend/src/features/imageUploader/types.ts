export type ExifData = {
  Model: string;
  LensModel: string;
  DateTime: string;
  FNumber?: [number, number] | undefined;
  ExposureTime?: [number, number] | undefined;
  ISOSpeedRatings?: number | undefined;
};
