import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const videoId = searchParams.get("videoId")

  if (!videoId) {
    return NextResponse.json({ error: "videoId is required" }, { status: 400 })
  }

  try {
    // Try as Short first (returns hq2.jpg for Shorts), then as regular video
    const urls = [
      `https://www.youtube.com/oembed?url=https://www.youtube.com/shorts/${videoId}&format=json`,
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
    ]

    for (const url of urls) {
      const res = await fetch(url, { next: { revalidate: 86400 } }) // cache for 24h
      if (res.ok) {
        const data = await res.json()
        if (data.thumbnail_url) {
          return NextResponse.json({ thumbnail_url: data.thumbnail_url })
        }
      }
    }
  } catch (err) {
    console.error("oEmbed fetch error:", err)
  }

  // Fallback — hqdefault always exists but may show grey for some Shorts
  return NextResponse.json({
    thumbnail_url: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  })
}
