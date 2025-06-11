import piexif from "piexifjs";

/**
 * 画像ファイルを読み込み、必要に応じて縦長を1350pxまたは1080pxに縮小し、EXIF付きで返す
 */
export const resizeImageWithExif = async (file: File): Promise<File> => {
  const dataUrl = await readFileAsDataURL(file);
  const exifObj = piexif.load(dataUrl); // EXIFを抽出
  const exifBytes = piexif.dump(exifObj);

  const image = await loadImage(dataUrl);

  // 縦の長さに応じて縮小処理
  let { width, height } = image;
  let maxHeight: number | null = null;

  if (height > 1350) {
    maxHeight = 1350;
  } else if (height > 1080) {
    maxHeight = 1080;
  }

  if (!maxHeight) {
    // リサイズ不要な場合はオリジナルを返す
    return file;
  }

  const ratio = maxHeight / height;
  const newWidth = Math.round(width * ratio);
  const newHeight = maxHeight;

  // canvasでリサイズ
  const canvas = document.createElement("canvas");
  canvas.width = newWidth;
  canvas.height = newHeight;
  const ctx = canvas.getContext("2d");
  ctx?.drawImage(image, 0, 0, newWidth, newHeight);

  // canvasからJPEGデータURLを取得
  const resizedDataUrl = canvas.toDataURL("image/jpeg", 0.92);

  // EXIFを埋め込む
  const finalDataUrl = piexif.insert(exifBytes, resizedDataUrl);

  // Data URLをBlobに変換
  const blob = dataURLToBlob(finalDataUrl);

  return new File([blob], file.name, { type: "image/jpeg" });
};

// ヘルパー関数群
const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

const dataURLToBlob = (dataURL: string): Blob => {
  const byteString = atob(dataURL.split(",")[1]);
  const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];

  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
};
