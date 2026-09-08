import fs from "node:fs";
import path from "node:path";

const WORKS_DIR = path.join(process.cwd(), "content", "works");

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;
  let filePath = path.join(WORKS_DIR, ...segments);

  if (!filePath.startsWith(WORKS_DIR)) {
    return new Response("Not found", { status: 404 });
  }

  // media/detail/<file> is a pre-generated downsized copy for detail-page
  // display; not every original gets one (small sources are skipped), so
  // fall back to the original at the same position when it's missing.
  if (!fs.existsSync(filePath)) {
    const detailIdx = segments.lastIndexOf("detail");
    if (detailIdx !== -1) {
      const fallback = [...segments.slice(0, detailIdx), ...segments.slice(detailIdx + 1)];
      filePath = path.join(WORKS_DIR, ...fallback);
    }
  }

  if (!fs.existsSync(filePath)) {
    return new Response("Not found", { status: 404 });
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] ?? "application/octet-stream";
  const data = fs.readFileSync(filePath);

  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
