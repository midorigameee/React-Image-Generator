declare module "piexifjs" {
  const piexif: {
    load: (jpegData: string) => any;
    dump: (exifObj: any) => string;
    insert: (exifStr: string, jpegData: string) => string;
    remove: (jpegData: string) => string;
    TAGS: any;
  };
  export default piexif;
}
