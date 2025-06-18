from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
import json

router = APIRouter()

class ReqExif(BaseModel):
    Model: Optional[str]
    LensModel: Optional[str]
    DateTime: Optional[str]
    # 必要に応じて他の項目も追加

@router.post("/generate-caption")
async def generate_caption(
    file: UploadFile = File(...),
    show_exif: str = Form("true"),
    exif: str = Form(...)
):
    try:
        # exifデータをパース
        exif_dict = json.loads(exif)
        exif_data = ReqExif(**exif_dict)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"EXIFデータの解析に失敗しました: {str(e)}")

    # 仮のキャプション生成（本番ではもっとロジック入れる）
    caption = f"#camera {exif_data.Model or ''} \n#lens {exif_data.LensModel or ''}"

    # return { "caption": caption.strip() }
    return JSONResponse(content={"caption": caption})