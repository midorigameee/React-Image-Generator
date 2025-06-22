# tests/api/test_upload_image.py
import pytest
from httpx import AsyncClient
from httpx._transports.asgi import ASGITransport
from PIL import Image
import io
import json
from app.main import app  # FastAPI appにrouterが含まれている前提

@pytest.mark.asyncio
async def test_upload_image_success():
    # 1. ダミー画像作成
    img = Image.new("RGB", (800, 600), color="blue")
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)

    # 2. ダミーEXIFデータ
    exif_dict = {
        "Model": "Nikon Zf",
        "LensModel": "Nikkor Z 40mm f/2",
        "FNumber": 2.0,
        "ExposureTime": "1/125",
        "ISOSpeedRatings": 100,
        "DateTime": "2023:06:01 10:00:00"
    }
    exif_json = json.dumps(exif_dict)

    transport = ASGITransport(app=app)

    # 3. HTTPリクエスト送信
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post(
            "/v1/upload-image",
            files={"file": ("test.jpg", buf, "image/jpeg")},
            data={
                "show_exif": "true",
                "exif": exif_json
            }
        )

    # 4. レスポンス検証
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/png"
    assert len(response.content) > 1000  # サイズチェック
