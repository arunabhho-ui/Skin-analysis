"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export type AlignmentStatus =
  | "initializing"
  | "searching"
  | "too_far"
  | "too_close"
  | "not_centered"
  | "aligned"
  | "unavailable";

export interface FaceDetectionResult {
  faceDetected: boolean;
  alignmentStatus: AlignmentStatus;
  guidanceText: string;
  alignmentScore: number; // 0 to 1
  isReady: boolean;
}

export function useFaceDetector(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const [result, setResult] = useState<FaceDetectionResult>({
    faceDetected: false,
    alignmentStatus: "initializing",
    guidanceText: "Initializing optical detector...",
    alignmentScore: 0,
    isReady: false,
  });

  const detectorRef = useRef<any>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastDetectionTimeRef = useRef<number>(0);
  const isMountedRef = useRef<boolean>(true);

  // Initialize MediaPipe FaceDetector
  useEffect(() => {
    isMountedRef.current = true;
    let isCancelled = false;

    async function initDetector() {
      try {
        const { FaceDetector, FilesetResolver } = await import("@mediapipe/tasks-vision");
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        if (isCancelled) return;

        const detector = await FaceDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
        });

        if (isCancelled) return;

        detectorRef.current = detector;
        if (isMountedRef.current) {
          setResult((prev) => ({
            ...prev,
            isReady: true,
            alignmentStatus: "searching",
            guidanceText: "Position your face within the oval",
          }));
        }
      } catch (err) {
        console.warn("MediaPipe initialization notice: Falling back to manual capture.", err);
        if (isMountedRef.current) {
          setResult((prev) => ({
            ...prev,
            isReady: false,
            alignmentStatus: "unavailable",
            guidanceText: "Align your face in the oval and press capture",
          }));
        }
      }
    }

    initDetector();

    return () => {
      isCancelled = true;
      isMountedRef.current = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      try {
        detectorRef.current?.close();
      } catch (e) {
        // ignore cleanup error
      }
    };
  }, []);

  // Frame processing loop
  const processFrame = useCallback(() => {
    const video = videoRef.current;
    const detector = detectorRef.current;

    if (!video || !detector || video.readyState < 2 || video.paused) {
      animFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const now = performance.now();
    // Run detection roughly every 100ms (10fps) for optimal performance without heating up device
    if (now - lastDetectionTimeRef.current < 100) {
      animFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }
    lastDetectionTimeRef.current = now;

    try {
      const detections = detector.detectForVideo(video, now);
      const faces = detections?.detections || [];

      if (faces.length === 0) {
        setResult((prev) => ({
          ...prev,
          faceDetected: false,
          alignmentStatus: "searching",
          guidanceText: "Position your face within the oval",
          alignmentScore: 0,
        }));
      } else {
        const primaryFace = faces[0];
        const box = primaryFace.boundingBox;

        if (!box) {
          animFrameRef.current = requestAnimationFrame(processFrame);
          return;
        }

        const videoW = video.videoWidth || 640;
        const videoH = video.videoHeight || 480;

        // Note: For mirrored video, the horizontal coordinate is inverted
        const boxCenterX = (box.originX + box.width / 2) / videoW;
        const boxCenterY = (box.originY + box.height / 2) / videoH;
        const faceWidthRatio = box.width / videoW;

        // Optimal oval center: 0.50 X, 0.46 Y
        // Tolerance: X in [0.38, 0.62], Y in [0.35, 0.60]
        // Face width ratio: optimal ~0.35 - 0.55
        const isCenteredX = boxCenterX >= 0.38 && boxCenterX <= 0.62;
        const isCenteredY = boxCenterY >= 0.33 && boxCenterY <= 0.60;
        const isTooFar = faceWidthRatio < 0.28;
        const isTooClose = faceWidthRatio > 0.65;

        if (isTooFar) {
          setResult((prev) => ({
            ...prev,
            faceDetected: true,
            alignmentStatus: "too_far",
            guidanceText: "Move slightly closer to the camera",
            alignmentScore: 0.35,
          }));
        } else if (isTooClose) {
          setResult((prev) => ({
            ...prev,
            faceDetected: true,
            alignmentStatus: "too_close",
            guidanceText: "Step back slightly from the camera",
            alignmentScore: 0.45,
          }));
        } else if (!isCenteredX || !isCenteredY) {
          setResult((prev) => ({
            ...prev,
            faceDetected: true,
            alignmentStatus: "not_centered",
            guidanceText: "Center your face inside the guide",
            alignmentScore: 0.6,
          }));
        } else {
          // Perfectly aligned
          setResult((prev) => ({
            ...prev,
            faceDetected: true,
            alignmentStatus: "aligned",
            guidanceText: "Holding steady for capture...",
            alignmentScore: 1.0,
          }));
        }
      }
    } catch (err) {
      // transient detection error
    }

    animFrameRef.current = requestAnimationFrame(processFrame);
  }, [videoRef]);

  useEffect(() => {
    if (result.isReady) {
      animFrameRef.current = requestAnimationFrame(processFrame);
    }
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [result.isReady, processFrame]);

  return result;
}
