import { NextRequest, NextResponse } from "next/server"
import { defaultContent } from "@/lib/default-content"

export const dynamic = "force-dynamic"
export const revalidate = 0

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_OWNER = process.env.GITHUB_OWNER
const GITHUB_REPO = process.env.GITHUB_REPO
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main"

function json(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
  })
}

async function ghFetch(url: string, init?: RequestInit) {
  return fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  })
}

export async function GET(_req: NextRequest, context: { params: { key: string } }) {
  const key = context.params.key
  const fallback = (defaultContent as any)?.[key] || {}

  // GitHub yoksa default içerik
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return json({ data: fallback, success: true, source: "default" })
  }

  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/content/${key}.json?ref=${GITHUB_BRANCH}`

  const r = await ghFetch(url)
  if (!r.ok) {
    return json({ data: fallback, success: true, source: "default" })
  }

  const file = await r.json()
  const contentStr = Buffer.from(file.content || "", "base64").toString("utf-8")
  const parsed = contentStr ? JSON.parse(contentStr) : fallback

  return json({ data: parsed, sha: file.sha, success: true, source: "github" })
}

export async function POST(req: NextRequest, context: { params: { key: string } }) {
  const key = context.params.key

  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return json({ success: false, error: "GitHub ENV eksik (TOKEN/OWNER/REPO)" }, 400)
  }

  const body = await req.json().catch(() => null)
  const newContent = body?.content

  if (!newContent || typeof newContent !== "object") {
    return json({ success: false, error: "content alanı boş/yanlış" }, 400)
  }

  const filePath = `content/${key}.json`
  const getUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`
  const putUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`

  // mevcut sha al (varsa)
  let sha: string | undefined = body?.sha
  if (!sha) {
    const r = await ghFetch(getUrl)
    if (r.ok) {
      const existing = await r.json()
      sha = existing.sha
    }
  }

  const encoded = Buffer.from(JSON.stringify(newContent, null, 2), "utf-8").toString("base64")

  const payload: any = {
    message: `Update ${filePath}`,
    content: encoded,
    branch: GITHUB_BRANCH,
  }
  if (sha) payload.sha = sha

  const saveRes = await ghFetch(putUrl, {
    method: "PUT",
    body: JSON.stringify(payload),
  })

  const out = await saveRes.json().catch(() => ({}))
  if (!saveRes.ok) {
    return json({ success: false, error: out?.message || "GitHub kaydetme hatası", details: out }, 500)
  }

  return json({ success: true, sha: out?.content?.sha })
}
