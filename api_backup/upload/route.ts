export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

// Utility helper to safely resolve the R2 Bucket binding
const getR2Bucket = (): any => {
  if (typeof process !== 'undefined' && (process.env as any).BUCKET) {
    return (process.env as any).BUCKET;
  }
  if (typeof globalThis !== 'undefined' && (globalThis as any).env?.BUCKET) {
    return (globalThis as any).env.BUCKET;
  }
  try {
    const ctx = getCloudflareContext();
    if ((ctx as any)?.env?.BUCKET) return (ctx as any).env.BUCKET;
  } catch (e) {}
  return null;
};

// GET /api/upload?file=filename - Dynamic streaming serving of media files from R2
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('file');

    if (!filename) {
      return new Response("Missing required parameter: file", { status: 400 });
    }

    const bucket = getR2Bucket();
    if (!bucket) {
      console.warn("⚠️ R2 Bucket binding 'BUCKET' not found. Dynamic streaming bypassed.");
      return new Response("R2 storage not configured. Please bind 'BUCKET' in your Cloudflare Pages dashboard.", { status: 503 });
    }

    // Retrieve object from R2 bucket
    const object = await bucket.get(filename);
    if (!object) {
      return new Response("File not found in storage", { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable'); // Cache for 1 year

    return new Response(object.body, {
      headers,
    });
  } catch (err: any) {
    console.error("❌ GET /api/upload failed:", err);
    return new Response(err.message || "Failed to retrieve file", { status: 500 });
  }
}

// POST /api/upload - Securely upload files to Cloudflare R2 object storage
export async function POST(request: Request) {
  try {
    const bucket = getR2Bucket();
    if (!bucket) {
      return NextResponse.json(
        { error: "R2 Storage is not configured. Please set up a bucket 'linguaplanet-storage' and bind it as 'BUCKET'." },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "No file was uploaded." }, { status: 400 });
    }

    // Clean up filename and append a secure UUID to prevent name collision/overwrites
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const secureFilename = `${crypto.randomUUID()}-${cleanName}`;
    const arrayBuffer = await file.arrayBuffer();

    // Store in R2 bucket
    await bucket.put(secureFilename, arrayBuffer, {
      httpMetadata: {
        contentType: file.type || 'application/octet-stream',
      },
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString()
      }
    });

    // Generate dynamic access URL
    const accessUrl = `/api/upload?file=${secureFilename}`;

    return NextResponse.json({
      success: true,
      filename: secureFilename,
      url: accessUrl,
      sizeBytes: file.size,
      contentType: file.type
    });
  } catch (err: any) {
    console.error("❌ POST /api/upload failed:", err);
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}
