from PIL import Image, ImageDraw, ImageFont
import os


def get_font() -> ImageFont.FreeTypeFont:
    try:
        cd = os.getcwd()
        print("Current directory : {}".format(cd))

        font = ImageFont.truetype("./static/font/Montserrat/Montserrat-Light.ttf", 24)
    except IOError:
        print("Font is not found.")
        font = ImageFont.load_default()
    
    return font


def draw_test_area_on_frame(frame, caption):
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