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

const tabs = [
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
  const [message, setMessage] = useState<string | null>(null)

  const [content, setContent] = useState<ContentState>({
    home: {},
    about: {},
    services: {},
    projects: {},
    contact: {},
  })

  /* =========================
     LOAD CONTENT (FIXED)
     ========================= */
  const loadAllContent = async () => {
    setLoading(true)
    try {
      const keys = ["home", "about", "services", "projects", "contact"]

      const results = await Promise.all(
        keys.map(async (key) => {
          const res = await fetch(`/api/content?file=${key}&t=${Date.now()}`)
          const json = await res.json()
          return { key, data: json.content || json.data || {} }
        }),
      )

      const newContent: any = {}
      results.forEach(({ key, data }) => {
        newContent[key] = data
      })

      setContent(newContent)
      setGithubConnected(true)
    } catch (err) {
      console.error(err)
      setGithubConnected(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAllContent()
  }, [])

  /* =========================
     SAVE CONTENT (FIXED)
     ========================= */
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

      const result = await res.json()

      if (res.ok) {
        setMessage("Kaydedildi")
      } else {
        setMessage(result.error || "Kaydetme hatası")
      }
    } catch {
      setMessage("Sunucu hatası")
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: string, value: any) => {
    setContent((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab as keyof ContentState],
        [field]: value,
      },
    }))
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#18181b", color: "#fafafa" }}>
      {/* SIDEBAR */}
      <aside style={{ width: 240, background: "#27272a", padding: 16 }}>
        <h2 style={{ marginBottom: 24 }}>Yönetim</h2>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              width: "100%",
              padding: 10,
              marginBottom: 6,
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              background: activeTab === t.id ? "#ca8a04" : "transparent",
              color: activeTab === t.id ? "#18181b" : "#a1a1aa",
            }}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        )}
        <button
          style={{
            marginTop: "auto",
            width: "100%",
            padding: 10,
            border: "1px solid #3f3f46",
            background: "transparent",
            color: "#a1a1aa",
          }}
        >
          <LogOut size={16} /> Çıkış
        </button>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, padding: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1>{tabs.find((t) => t.id === activeTab)?.label}</h1>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                color: githubConnected ? "#22c55e" : "#ef4444",
              }}
            >
              {githubConnected ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
              {githubConnected ? "GitHub bağlantısı aktif" : "GitHub bağlantısı yok"}
            </div>
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

        {message && <div style={{ marginBottom: 16 }}>{message}</div>}

        {/* BASİT ÖRNEK – içerik artık DOLU geliyor */}
        <textarea
          style={{ width: "100%", minHeight: 200, background: "#3f3f46", color: "#fff" }}
          value={JSON.stringify(content[activeTab as keyof ContentState], null, 2)}
          onChange={(e) => updateField("_raw", e.target.value)}
        />
      </main>
    </div>
  )
}
