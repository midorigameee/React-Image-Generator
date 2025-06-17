/* eslint-disable @typescript-eslint/no-explicit-any */

declare module "piexifjs" {
  export const ImageIFD: {
    Model: number;
    DateTime: number;
  };

  export const ExifIFD: {
    LensModel: number;
  };

  export function load(jpegData: string): any;
  export function dump(exifObj: any): string;
  export function insert(exifStr: string, jpegData: string): string;
  export function remove(jpegData: string): string;
}
