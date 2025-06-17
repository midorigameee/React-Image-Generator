from PIL import Image
from .image_drawer import draw_image_area_on_frame
from .text_drawer import draw_text_area_on_frame
from .exif_utils import prepare_exif
from .types import ReqExif


def create_framed_image(image: Image.Image, is_use_exif: bool, exif_from_req: ReqExif) -> Image.Image:
    # フレーム全体のサイズ
    frame_width = 1080
    frame_height = 1350
    if is_use_exif:    
        image_area_height = 1200
        text_area_height = 150
    else:
        image_area_height = 1350
        text_area_height = 0 

    # 新しい背景画像（白背景）
    frame = Image.new("RGB", (frame_width, frame_height), color=(255, 255, 255))

    # フレームに画像を描画
    draw_image_area_on_frame(image, image_area_height, frame, frame_width, frame_height)

    if is_use_exif:
        exif = prepare_exif(image, exif_from_req)

        print(exif)
        draw_text_area_on_frame(frame, exif)

    return frame