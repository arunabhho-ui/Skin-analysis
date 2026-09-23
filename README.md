# Nexzen Skin Analysis

Nexzen is a Next.js skin-analysis prototype with a Python inference pipeline. It captures a portrait, detects the face region, runs the trained skin-type and skin-concern models, clips condition masks to the detected face, and presents a structured report with PDF export.

## Stack

- Next.js, React, and TypeScript frontend
- Python, MediaPipe, OpenCV, and Pillow face pipeline
- EfficientNet-V2-S skin-type classifier
- U-Net with MobileNetV2 encoder for five concern masks

## Run locally

For a Windows demo, install Python 3.12 and Node.js LTS once, then double-click `START.bat`. It creates `.venv`, installs the Python and Node dependencies, starts the FastAPI model backend and Next.js frontend, and opens the app at `http://localhost:3000`.

The first startup can take several minutes because PyTorch and the other model dependencies are downloaded. Later starts reuse the installed environment.

For manual startup:

```powershell
npm install
python -m venv .venv
.venv\Scripts\activate
pip install -r backend\requirements.txt
uvicorn backend.api:app --host 127.0.0.1 --port 8000
```

In a second terminal, set the local API URL and start the frontend:

```powershell
$env:NEXT_PUBLIC_ANALYSIS_API_URL="http://127.0.0.1:8000/analyze"
npm run dev
```

Open `http://localhost:3000` and complete a capture. The local FastAPI service loads the checkpoints from `models/`.

## Model artifacts

The trained checkpoints are expected at:

- `models/best_skin_type_efficientnet_v2_s.pth`
- `models/best_model2_unet_mobilenetv2.pth`

## Build

```powershell
npm run build
```