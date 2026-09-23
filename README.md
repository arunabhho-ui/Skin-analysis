# Nexzen Skin Analysis

Nexzen is a Next.js skin-analysis prototype with a Python inference pipeline. It captures a portrait, detects the face region, runs the trained skin-type and skin-concern models, clips condition masks to the detected face, and presents a structured report with PDF export.

## Stack

- Next.js, React, and TypeScript frontend
- Python, MediaPipe, OpenCV, and Pillow face pipeline
- EfficientNet-V2-S skin-type classifier
- U-Net with MobileNetV2 encoder for five concern masks

## Run locally

```powershell
npm install
pip install -r backend\requirements.txt
npm run dev
```

Open `http://localhost:3000` and complete a capture. The Next.js `/api/analyze` route launches `backend/face_pipeline.py` and loads the checkpoints from `models/`.

## Model artifacts

The trained checkpoints are expected at:

- `models/best_skin_type_efficientnet_v2_s.pth`
- `models/best_model2_unet_mobilenetv2.pth`

## Build

```powershell
npm run build
```