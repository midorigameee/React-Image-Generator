import pytest
import io
import json
from PIL import Image
from httpx import AsyncClient
from httpx._transports.asgi import ASGITransport

from app.main import app

@pytest.mark.asyncio
async def test_generate_caption_success():
    # 1. ダミー画像を作成
    img = Image.new("RGB", (800, 600), color="green")
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)

    # 2. ダミーEXIFデータ
    exif_dict = {
        "Model": "Fujifilm X-T5",
        "LensModel": "XF23mmF2 R WR",
        "DateTime": "2024:06:01 12:34:56"
    }
    exif_json = json.dumps(exif_dict)

    # 3. テストクライアント作成
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post(
            "/v1/generate-caption",  # ルーターにprefixをつけている前提
            files={"file": ("test.jpg", buf, "image/jpeg")},
            data={
                "show_exif": "true",
                "exif": exif_json
            }
        )

    # 4. レスポンス検証
    assert response.status_code == 200
    json_data = response.json()
    assert "caption" in json_data
    assert isinstance(json_data["caption"], str)
    assert len(json_data["caption"]) > 0  # 文字列が返っていること