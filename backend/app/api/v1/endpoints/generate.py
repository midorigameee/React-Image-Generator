from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from PIL import Image
from typing import Optional
import json
from app.services.caption_generatior import generate_caption_from_exif
from app.models import req_exif

router = APIRouter()

# class ReqExif(BaseModel):
#     Model: Optional[str]
#     LensModel: Optional[str]
#     DateTime: Optional[str]
#     # 必要に応じて他の項目も追加

@router.post("/generate-caption")
async def generate_caption(
    file: UploadFile = File(...),
    show_exif: str = Form("true"),
    exif: str = Form(...)
    ):
    show_exif_flag: bool = show_exif.lower() == "true"
    
    try:
        # exifデータをパース
        exif_dict = json.loads(exif)
        exif_data = req_exif.ReqExif(**exif_dict)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"EXIFデータの解析に失敗しました: {str(e)}")

    image = Image.open(file.file)
    caption = generate_caption_from_exif(image, show_exif_flag, exif_data)

    return JSONResponse(content={"caption": caption})