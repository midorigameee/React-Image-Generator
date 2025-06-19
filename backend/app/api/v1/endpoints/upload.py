from fastapi import FastAPI, File, UploadFile, Form, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import io
from PIL import Image
import json
from pydantic import BaseModel
from app.services.image_processor import frame_composer
from app.models import req_exif


router = APIRouter()


@router.post("/upload-image")
async def upload_image(
        file: UploadFile = File(...),
        show_exif: str = Form("true"),  # ← str型で受け取る
        exif: str = Form(...)
    ):
    show_exif_flag: bool = show_exif.lower() == "true"

    # exif JSON文字列をパースしてPydanticモデルに変換
    try:
        exif_dict = json.loads(exif)        # 辞書型に変換（exif_dict["Model"] → Modelがないとエラー）
        exif_data = req_exif.ReqExif(**exif_dict)    # ReqExifを継承したクラスに変換（exif.Model → Modelがあることが保証されている）
        print(f"exif_data:{exif_data}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"EXIFデータのパースに失敗しました: {str(e)}")

    image = Image.open(file.file)
    edited_image = frame_composer.create_framed_image(image, show_exif_flag, exif_data)

    buffer = io.BytesIO()
    edited_image.save(buffer, format="PNG")
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="image/png")