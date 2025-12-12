"use client"

import { useEffect, useState } from "react"

type PageKey = "home" | "projects" | "services" | "contact" | "about"

export default function YonetimPage() {
  const [page, setPage] = useState<PageKey>("home")
  const [content, setContent] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  // 🔹 CONTENT ÇEK
  async function loadContent(selectedPage: PageKey) {
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch(`/api/content?file=${selectedPage}`)
      const json = await res.json()
      setContent(json.data || {})
    } catch {
      setContent({})
    } finally {
      setLoading(false)
    }
  }

  // 🔹 CONTENT KAYDET
  async function saveContent() {
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: page, // 🔴 KRİTİK NOKTA
          content,
        }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error)

      setMessage("Kaydedildi")
    } catch (err: any) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContent(page)
  }, [page])

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold">Yönetim Paneli</h1>

      {/* SAYFA SEÇİMİ */}
      <div className="flex gap-2">
        {["home", "projects", "services", "about", "contact"].map((p) => (
          <button
            key={p}
            onClick={() => setPage(p as PageKey)}
            className={`px-4 py-2 rounded ${
              page === p ? "bg-black text-white" : "bg-zinc-200"
            }`}
          >
            {p.toUpperCase()}
          </button>
        ))}
      </div>

      {loading && <p>Yükleniyor…</p>}

      {/* JSON EDITOR */}
      <textarea
        value={JSON.stringify(content, null, 2)}
        onChange={(e) => setContent(JSON.parse(e.target.value || "{}"))}
        className="w-full h-[400px] font-mono text-sm p-4 bg-zinc-900 text-white rounded"
      />

      <button
        onClick={saveContent}
        disabled={loading}
        className="px-6 py-3 bg-green-600 text-white rounded"
      >
        Kaydet
      </button>

      {message && <p>{message}</p>}
    </div>
  )
}
