import json
import math
import os
import sys
from functools import lru_cache
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
import torch
import torch.nn as nn
from torchvision import models, transforms
import segmentation_models_pytorch as smp

try:
    import mediapipe as mp
except Exception:  # pragma: no cover
    mp = None


FACE_ZONE_DEFS = {
    "forehead": [10, 109, 67, 103, 54, 21, 162, 338, 297, 332, 284, 251, 389, 9, 8, 168, 6],
    "nose": [168, 6, 197, 195, 5, 4, 1, 19, 94, 2, 98, 327, 236, 3, 51, 45, 275, 281, 44],
    "chin": [18, 175, 199, 200, 208, 428, 152, 377, 400, 378, 379, 365, 397, 288],
    "left_cheek": [117, 118, 101, 36, 205, 187, 123, 50, 207, 216],
    "right_cheek": [346, 347, 330, 266, 425, 411, 352, 280, 427, 436],
    "left_undereye": [226, 110, 24, 23, 22, 26, 112, 243, 244, 189],
    "right_undereye": [446, 339, 254, 253, 252, 256, 341, 463, 464, 413],
}

FACE_OVAL = list({idx for group in [
    list(set(i for pair in mp.solutions.face_mesh.FACEMESH_FACE_OVAL for i in pair)) if mp is not None else []
] for idx in group})

LEFT_EYE = list({idx for group in [
    list(set(i for pair in mp.solutions.face_mesh.FACEMESH_LEFT_EYE for i in pair)) if mp is not None else []
] for idx in group})
RIGHT_EYE = list({idx for group in [
    list(set(i for pair in mp.solutions.face_mesh.FACEMESH_RIGHT_EYE for i in pair)) if mp is not None else []
] for idx in group})
LEFT_EYEBROW = list({idx for group in [
    list(set(i for pair in mp.solutions.face_mesh.FACEMESH_LEFT_EYEBROW for i in pair)) if mp is not None else []
] for idx in group})
RIGHT_EYEBROW = list({idx for group in [
    list(set(i for pair in mp.solutions.face_mesh.FACEMESH_RIGHT_EYEBROW for i in pair)) if mp is not None else []
] for idx in group})
LIPS = list({idx for group in [
    list(set(i for pair in mp.solutions.face_mesh.FACEMESH_LIPS for i in pair)) if mp is not None else []
] for idx in group})

FACE_MESH_GROUPS = {
    "face_oval": FACE_OVAL,
    "left_eye": LEFT_EYE,
    "right_eye": RIGHT_EYE,
    "left_eyebrow": LEFT_EYEBROW,
    "right_eyebrow": RIGHT_EYEBROW,
    "lips": LIPS,
}

CONCERN_DEFS = {
    "pores": {
        "label": "Enlarged pores",
        "color": "#C98B72",
        "zones": ["left_cheek", "right_cheek"],
    },
    "wrinkles": {
        "label": "Fine lines & micro-wrinkles",
        "color": "#8E8276",
        "zones": ["forehead", "left_undereye", "right_undereye"],
    },
    "blackheads": {
        "label": "Blackheads (Comedones)",
        "color": "#5F7065",
        "zones": ["nose"],
    },
    "whiteheads": {
        "label": "Whiteheads (Closed Comedones)",
        "color": "#B3A596",
        "zones": ["chin"],
    },
    "inflammatory_acne": {
        "label": "Inflammatory acne",
        "color": "#C36F65",
        "zones": ["left_cheek", "right_cheek", "chin"],
    },
}

MODEL_DIR = Path(__file__).resolve().parent.parent / "models"
SKIN_MODEL_PATH = MODEL_DIR / "best_skin_type_efficientnet_v2_s.pth"
CONCERN_MODEL_PATH = MODEL_DIR / "best_model2_unet_mobilenetv2.pth"
SKIN_CLASSES = ["combination", "dry", "normal", "oily"]
CONCERN_CLASSES = ["wrinkles", "pores", "blackheads", "whiteheads", "inflammatory_acne"]
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

SKIN_TRANSFORM = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])


def clamp(v, lo, hi):
    return max(lo, min(v, hi))


def landmarks_to_points(landmarks, indices, width, height):
    pts = []
    for idx in indices:
        if idx >= len(landmarks):
            continue
        lm = landmarks[idx]
        pts.append([int(lm.x * width), int(lm.y * height)])
    return np.array(pts, dtype=np.int32)


def polygon_mask(points, width, height):
    mask = np.zeros((height, width), dtype=np.uint8)
    if len(points) >= 3:
        hull = cv2.convexHull(points)
        cv2.fillConvexPoly(mask, hull, 255)
    return mask


