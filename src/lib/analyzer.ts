import { SkinAnalysisReport, SkinTypeLabel, ConcernId, ConcernItem, AgingSignal, RecommendationItem, Point2D } from "@/types/analysis";

/**
 * Sends the captured image to the backend API which runs the two Python models:
 *   - model1.py  → skin type classification (and optional aging/recommendations)
 *   - model2.py  → segmentation masks for the five skin conditions
 * The API returns a unified `SkinAnalysisReport` matching the frontend contract.
 */
export async function analyzeFace(imageBlobOrDataUrl: Blob | string): Promise<SkinAnalysisReport> {
  // Ensure we have a data‑URL string
  let imageData: string;
  if (imageBlobOrDataUrl instanceof Blob) {
    const buffer = Buffer.from(await imageBlobOrDataUrl.arrayBuffer());
    const mime = imageBlobOrDataUrl.type || "image/png";
    imageData = `data:${mime};base64,${buffer.toString("base64")}`;
  } else {
    imageData = imageBlobOrDataUrl;
  }

  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageData }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Analysis API error: ${err.error || response.statusText}`);
  }

  const report = (await response.json()) as SkinAnalysisReport;
  return report;
}
