"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { SkinAnalysisReport } from "@/types/analysis";
import { analyzeFace } from "@/lib/analyzer";

export interface AnalysisContextType {
  capturedImage: string | null;
  setCapturedImage: (image: string | null) => void;
  analysisResult: SkinAnalysisReport | null;
  isHydrated: boolean;
  setAnalysisResult: (result: SkinAnalysisReport | null) => void;
  runAnalysis: (image: string | Blob) => Promise<SkinAnalysisReport>;
  retake: () => void;
  resetSession: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [capturedImage, setCapturedImageState] = useState<string | null>(null);
  const [analysisResult, setAnalysisResultState] = useState<SkinAnalysisReport | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Restore state from sessionStorage on page reload
  useEffect(() => {
    try {
      const savedImage = sessionStorage.getItem("nexzen_captured_image");
      if (savedImage) setCapturedImageState(savedImage);

      const savedResult = sessionStorage.getItem("nexzen_analysis_result");
      if (savedResult) setAnalysisResultState(JSON.parse(savedResult));
    } catch (e) {
      // ignore storage access issues
    }
    setIsHydrated(true);
  }, []);

  const setCapturedImage = useCallback((image: string | null) => {
    setCapturedImageState(image);
    try {
      if (image) {
        sessionStorage.setItem("nexzen_captured_image", image);
      } else {
        sessionStorage.removeItem("nexzen_captured_image");
      }
    } catch (e) {}
  }, []);

  const setAnalysisResult = useCallback((result: SkinAnalysisReport | null) => {
    setAnalysisResultState(result);
    try {
      if (result) {
        sessionStorage.setItem("nexzen_analysis_result", JSON.stringify(result));
      } else {
        sessionStorage.removeItem("nexzen_analysis_result");
      }
    } catch (e) {}
  }, []);

  const runAnalysis = useCallback(async (image: string | Blob): Promise<SkinAnalysisReport> => {
    const report = await analyzeFace(image);
    setAnalysisResult(report);
    return report;
  }, [setAnalysisResult]);

  const retake = useCallback(() => {
    setCapturedImage(null);
    setAnalysisResult(null);
  }, [setCapturedImage, setAnalysisResult]);

  const resetSession = useCallback(() => {
    setCapturedImage(null);
    setAnalysisResult(null);
    try {
      sessionStorage.removeItem("nexzen_captured_image");
      sessionStorage.removeItem("nexzen_analysis_result");
    } catch (e) {}
  }, [setCapturedImage, setAnalysisResult]);

  return (
    <AnalysisContext.Provider
      value={{
        capturedImage,
        setCapturedImage,
        analysisResult,
        isHydrated,
        setAnalysisResult,
        runAnalysis,
        retake,
        resetSession,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }
  return context;
}
