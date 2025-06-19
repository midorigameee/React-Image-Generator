from pydantic import BaseModel


class ReqExif(BaseModel):
    Model: str
    LensModel: str
    DateTime: str