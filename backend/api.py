import base64
import binascii
import io

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from pydantic import BaseModel

from backend.face_pipeline import analyze_image


app = FastAPI(title="Nexzen Skin Analysis API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app$",
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    imageData: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/analyze")
def analyze(request: AnalyzeRequest):
    try:
        encoded = request.imageData.split(",", 1)[-1]
        image = Image.open(io.BytesIO(base64.b64decode(encoded))).convert("RGB")
        return analyze_image(image)
    except (binascii.Error, ValueError, OSError) as error:
        raise HTTPException(status_code=400, detail=f"Invalid image data: {error}") from error
    except Exception as error:
        raise HTTPException(status_code=500, detail="Analysis failed") from error