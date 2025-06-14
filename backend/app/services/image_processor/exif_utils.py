from PIL import Image
from PIL.ExifTags import TAGS
from datetime import datetime


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

    return exif_dict_to_string(exif_dict)


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