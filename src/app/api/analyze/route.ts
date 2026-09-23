import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import { randomUUID } from 'crypto';

/**
 * Expected request body:
 * { "imageData": "data:image/png;base64,..." }
 *
 * The handler stores the incoming capture locally, runs the real Python face
 * pipeline which performs face detection and computes the face mask plus skin
 * condition overlays, then returns the structured report expected by the UI.
 */
export async function POST(request: Request) {
  try {
    const { imageData } = await request.json();
    if (!imageData) {
      return NextResponse.json({ error: 'Missing imageData' }, { status: 400 });
    }

    const base64 = imageData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');

    const tempDir = path.join(process.cwd(), 'tmp', randomUUID());
    await fs.mkdir(tempDir, { recursive: true });
    const imgPath = path.join(tempDir, 'input.png');
    const outputPath = path.join(tempDir, 'face_pipeline_output.json');
    await fs.writeFile(imgPath, buffer);

    await new Promise<void>((resolve, reject) => {
      execFile(
        'python',
        [path.join(process.cwd(), 'backend', 'face_pipeline.py'), imgPath, outputPath],
        { cwd: process.cwd() },
        (error, stdout, stderr) => {
          if (error) {
            console.error('Python pipeline error:', stderr || stdout || error.message);
            reject(error);
            return;
          }
          resolve();
        }
      );
    });

    const raw = await fs.readFile(outputPath, 'utf-8');
    const report = JSON.parse(raw);

    await fs.rm(tempDir, { recursive: true, force: true });

    return NextResponse.json(report);
  } catch (e) {
    console.error('Backend analysis error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
