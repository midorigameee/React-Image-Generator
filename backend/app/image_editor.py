from PIL import Image, ImageDraw, ImageFont
from PIL.ExifTags import TAGS
import os
from datetime import datetime


def resize_image_with_aspect_ratio(image: Image.Image, new_width: int, new_height: int) -> Image.Image:
    FRAME_WIDTH_RATE = 0.00  # フレームは画像の10%の余白を残す
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


def create_framed_image(image: Image.Image) -> Image.Image:
    # フレーム全体のサイズ
    frame_width = 1080
    frame_height = 1350
    image_area_height = 1350

    # 新しい背景画像（白背景）
    frame = Image.new("RGB", (frame_width, frame_height), color=(255, 255, 255))

    # フレームに画像を描画
    draw_image_area_on_frame(image, image_area_height, frame, frame_width, frame_height)

    return frame


def create_framed_image_with_exif(image: Image.Image) -> Image.Image:
    # フレーム全体のサイズ
    frame_width = 1080
    frame_height = 1350
    image_area_height = 1200
    text_area_height = 150

    # 新しい背景画像（白背景）
    frame = Image.new("RGB", (frame_width, frame_height), color=(255, 255, 255))

    # フレームに画像を描画
    draw_image_area_on_frame(image, image_area_height, frame, frame_width, frame_height)

    # Exif情報の抽出
    exif = extract_exif(image)
    caption = exif_dict_to_string(exif)
    print(caption)

    # テキスト描画
    draw = ImageDraw.Draw(frame)
    lines = caption.strip().split('\n')
    line_spacing: int = 30

    font = get_font()

    # 各行のサイズを測定
    line_heights = []
    max_line_width = 0
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font)
        line_width = bbox[2] - bbox[0]
        line_height = bbox[3] - bbox[1]
        line_heights.append(line_height)
        max_line_width = max(max_line_width, line_width)

    total_height = sum(line_heights) + line_spacing * (len(lines) - 1)

    # 配置領域の中心に合わせるための開始位置
    area=(0, 1200, 1080, 1350)
    area_left, area_top, area_right, area_bottom = area
    area_width = area_right - area_left
    area_height = area_bottom - area_top

    start_y = area_top + (area_height - total_height) // 2

    # 各行を描画（中央揃え）
    y = start_y
    for i, line in enumerate(lines):
        bbox = draw.textbbox((0, 0), line, font=font)
        line_width = bbox[2] - bbox[0]
        x = area_left + (area_width - line_width) // 2
        draw.text((x, y), line, font=font, fill=(0, 0, 0))
        y += line_heights[i] + line_spacing

    return frame


def get_font() -> ImageFont.FreeTypeFont:
    try:
        cd = os.getcwd()
        print("Current directory : {}".format(cd))

        font = ImageFont.truetype("./static/font/Montserrat/Montserrat-Light.ttf", 24)
    except IOError:
        print("Font is not found.")
        font = ImageFont.load_default()
    
    return font


def closest_shutter_speed(value):
    # 一般的なシャッタースピードの分母リスト
    COMMON_SHUTTER_SPEEDS = [
        8000, 6400, 5000, 4000, 3200, 2500, 2000,
        1600, 1250, 1000, 800, 640, 500, 400, 320,
        250, 200, 160, 125, 100, 80, 60, 50, 40,
        30, 25, 20, 15, 13, 10, 8, 6, 5, 4, 3,
        2, 1
    ]

    if value == 0:
        return "1/∞"
    reciprocal = 1 / value
    closest = min(COMMON_SHUTTER_SPEEDS, key=lambda x: abs(x - reciprocal))
    return f"1/{closest}s"


def format_exif_value(tag, value):
    if isinstance(value, tuple) and len(value) == 2 and value[1] != 0:
        value = value[0] / value[1]

    if tag == "FocalLength":
        return f"{int(value)}mm"
    elif tag == "ExposureTime":
        return closest_shutter_speed(value)
    else:
        return value


def extract_exif(image: Image.Image) -> str:
    wanted_tags  = ["Model", "DateTime", "FNumber", "ExposureTime", "ISOSpeedRatings", "FocalLength", "LensModel"]
    exif_dict = {}

    # EXIF 情報を取得
    exif_data = image._getexif()

    # EXIF データがある場合は表示
    if exif_data:
        for tag_id, value in exif_data.items():
            tag = TAGS.get(tag_id, tag_id)
            if tag in wanted_tags:
                exif_dict[tag] = format_exif_value(tag, value)
    else:
        print("EXIF情報がありません")

    return exif_dict


def exif_dict_to_string(exif: dict) -> str:
    lines = []

    # 日付
    if "DateTime" in exif:
        original_str = exif['DateTime']
        dt = datetime.strptime(original_str, "%Y:%m:%d %H:%M:%S")
        formatted_str = dt.strftime("%Y/%m/%d")
        lines.append(f"Shot on {formatted_str}")

    # カメラ
    camera_info = []
    if "Model" in exif:
        camera_info.append(f"{exif['Model']}")
    if "LensModel" in exif:
        camera_info.append(f"{exif['LensModel']}")
    if camera_info:
        lines.append("          ".join(camera_info))

    # 撮影情報
    capture_info = []
    if "FocalLength" in exif:
        capture_info.append(exif["FocalLength"])
    if "ExposureTime" in exif:
        capture_info.append(exif["ExposureTime"])
    if "FNumber" in exif:
        capture_info.append(f"F {exif['FNumber']}")
    if "ISOSpeedRatings" in exif:
        capture_info.append(f"ISO {exif['ISOSpeedRatings']}")
    if capture_info:
        lines.append("     ".join(capture_info))

    return "\n".join(lines)