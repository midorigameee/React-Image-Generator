from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import upload
from app.api.v1.endpoints import generate
from app.core.config import get_allow_origin_list


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allow_origin_list(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/v1")
app.include_router(generate.router, prefix="/v1")

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}