from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import io, os
from PIL import Image
from . import image_editor
from typing import Annotated


ALLOW_ORIGIN_LIST = ["http://localhost:3000"]

try:
    origin = os.environ.get('ALLOW_ORIGIN')
    if origin:
        ALLOW_ORIGIN_LIST.append(origin)
    print(f"ALLOW_ORIGIN : {ALLOW_ORIGIN_LIST}")
except Exception as e:
    print("ALLOW_ORIGIN is not found.")
    print(e)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOW_ORIGIN_LIST,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/upload-image")
async def upload_image(
        file: UploadFile = File(...),
        show_exif: str = Form("true")  # ← str型で受け取る
    ):
    show_exif_flag = show_exif.lower() == "true"

    image = Image.open(file.file)
    
    if show_exif_flag:
        edited_image = image_editor.create_framed_image_with_exif(image)
    else:
        edited_image = image_editor.create_framed_image(image)

    buffer = io.BytesIO()
    edited_image.save(buffer, format="PNG")
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="image/png")


@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}