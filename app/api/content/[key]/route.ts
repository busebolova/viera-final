import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_OWNER = process.env.GITHUB_OWNER
const GITHUB_REPO = process.env.GITHUB_REPO
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main"

export async function GET(req: NextRequest) {
  try {
    const key = req.nextUrl.searchParams.get("key")
    if (!key) {
      return NextResponse.json({ error: "Missing key" }, { status: 400 })
    }

    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/content/${key}.json?ref=${GITHUB_BRANCH}`

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      return NextResponse.json({ data: {}, success: false })
    }

    const data = await response.json()
    const content = JSON.parse(Buffer.from(data.content, "base64").toString("utf8"))

    return NextResponse.json({
      success: true,
      content,
      sha: data.sha,
    })
  } catch (err) {
    return NextResponse.json({ success: false, error: err })
  }
}
