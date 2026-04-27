import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { renderLiquidPage } from "@/lib/liquid";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page) return new Response("Not found", { status: 404 });

  const now = new Date();
  const isPublished =
    page.status === "published" &&
    (!page.publishedAt || page.publishedAt <= now);
  if (!isPublished) return new Response("Not found", { status: 404 });

  if (page.renderer !== "liquid") {
    // Liquid route is reserved for liquid-rendered pages. MDX pages live at /<slug>.
    return Response.redirect(new URL(`/${slug}`, _req.url), 308);
  }

  const html = await renderLiquidPage(page);
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
