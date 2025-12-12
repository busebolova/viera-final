"use client"

import { useEffect, useState } from "react"

type ContentState = {
  home: any
  about: any
  services: any
  projects: any
  contact: any
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<keyof ContentState>("home")
  const [content, setContent] = useState<ContentState>({
    home: {},
    about: {},
    services: {},
    projects: {},
    contact: {},
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* =========================
     🔥 CONTENT LOAD (FIX)
  ========================= */
  const loadAllContent = async () => {
    setLoading(true)
    setError(null)

    try {
      const keys: (keyof ContentState)[] = [
        "home",
        "about",
        "services",
        "projects",
        "contact",
      ]

      const result: any = {}

      for (const key of keys) {
        const res = await fetch(`/api/github/content?file=${key}`, {
          cache: "no-store",
        })
        const json = await res.json()
        result[key] = json.data || {}
      }

      setContent(result)
    } catch (e) {
      setError("İçerik yüklenemedi")
    } finally {
      setLoading(false)
    }
  }

  /* =========================
     🔥 SAVE (FIX)
  ========================= */
  const handleSave = async () => {
    setSaving(true)
    setError(null)

    try {
      const res = await fetch("/api/github/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: activeTab,
          content: content[activeTab],
        }),
      })

      if (!res.ok) {
        const j = await res.json()
        throw new Error(j.error || "Kaydedilemedi")
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    loadAllContent()
  }, [])

  return (
    <div style={{ padding: 24 }}>
      <h1>Yönetim Paneli</h1>

      <div style={{ marginBottom: 16 }}>
        {(["home", "about", "services", "projects", "contact"] as const).map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                marginRight: 8,
                fontWeight: activeTab === tab ? "bold" : "normal",
              }}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {loading && <p>Yükleniyor…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <textarea
        style={{ width: "100%", height: 400 }}
        value={JSON.stringify(content[activeTab], null, 2)}
        onChange={(e) =>
          setContent((prev) => ({
            ...prev,
            [activeTab]: JSON.parse(e.target.value || "{}"),
          }))
        }
      />

      <br />
      <br />

      <button onClick={handleSave} disabled={saving}>
        {saving ? "Kaydediliyor…" : "Kaydet"}
      </button>
    </div>
  )
}
