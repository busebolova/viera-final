"use client"

import { useEffect, useState } from "react"
import {
  Home,
  Info,
  Briefcase,
  FolderKanban,
  Phone,
  Save,
  RefreshCw,
  LogOut,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

type ContentState = {
  home: any
  about: any
  services: any
  projects: any
  contact: any
}

const TABS = [
  { id: "home", label: "Anasayfa", icon: Home },
  { id: "about", label: "Hakkımızda", icon: Info },
  { id: "services", label: "Hizmetler", icon: Briefcase },
  { id: "projects", label: "Projeler", icon: FolderKanban },
  { id: "contact", label: "İletişim", icon: Phone },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("home")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [githubConnected, setGithubConnected] = useState(false)
  const [message, setMessage] = useState<null | { type: "success" | "error"; text: string }>(null)

  const [content, setContent] = useState<ContentState>({
    home: {},
    about: {},
    services: {},
    projects: {},
    contact: {},
  })

  /* ==============================
     LOAD CONTENT (FIXED)
  ============================== */
  const loadAllContent = async () => {
    setLoading(true)
    setMessage(null)

    try {
      const keys = ["home", "about", "services", "projects", "contact"]

      const results = await Promise.all(
        keys.map(async (key) => {
          const res = await fetch(`/api/content?file=${key}&t=${Date.now()}`)
          const json = await res.json()
          return { key, data: json.data || {} }
        }),
      )

      const nextContent: any = {}
      results.forEach(({ key, data }) => {
        nextContent[key] = data
      })

      setContent(nextContent)
      setGithubConnected(true)
    } catch {
      setGithubConnected(false)
      setMessage({ type: "error", text: "İçerikler yüklenemedi" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAllContent()
  }, [])

  /* ==============================
     SAVE CONTENT (FIXED)
  ============================== */
  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: activeTab,
          content: content[activeTab as keyof ContentState],
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || "Kaydedilemedi")
      }

      setMessage({ type: "success", text: "Başarıyla kaydedildi" })
    } catch (err: any) {
      setMessage({ type: "error", text: err.message })
    } finally {
      setSaving(false)
    }
  }

  /* ==============================
     UPDATE HELPERS
  ============================== */
  const updateField = (field: string, value: any) => {
    setContent((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab as keyof ContentState],
        [field]: value,
      },
    }))
  }

  /* ==============================
     UI
  ============================== */
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#18181b", color: "#fff" }}>
      {/* SIDEBAR */}
      <aside style={{ width: 240, background: "#27272a", padding: 20 }}>
        <h3 style={{ marginBottom: 24 }}>Yönetim</h3>

        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              width: "100%",
              padding: "10px 12px",
              marginBottom: 6,
              borderRadius: 8,
              background: activeTab === tab.id ? "#ca8a04" : "transparent",
              color: activeTab === tab.id ? "#000" : "#aaa",
              border: "none",
              display: "flex",
              gap: 10,
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}

        <button
          style={{
            marginTop: "auto",
            padding: 10,
            width: "100%",
            background: "transparent",
            border: "1px solid #444",
            color: "#aaa",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          <LogOut size={16} /> Çıkış
        </button>
      </aside>

      {/* CONTENT */}
      <main style={{ flex: 1, padding: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1>{TABS.find((t) => t.id === activeTab)?.label}</h1>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginTop: 6,
                color: githubConnected ? "#22c55e" : "#ef4444",
              }}
            >
              {githubConnected ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
              {githubConnected ? "GitHub bağlı" : "GitHub yok"}
            </span>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={loadAllContent} disabled={loading}>
              <RefreshCw size={16} /> Yenile
            </button>
            <button onClick={handleSave} disabled={saving}>
              <Save size={16} /> Kaydet
            </button>
          </div>
        </div>

        {message && (
          <div
            style={{
              marginBottom: 16,
              padding: 12,
              borderRadius: 8,
              background: message.type === "success" ? "rgba(34,197,94,.2)" : "rgba(239,68,68,.2)",
            }}
          >
            {message.text}
          </div>
        )}

        {/* ÖRNEK: HOME */}
        {activeTab === "home" && (
          <div style={{ background: "#27272a", padding: 24, borderRadius: 12 }}>
            <label>Hero Başlık</label>
            <input
              value={content.home?.hero?.title || ""}
              onChange={(e) =>
                updateField("hero", {
                  ...(content.home?.hero || {}),
                  title: e.target.value,
                })
              }
              style={{ width: "100%", padding: 10, marginTop: 6 }}
            />
          </div>
        )}
      </main>
    </div>
  )
}
