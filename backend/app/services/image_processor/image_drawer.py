from PIL import Image


def resize_image_with_aspect_ratio(image: Image.Image, new_width: int, new_height: int) -> Image.Image:
    original_width, original_height = image.size

    if original_height > original_width:
        # 縦長の場合、縦幅を基準にサイズ変更する
        ratio = new_height / original_height
        new_width = int(original_width * ratio)
    else:
        # 横長または正方形の場合、横幅を基準にサイズ変更する
        ratio = new_width / original_width
        new_height = int(original_height * ratio)

    resized_image = image.resize((new_width, new_height), Image.LANCZOS)
    return resized_image


def draw_image_area_on_frame(image, image_area_height, frame, frame_width, frame_height):
    # 元画像を縮小
    resized_image = resize_image_with_aspect_ratio(image, frame_width, image_area_height)

    # 画像をフレーム内の画像エリアに配置（中央寄せ）
    img_x = (frame_width - resized_image.width) // 2
    img_y = (image_area_height - resized_image.height) // 2
    frame.paste(resized_image, (img_x, img_y))