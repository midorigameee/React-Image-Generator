from fastapi import FastAPI, File, UploadFile, Form, APIRouter
from fastapi.responses import StreamingResponse
import io
from PIL import Image
from  app.services.image_processor import frame_composer


router = APIRouter()


@router.post("/upload-image")
async def upload_image(
        file: UploadFile = File(...),
        show_exif: str = Form("true")  # ← str型で受け取る
    ):
    show_exif_flag: bool = show_exif.lower() == "true"

    image = Image.open(file.file)
    edited_image = frame_composer.create_framed_image(image, show_exif_flag)

    buffer = io.BytesIO()
    edited_image.save(buffer, format="PNG")
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="image/png")