"use client"

import { useEffect, useState } from "react"

const PAGES = ["home", "projects", "services", "about", "contact"] as const
type PageKey = (typeof PAGES)[number]

export default function YonetimPage() {
  const [page, setPage] = useState<PageKey>("home")
  const [content, setContent] = useState<any>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // 🔹 OKUMA
  async function load() {
    setLoading(true)
    setError(null)

    const res = await fetch(`/api/content?file=${page}`)
    const json = await res.json()

    setContent(json.data || {})
    setLoading(false)
  }

  // 🔹 KAYDETME
  async function save() {
    setLoading(true)
    setError(null)

    const res = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        file: page, // ⬅️ KRİTİK
        content,
      }),
    })

    const json = await res.json()

    if (!res.ok) {
      setError(json.error || "Kaydedilemedi")
    }

    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [page])

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Yönetim Paneli</h1>

      <div className="flex gap-2">
        {PAGES.map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-4 py-2 rounded ${
              page === p ? "bg-black text-white" : "bg-zinc-200"
            }`}
          >
            {p.toUpperCase()}
          </button>
        ))}
      </div>

      {loading && <p>Yükleniyor…</p>}
      {error && <p className="text-red-500">{error}</p>}

      <textarea
        className="w-full h-[500px] font-mono text-sm bg-zinc-900 text-white p-4 rounded"
        value={JSON.stringify(content, null, 2)}
        onChange={(e) => {
          try {
            setContent(JSON.parse(e.target.value))
          } catch {}
        }}
      />

      <button
        onClick={save}
        disabled={loading}
        className="px-6 py-3 bg-green-600 text-white rounded"
      >
        Kaydet
      </button>
    </div>
  )
}
