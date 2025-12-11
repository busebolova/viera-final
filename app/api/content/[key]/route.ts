import { type NextRequest, NextResponse } from "next/server"
import { defaultContent } from "@/lib/default-content"

export const dynamic = "force-dynamic"
export const revalidate = 0

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_OWNER = process.env.GITHUB_OWNER
const GITHUB_REPO = process.env.GITHUB_REPO
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main"

// 🔥 KRİTİK DÜZELTME: params artık Promise değil!
export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const { key } = params
    const defaultData = defaultContent[key as keyof typeof defaultContent]

    // GitHub tanımlı değilse default içerik dön
    if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
      return NextResponse.json(
        { data: defaultData || {}, success: true },
        {
          headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
        }
      )
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
      return NextResponse.json(
        { data: defaultData || {}, success: true },
        {
          headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
        }
      )
    }

    const data = await response.json()
    const content = Buffer.from(data.content, "base64").toString("utf-8")
    const parsed = JSON.parse(content)

    return NextResponse.json(
      {
        data: parsed,
        sha: data.sha,
        success: true,
      },
      {
        headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
      }
    )
  } catch (err) {
    return NextResponse.json(
      { data: {}, success: true },
      {
        headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
      }
    )
  }
}
