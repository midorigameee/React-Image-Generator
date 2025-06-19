from PIL import Image
from ...utils.exif_utils import prepare_exif_dict
from ...models.req_exif import ReqExif


def generate_caption_from_exif(image: Image.Image, is_use_exif: bool, exif_from_req: ReqExif):
    exif_dict = prepare_exif_dict(image, exif_from_req)
    caption = ""
    
    if exif_dict["Model"] != "" and exif_dict["Model"] is not None:
        caption += to_hashtag(exif_dict["Model"])

    if exif_dict["LensModel"] != "" and exif_dict["LensModel"] is not None:
        caption += "\n"
        caption += to_hashtag(exif_dict["LensModel"])
    
    print(f"caption = {caption}")
    return caption


def to_hashtag(text):
    return "#" + text.lower().replace(" ", "").replace("-", "")