def build_face_mask(landmarks, width, height):
    face_pts = landmarks_to_points(landmarks, FACE_OVAL, width, height)
    if len(face_pts) < 3:
        return np.zeros((height, width), dtype=np.uint8)

    mask = polygon_mask(face_pts, width, height)
    for group_name in ["left_eye", "right_eye", "left_eyebrow", "right_eyebrow", "lips"]:
        group = FACE_MESH_GROUPS.get(group_name, [])
        if not group:
            continue
        pts = landmarks_to_points(landmarks, group, width, height)
        if len(pts) < 3:
            continue
        feature_mask = polygon_mask(pts, width, height)
        kernel = np.ones((4, 4), np.uint8)
        feature_mask = cv2.dilate(feature_mask, kernel, iterations=1)
        mask = cv2.bitwise_and(mask, cv2.bitwise_not(feature_mask))
    return mask


def combine_zone_masks(zones, width, height):
    merged = np.zeros((height, width), dtype=np.uint8)
    for name in zones:
        mask = zones[name]
        if mask is None:
            continue
        merged = cv2.bitwise_or(merged, mask)
    return merged


def build_zone_masks(landmarks, skin_mask, width, height):
    zones = {}
    for name, indices in FACE_ZONE_DEFS.items():
        pts = landmarks_to_points(landmarks, indices, width, height)
        mask = polygon_mask(pts, width, height)
        zones[name] = cv2.bitwise_and(mask, skin_mask)
    return zones


def mask_to_polygon(mask, width, height):
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    if not contours:
        return []
    contour = max(contours, key=cv2.contourArea)
    if cv2.contourArea(contour) < 10:
        return []
    pts = contour.reshape(-1, 2)
    normalized = [{"x": float(x) / width, "y": float(y) / height} for x, y in pts]
    if len(normalized) < 3:
        return []
    return normalized


def mask_to_polygons(mask, width, height):
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    polygons = []
    for contour in sorted(contours, key=cv2.contourArea, reverse=True):
        if cv2.contourArea(contour) < 10:
            continue
        points = contour.reshape(-1, 2)
        polygon = [{"x": float(x) / width, "y": float(y) / height} for x, y in points]
        if len(polygon) >= 3:
            polygons.append(polygon)
    return polygons


@lru_cache(maxsize=1)
def load_models():
    if not SKIN_MODEL_PATH.exists() or not CONCERN_MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Model checkpoints not found in {MODEL_DIR}: "
            f"{SKIN_MODEL_PATH.name}, {CONCERN_MODEL_PATH.name}"
        )

    skin_checkpoint = torch.load(SKIN_MODEL_PATH, map_location=DEVICE, weights_only=False)
    skin_model = models.efficientnet_v2_s(weights=None)
    skin_model.classifier[1] = nn.Linear(skin_model.classifier[1].in_features, len(SKIN_CLASSES))
    skin_model.load_state_dict(skin_checkpoint["model_state_dict"])
    skin_model.to(DEVICE).eval()

    concern_checkpoint = torch.load(CONCERN_MODEL_PATH, map_location=DEVICE, weights_only=False)
    concern_model = smp.Unet(
        encoder_name="mobilenet_v2",
        encoder_weights=None,
        in_channels=3,
        classes=len(CONCERN_CLASSES),
        activation=None,
    )
    concern_model.load_state_dict(concern_checkpoint["model_state_dict"])
    concern_model.to(DEVICE).eval()
    return skin_model, concern_model


def run_model_inference(image, face_mask):
    skin_model, concern_model = load_models()
    image_rgb = image.convert("RGB")

    with torch.inference_mode():
        skin_input = SKIN_TRANSFORM(image_rgb).unsqueeze(0).to(DEVICE)
        skin_probabilities = torch.softmax(skin_model(skin_input), dim=1)[0].cpu().numpy()

        concern_input = transforms.ToTensor()(image_rgb).unsqueeze(0).to(DEVICE)
        concern_probabilities = torch.sigmoid(concern_model(concern_input))[0].cpu().numpy()

    skin_index = int(np.argmax(skin_probabilities))
    skin_type = {
        "label": SKIN_CLASSES[skin_index],
        "confidence": round(float(skin_probabilities[skin_index]), 3),
    }

    output_height, output_width = concern_probabilities.shape[1:]
    resized_face_mask = cv2.resize(face_mask, (output_width, output_height), interpolation=cv2.INTER_NEAREST)
    concerns = []
    for channel_index, concern_id in enumerate(CONCERN_CLASSES):
        probability = concern_probabilities[channel_index]
        predicted_mask = (probability >= 0.5).astype(np.uint8) * 255
        predicted_mask = cv2.bitwise_and(predicted_mask, resized_face_mask)
        polygons = mask_to_polygons(predicted_mask, image.width, image.height)
        if not polygons:
            continue

        face_pixels = max(cv2.countNonZero(resized_face_mask), 1)
        concern_pixels = cv2.countNonZero(predicted_mask)
        coverage = concern_pixels / face_pixels
        max_probability = float(np.max(probability[predicted_mask > 0])) if concern_pixels else 0.0
        confidence = clamp(max_probability * 0.8 + min(coverage * 2.0, 0.2), 0.0, 0.99)
        config = CONCERN_DEFS[concern_id]
        concerns.append({
            "id": concern_id,
            "label": config["label"],
            "confidence": round(confidence, 3),
            "color": config["color"],
            "mask": {"regions": polygons},
        })

    concerns.sort(key=lambda item: item["confidence"], reverse=True)
    return skin_type, concerns


