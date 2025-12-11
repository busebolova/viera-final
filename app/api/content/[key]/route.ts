import { NextRequest, NextResponse } from "next/server"
import { defaultContent } from "@/lib/default-content"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_OWNER = process.env.GITHUB_OWNER
const GITHUB_REPO = process.env.GITHUB_REPO
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main"

export const dynamic = "force-dynamic"

export async function GET(
  req: NextRequest,
  context: { params: { key: string } }
) {
  const key = context.params.key
  const fallback = defaultContent[key] || {}

  try {
    if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
      return NextResponse.json({ data: fallback, success: true })
    }

    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/content/${key}.json?ref=${GITHUB_BRANCH}`

    const r = await fetch(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
      cache: "no-store",
    })

    if (!r.ok) {
      return NextResponse.json({ data: fallback, success: true })
    }

    const j = await r.json()
    const decoded = Buffer.from(j.content, "base64").toString("utf8")

    return NextResponse.json({
      data: JSON.parse(decoded),
      sha: j.sha,
      success: true,
    })
  } catch (err) {
    return NextResponse.json({ data: fallback, success: true })
  }
}
