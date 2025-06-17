const findClosestOption = (value: number, options: string[]): string => {
  const parsed = options.map((opt) => parseFloat(opt.replace("f/", "")));
  let closest = parsed[0];
  let minDiff = Math.abs(closest - value);

  for (let i = 1; i < parsed.length; i++) {
    const diff = Math.abs(parsed[i] - value);
    if (diff < minDiff) {
      minDiff = diff;
      closest = parsed[i];
    }
  }
  return `f/${closest.toFixed(1)}`;
};

export const formatFNumber = (fNumber?: [number, number]): string => {
  if (!fNumber) return "";
  const numericValue = fNumber[0] / fNumber[1];
  return findClosestOption(numericValue, apertureOptions);
};

export const formatExposureTime = (
  exposureTime: [number, number] | undefined
): string => {
  if (!exposureTime) return "";
  return `${exposureTime[0]}/${exposureTime[1]}`;
};

export const formatISO = (iso: number | undefined): string => {
  return iso?.toString() || "";
};

export const apertureOptions = [
  "f/1.4",
  "f/2.0",
  "f/2.8",
  "f/4",
  "f/5.6",
  "f/8",
  "f/11",
  "f/16",
  "f/22",
];

export const shutterSpeedOptions = [
  "1/8000",
  "1/4000",
  "1/2000",
  "1/1000",
  "1/500",
  "1/250",
  "1/125",
  "1/60",
  "1/30",
  "1/15",
  "1/8",
  "1/4",
  "1/2",
  "1",
  "2",
  "4",
];

export const isoOptions = [
  "100",
  "200",
  "400",
  "800",
  "1600",
  "3200",
  "6400",
  "12800",
  "25600",
  "51200",
];