def extract_face_from_landmarks(image):
    # Return face mask and zone masks
    img = np.array(image)
    h, w = img.shape[:2]
    rgb = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    rgb = cv2.cvtColor(rgb, cv2.COLOR_BGR2RGB)

    if mp is None:
        face_mask = np.zeros((h, w), dtype=np.uint8)
        center_x, center_y = w // 2, h // 2
        cv2.ellipse(face_mask, (center_x, int(h * 0.52)), (int(w * 0.28), int(h * 0.38)), 0, 0, 360, 255, -1)
        return face_mask, {}

    face_mesh = mp.solutions.face_mesh.FaceMesh(
        static_image_mode=True,
        max_num_faces=1,
        refine_landmarks=True,
        min_detection_confidence=0.5,
    )
    results = face_mesh.process(rgb)
    face_mesh.close()

    if not results.multi_face_landmarks:
        face_mask = np.zeros((h, w), dtype=np.uint8)
        center_x, center_y = w // 2, h // 2
        cv2.ellipse(face_mask, (center_x, int(h * 0.52)), (int(w * 0.28), int(h * 0.38)), 0, 0, 360, 255, -1)
        return face_mask, {}

    landmarks = results.multi_face_landmarks[0].landmark
    face_mask = build_face_mask(landmarks, w, h)
    zone_masks = build_zone_masks(landmarks, face_mask, w, h)
    return face_mask, zone_masks


def build_face_polygon(face_mask):
    polygon = mask_to_polygon(face_mask, face_mask.shape[1], face_mask.shape[0])
    return {"regions": [polygon] if polygon else []}


def build_recommendations(skin_type, concerns):
    recommendations = []
    ingredient_map = {
        "dry": {"ingredient": "Ceramide + hyaluronic acid", "rationale": "Replenishes barrier lipids and restores hydration."},
        "oily": {"ingredient": "Niacinamide (2–5%)", "rationale": "Helps regulate excess sebum and support pore balance."},
        "pores": {"ingredient": "Niacinamide (2–5%)", "rationale": "Reduces visible pore size and helps stabilize oil production."},
        "wrinkles": {"ingredient": "Topical retinoids", "rationale": "Encourages skin renewal and supports collagen synthesis."},
        "inflammatory_acne": {"ingredient": "Benzoyl peroxide + retinoid", "rationale": "Targets inflamed lesions and supports clearer skin turnover."},
        "blackheads": {"ingredient": "Salicylic acid (BHA)", "rationale": "Helps decongest follicles and reduce comedones."},
        "whiteheads": {"ingredient": "Salicylic acid (BHA)", "rationale": "Helps dissolve clogged follicles and normalize turnover."},
    }

    if skin_type["label"] == "dry":
        recommendations.append({
            "concernId": "skin_type_dry",
            **ingredient_map["dry"],
        })
    elif skin_type["label"] == "oily":
        recommendations.append({
            "concernId": "skin_type_oily",
            **ingredient_map["oily"],
        })

    for concern in concerns:
        key = concern["id"]
        if key in ingredient_map:
            recommendations.append({
                "concernId": key,
                **ingredient_map[key],
            })

    return recommendations[:4]


def build_aging_signals(concerns):
    wrinkle = next((item for item in concerns if item["id"] == "wrinkles"), None)
    if wrinkle is None:
        return []
    return [{"id": "wrinkles", "label": "Wrinkles", "confidence": wrinkle["confidence"]}]


def main():
    if len(sys.argv) < 3:
        raise SystemExit("Usage: python face_pipeline.py <input_image> <output_json>")

    input_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2])

    image = Image.open(input_path).convert("RGB")
    face_mask, zone_masks = extract_face_from_landmarks(image)

    if face_mask is None or face_mask.size == 0:
        face_mask = np.zeros((image.height, image.width), dtype=np.uint8)
        cv2.ellipse(face_mask, (image.width // 2, image.height // 2), (max(30, image.width // 3), max(40, image.height // 2)), 0, 0, 360, 255, -1)

    skin_type, concerns = run_model_inference(image, face_mask)
    recommendations = build_recommendations(skin_type, concerns)
    aging = build_aging_signals(concerns)
    face_polygon = build_face_polygon(face_mask)

    report = {
        "faceMask": face_polygon,
        "skinType": skin_type,
        "concerns": concerns,
        "aging": aging,
        "recommendations": recommendations,
        "timestamp": __import__("datetime").datetime.utcnow().isoformat() + "Z",
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(report), encoding="utf-8")


if __name__ == "__main__":
    main()
