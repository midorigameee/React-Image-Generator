from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import io, os
from PIL import Image
from . import image_editor

app = FastAPI()
ALLOW_ORIGIN = os.environ['ALLOW_ORIGIN']
# ALLOW_ORIGIN = "http://localhost:3000"

app.add_middleware(
    CORSMiddleware,
    # allow_origins=["http://localhost:3000", ALLOW_ORIGIN],  # ReactのURL
    allow_origins=["*"],  # ReactのURL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    image = Image.open(file.file)
    
    exif = image_editor.extract_exif(image)
    caption = image_editor.exif_dict_to_string(exif)
    print(caption)
    edited_image = image_editor.create_framed_image(image, caption)

    buffer = io.BytesIO()
    edited_image.save(buffer, format="PNG")
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="image/png")


@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}