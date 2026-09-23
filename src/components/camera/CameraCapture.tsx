"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useFaceDetector } from "@/hooks/useFaceDetector";
import { playSoftShutterSound } from "@/lib/audio";
import { Button } from "@/components/ui/Button";
import { CameraPermissionDenied } from "./CameraPermissionDenied";
import { Camera, Sparkles, Upload, SwitchCamera, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string) => void;
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [shutterFlash, setShutterFlash] = useState(false);
  const [autoCaptureProgress, setAutoCaptureProgress] = useState(0); // 0 to 1

  const { faceDetected, alignmentStatus, guidanceText, isReady } = useFaceDetector(videoRef);

  const alignedStartTimeRef = useRef<number | null>(null);
  const hasCapturedRef = useRef<boolean>(false);

  // Initialize Camera Stream
  const startCamera = useCallback(async () => {
    setPermissionError(null);
    hasCapturedRef.current = false;
    setAutoCaptureProgress(0);

    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 960 },
          facingMode: "user",
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setPermissionError(
          "Camera permissions were declined. Please allow camera access in your browser settings to proceed."
        );
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setPermissionError("No camera device was detected on your system.");
      } else {
        setPermissionError(
          "Unable to establish camera connection. Please check your system settings or upload a portrait photo."
        );
      }
    }
  }, [stream]);

  useEffect(() => {
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Frame capture logic
  const capturePhoto = useCallback(() => {
    if (hasCapturedRef.current) return;
    hasCapturedRef.current = true;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // Trigger soft sound and gentle shutter animation
    playSoftShutterSound();
    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 200);

    const videoW = video.videoWidth || 1280;
    const videoH = video.videoHeight || 960;

    canvas.width = videoW;
    canvas.height = videoH;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw mirrored video frame so captured image matches preview exactly
    ctx.translate(videoW, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, videoW, videoH);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);

    // Stop tracks to release camera hardware
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    setTimeout(() => {
      onCapture(dataUrl);
    }, 250);
  }, [stream, onCapture]);

  // Auto-capture countdown loop (~1 second of sustained alignment)
  useEffect(() => {
    let animId: number;

    const checkAlignment = () => {
      if (hasCapturedRef.current) return;

      if (alignmentStatus === "aligned") {
        if (!alignedStartTimeRef.current) {
          alignedStartTimeRef.current = performance.now();
        }

        const elapsed = performance.now() - alignedStartTimeRef.current;
        const progress = Math.min(1, elapsed / 1000); // 1.0 second duration
        setAutoCaptureProgress(progress);

        if (progress >= 1 && !hasCapturedRef.current) {
          capturePhoto();
          return;
        }
      } else {
        alignedStartTimeRef.current = null;
        setAutoCaptureProgress((prev) => Math.max(0, prev - 0.05));
      }

      animId = requestAnimationFrame(checkAlignment);
    };

    animId = requestAnimationFrame(checkAlignment);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [alignmentStatus, capturePhoto]);

  // Handle uploaded photo as alternative
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
        onCapture(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  if (permissionError) {
    return (
      <div className="py-12">
        <CameraPermissionDenied
          errorMessage={permissionError}
          onRetry={startCamera}
          onPhotoSelected={(url) => onCapture(url)}
        />
      </div>
    );
  }

  const isAligned = alignmentStatus === "aligned";

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center space-y-6">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Main Viewport Container */}
      <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] rounded-3xl overflow-hidden bg-brand-charcoal border border-brand-stoneBorder shadow-soft-lg select-none">
        {/* Soft Shutter Flash Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-200",
            shutterFlash ? "opacity-75" : "opacity-0"
          )}
        />

        {/* Live Webcam Feed (Mirrored) */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform scale-x-[-1]"
        />

        {/* Studio Oval Face Guide & Mask Vignette */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {/* Subtle outer darkening vignette to frame the face */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/10 to-black/40" />

          {/* The Face-ID Oval */}
          <div
            className={cn(
              "relative w-[62%] sm:w-[58%] h-[68%] sm:h-[66%] rounded-[50%] transition-all duration-500 ease-out flex items-center justify-center",
              isAligned
                ? "border-2 border-brand-terracotta ring-4 ring-brand-terracotta/30 shadow-[0_0_50px_rgba(196,125,104,0.35)]"
                : "border border-white/60 shadow-[0_0_0_9999px_rgba(29,28,26,0.35)]"
            )}
          >
            {/* SVG Countdown Ring when aligning */}
            {autoCaptureProgress > 0 && (
              <svg
                className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] pointer-events-none"
                viewBox="0 0 100 100"
              >
                <ellipse
                  cx="50"
                  cy="50"
                  rx="48"
                  ry="48"
                  fill="none"
                  stroke="#C47D68"
                  strokeWidth="2.5"
                  strokeDasharray="301"
                  strokeDashoffset={301 * (1 - autoCaptureProgress)}
                  strokeLinecap="round"
                  className="transition-all duration-100"
                />
              </svg>
            )}

            {/* Subtle Crosshairs or tick marks for alignment balance */}
            <div
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                isAligned ? "bg-brand-terracotta scale-125" : "bg-white/40"
              )}
            />
          </div>
        </div>

        {/* Live Guidance Status Badge (Top Center) */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none max-w-[85%] text-center">
          <div
            className={cn(
              "inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md text-xs font-medium tracking-wide transition-all duration-300 shadow-soft-sm border",
              isAligned
                ? "bg-brand-terracotta text-white border-brand-terracotta shadow-ambient"
                : "bg-brand-charcoal/80 text-brand-bone border-white/20"
            )}
          >
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                isAligned ? "bg-white animate-pulse" : "bg-amber-400"
              )}
            />
            <span className="truncate">{guidanceText}</span>
          </div>
        </div>

        {/* Bottom Shutter & Controls Bar (Overlay on Camera) */}
        <div className="absolute bottom-6 inset-x-0 z-30 flex items-center justify-between px-8 pointer-events-auto">
          {/* File Upload Alternative Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Upload portrait photo"
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white/90 hover:text-white hover:bg-black/60 flex items-center justify-center transition-all"
          >
            <Upload className="w-4 h-4" />
          </button>

          {/* Primary Circular Tactile Shutter Button (Manual Override - ALWAYS visible) */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={capturePhoto}
              aria-label="Capture photo now"
              className="w-18 h-18 rounded-full border-2 border-brand-terracotta p-1 transition-all duration-200 hover:scale-105 active:scale-95 shadow-soft-lg group bg-black/20 backdrop-blur-sm"
            >
              <div className="w-full h-full rounded-full bg-brand-bone group-hover:bg-white transition-colors flex items-center justify-center shadow-inner">
                <div className="w-4 h-4 rounded-full border border-brand-terracotta/40" />
              </div>
            </button>
            <span className="text-[10px] font-mono tracking-wider uppercase text-white/80 mt-1.5 drop-shadow">
              Capture
            </span>
          </div>

          {/* Camera Reset / Refresh */}
          <button
            type="button"
            onClick={startCamera}
            title="Refresh camera stream"
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white/90 hover:text-white hover:bg-black/60 flex items-center justify-center transition-all"
          >
            <SwitchCamera className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hidden file input for alternative uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Reassurance text */}
      <div className="text-center space-y-1">
        <p className="text-xs text-brand-charcoalMuted font-light">
          Auto-capture activates upon 1 second of stable alignment.
        </p>
        <p className="text-[11px] text-brand-charcoalMuted/70">
          You may also press the capture button manually at any time.
        </p>
      </div>
    </div>
  );
}
