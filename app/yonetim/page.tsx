"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Home,
  Info,
  Briefcase,
  FolderKanban,
  Phone,
  Save,
  LogOut,
  RefreshCw,
  Upload,
  CheckCircle,
  AlertCircle,
  Plus,
  X,
  Trash2,
  ImageIcon,
} from "lucide-react"
import Image from "next/image"

// Types
interface Service {
  id: string
  title: string
  description: string
  icon: string
  image?: string
  items?: string[]
}

interface Project {
  id: string
  slug: string
  title: string
  shortDescription: string
  fullDescription?: string
  image: string
  location?: string
  year?: string
  area?: string
  units?: string
  floors?: string
  features?: string[]
  gallery?: string[]
  updates?: { date: string; title: string; description: string }[]
}

interface WhyUsItem {
  title: string
  description: string
}

interface ContentState {
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

// Inline styles for complete CSS isolation
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#18181b",
    color: "#fafafa",
  },
  sidebar: {
    width: "240px",
    backgroundColor: "#27272a",
    padding: "1.5rem 1rem",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #3f3f46",
    position: "fixed",
    height: "100vh",
    left: 0,
    top: 0,
  },
  logo: {
    fontSize: "1.25rem",
    fontWeight: 700,
    marginBottom: "2rem",
    color: "#fafafa",
    textAlign: "center",
  },
  nav: { display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 },
  navButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    border: "none",
    backgroundColor: "transparent",
    color: "#a1a1aa",
    cursor: "pointer",
    fontSize: "0.875rem",
    textAlign: "left",
    width: "100%",
    transition: "all 0.2s",
  },
  navButtonActive: { backgroundColor: "#ca8a04", color: "#18181b", fontWeight: 600 },
  logoutButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    border: "1px solid #3f3f46",
    backgroundColor: "transparent",
    color: "#a1a1aa",
    cursor: "pointer",
    fontSize: "0.875rem",
    marginTop: "auto",
  },
  main: {
    flex: 1,
    marginLeft: "240px",
    padding: "2rem",
    backgroundColor: "#18181b",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  title: { fontSize: "1.5rem", fontWeight: 700, color: "#fafafa" },
  buttonGroup: { display: "flex", gap: "0.75rem" },
  button: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.625rem 1.25rem",
    borderRadius: "0.5rem",
    border: "none",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: 500,
    transition: "all 0.2s",
  },
  refreshButton: { backgroundColor: "#3f3f46", color: "#fafafa" },
  saveButton: { backgroundColor: "#ca8a04", color: "#18181b" },
  section: {
    backgroundColor: "#27272a",
    borderRadius: "0.75rem",
    padding: "1.5rem",
    marginBottom: "1.5rem",
    border: "1px solid #3f3f46",
  },
  sectionTitle: {
    fontSize: "1.125rem",
    fontWeight: 600,
    marginBottom: "1rem",
    color: "#fafafa",
    borderBottom: "1px solid #3f3f46",
    paddingBottom: "0.5rem",
  },
  label: {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: 500,
    marginBottom: "0.5rem",
    color: "#d4d4d8",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "0.5rem",
    border: "1px solid #3f3f46",
    backgroundColor: "#3f3f46",
    color: "#fafafa",
    fontSize: "0.875rem",
    marginBottom: "1rem",
  },
  textarea: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "0.5rem",
    border: "1px solid #3f3f46",
    backgroundColor: "#3f3f46",
    color: "#fafafa",
    fontSize: "0.875rem",
    marginBottom: "1rem",
    minHeight: "100px",
    resize: "vertical" as const,
  },
  imagePreview: {
    width: "100%",
    height: "200px",
    borderRadius: "0.5rem",
    overflow: "hidden",
    marginBottom: "0.75rem",
    position: "relative" as const,
    backgroundColor: "#3f3f46",
  },
  uploadButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    borderRadius: "0.5rem",
    border: "1px solid #3f3f46",
    backgroundColor: "transparent",
    color: "#a1a1aa",
    cursor: "pointer",
    fontSize: "0.875rem",
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.375rem",
    padding: "0.375rem 0.75rem",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: 500,
  },
  statusConnected: { backgroundColor: "rgba(34, 197, 94, 0.2)", color: "#22c55e" },
  statusDisconnected: { backgroundColor: "rgba(239, 68, 68, 0.2)", color: "#ef4444" },
  loginContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#18181b",
    padding: "1rem",
  },
  loginBox: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#27272a",
    borderRadius: "0.75rem",
    padding: "2rem",
    border: "1px solid #3f3f46",
  },
  loginTitle: {
    fontSize: "1.5rem",
    fontWeight: 700,
    textAlign: "center" as const,
    marginBottom: "1.5rem",
    color: "#fafafa",
  },
  loginButton: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "0.5rem",
    border: "none",
    backgroundColor: "#ca8a04",
    color: "#18181b",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  loginInput: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "0.5rem",
    border: "1px solid #3f3f46",
    backgroundColor: "#3f3f46",
    color: "#fafafa",
    fontSize: "0.875rem",
    marginBottom: "1rem",
  },
  alert: {
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  alertSuccess: { backgroundColor: "rgba(34, 197, 94, 0.2)", color: "#22c55e" },
  alertError: { backgroundColor: "rgba(239, 68, 68, 0.2)", color: "#ef4444" },
  serviceCard: {
    backgroundColor: "#3f3f46",
    borderRadius: "0.5rem",
    padding: "1rem",
    marginBottom: "1rem",
  },
  serviceHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  deleteButton: {
    padding: "0.375rem",
    borderRadius: "0.375rem",
    border: "none",
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    color: "#ef4444",
    cursor: "pointer",
  },
  addButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    borderRadius: "0.5rem",
    border: "1px dashed #3f3f46",
    backgroundColor: "transparent",
    color: "#a1a1aa",
    cursor: "pointer",
    fontSize: "0.875rem",
    width: "100%",
    justifyContent: "center",
  },
  itemRow: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "0.5rem",
    alignItems: "flex-start",
  },
  smallInput: {
    flex: 1,
    padding: "0.5rem",
    borderRadius: "0.375rem",
    border: "1px solid #52525b",
    backgroundColor: "#52525b",
    color: "#fafafa",
    fontSize: "0.8rem",
  },
  removeItemButton: {
    padding: "0.375rem",
    borderRadius: "0.375rem",
    border: "none",
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    color: "#ef4444",
    cursor: "pointer",
    flexShrink: 0,
  },
  galleryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "1rem",
    marginBottom: "1rem",
  },
  galleryItem: {
    position: "relative" as const,
    aspectRatio: "4/3",
    borderRadius: "0.5rem",
    overflow: "hidden",
    backgroundColor: "#3f3f46",
  },
  galleryRemove: {
    position: "absolute" as const,
    top: "0.25rem",
    right: "0.25rem",
    padding: "0.25rem",
    borderRadius: "0.25rem",
    border: "none",
    backgroundColor: "rgba(239, 68, 68, 0.9)",
    color: "#fff",
    cursor: "pointer",
  },
  select: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "0.5rem",
    border: "1px solid #3f3f46",
    backgroundColor: "#3f3f46",
    color: "#fafafa",
    fontSize: "0.875rem",
    marginBottom: "1rem",
  },
  projectCard: {
    // Added for project cards
    backgroundColor: "#3f3f46",
    borderRadius: "0.5rem",
    padding: "1rem",
    marginBottom: "1rem",
  },
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [password, setPassword] = useState("")
  const [activeTab, setActiveTab] = useState("home")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [githubConnected, setGithubConnected] = useState(false)

  const [content, setContent] = useState<ContentState>({
    home: {},
    about: {},
    services: {},
    projects: {},
    contact: {},
  })

  // Check login status on mount
  useEffect(() => {
    const loggedIn = sessionStorage.getItem("adminLoggedIn")
    if (loggedIn === "true") {
      setIsLoggedIn(true)
    }
  }, [])

  // Load content when logged in
  useEffect(() => {
    if (isLoggedIn) {
      loadAllContent()
    }
  }, [isLoggedIn])

  const handleLogin = () => {
    if (password === "viera2025") {
      setIsLoggedIn(true)
      sessionStorage.setItem("adminLoggedIn", "true")
    } else {
      setMessage({ type: "error", text: "Yanlış şifre!" })
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    sessionStorage.removeItem("adminLoggedIn")
  }

  const loadAllContent = async () => {
    setLoading(true)
    try {
      const keys = ["home", "about", "services", "projects", "contact"]
      const results = await Promise.all(
        keys.map(async (key) => {
          const res = await fetch(`/api/github/content?key=${key}&t=${Date.now()}`)
          const data = await res.json()
          return { key, data: data.content || data.data || {} }
        }),
      )

      const newContent: any = {}
      results.forEach(({ key, data }) => {
        newContent[key] = data
      })

      setContent(newContent)
      setGithubConnected(true)
    } catch (error) {
      console.error("Load error:", error)
      setGithubConnected(false)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch("/api/github/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: activeTab,
          content: content[activeTab as keyof ContentState],
        }),
      })

      const result = await res.json()

      if (res.ok) {
        setMessage({ type: "success", text: "Başarıyla kaydedildi!" })
      } else {
        setMessage({ type: "error", text: result.error || "Kaydetme hatası" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Bağlantı hatası" })
    } finally {
      setSaving(false)
    }
  }

  const updateContent = (section: string, value: any, field?: string) => {
    setContent((prev) => {
      const currentTab = prev[activeTab as keyof ContentState] || {}
      if (field) {
        return {
          ...prev,
          [activeTab]: {
            ...currentTab,
            [section]: {
              ...(currentTab[section] || {}),
              [field]: value,
            },
          },
        }
      }
      return {
        ...prev,
        [activeTab]: {
          ...currentTab,
          [section]: value,
        },
      }
    })
  }

  const updateDirectField = (field: string, value: any) => {
    setContent((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab as keyof ContentState],
        [field]: value,
      },
    }))
  }

  const updateWhyUsItem = (index: number, field: string, value: string) => {
    setContent((prev) => {
      const aboutContent = prev.about || {}
      const whyUs = aboutContent.whyUs || { title: "", items: [] }
      const items = [...(whyUs.items || [])]
      items[index] = { ...items[index], [field]: value }
      return {
        ...prev,
        about: {
          ...aboutContent,
          whyUs: { ...whyUs, items },
        },
      }
    })
  }

  const addWhyUsItem = () => {
    setContent((prev) => {
      const aboutContent = prev.about || {}
      const whyUs = aboutContent.whyUs || { title: "", items: [] }
      return {
        ...prev,
        about: {
          ...aboutContent,
          whyUs: {
            ...whyUs,
            items: [...(whyUs.items || []), { title: "", description: "" }],
          },
        },
      }
    })
  }

  const removeWhyUsItem = (index: number) => {
    setContent((prev) => {
      const aboutContent = prev.about || {}
      const whyUs = aboutContent.whyUs || { title: "", items: [] }
      const items = [...(whyUs.items || [])]
      items.splice(index, 1)
      return {
        ...prev,
        about: {
          ...aboutContent,
          whyUs: { ...whyUs, items },
        },
      }
    })
  }

  // Image upload handler
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string,
    field?: string,
    index?: number,
    galleryIndex?: number,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        const { url } = await res.json()

        if (type === "about" && field) {
          // About page images
          updateDirectField(field, url)
        } else if (type === "home" && field) {
          updateContent("hero", url, "image")
        } else if (type === "services" && index !== undefined) {
          // Service image
          const services = [...(content.services?.services || [])]
          services[index] = { ...services[index], image: url }
          setContent((prev) => ({
            ...prev,
            services: { ...prev.services, services },
          }))
        } else if (type === "projects" && field && index !== undefined) {
          // Project image or gallery
          const category = field as "completed" | "ongoing" | "upcoming"
          const projects = [...(content.projects?.[category] || [])]

          if (galleryIndex !== undefined) {
            // Gallery image
            const gallery = [...(projects[index].gallery || [])]
            gallery[galleryIndex] = url
            projects[index] = { ...projects[index], gallery }
          } else {
            // Main project image
            projects[index] = { ...projects[index], image: url }
          }

          setContent((prev) => ({
            ...prev,
            projects: { ...prev.projects, [category]: projects },
          }))
        }

        setMessage({ type: "success", text: "Görsel yüklendi!" })
      } else {
        setMessage({ type: "error", text: "Görsel yüklenemedi" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Yükleme hatası" })
    }
  }

  // Services functions
  const updateService = (index: number, field: string, value: any) => {
    const services = [...(content.services?.services || [])]
    services[index] = { ...services[index], [field]: value }
    setContent((prev) => ({
      ...prev,
      services: { ...prev.services, services },
    }))
  }

  const addService = () => {
    const services = [...(content.services?.services || [])]
    services.push({
      id: `service-${Date.now()}`,
      title: "Yeni Hizmet",
      description: "",
      icon: "Home",
      items: [],
    })
    setContent((prev) => ({
      ...prev,
      services: { ...prev.services, services },
    }))
  }

  const removeService = (index: number) => {
    const services = [...(content.services?.services || [])]
    services.splice(index, 1)
    setContent((prev) => ({
      ...prev,
      services: { ...prev.services, services },
    }))
  }

  const addServiceItem = (serviceIndex: number) => {
    const services = [...(content.services?.services || [])]
    const items = [...(services[serviceIndex].items || [])]
    items.push("")
    services[serviceIndex] = { ...services[serviceIndex], items }
    setContent((prev) => ({
      ...prev,
      services: { ...prev.services, services },
    }))
  }

  const updateServiceItem = (serviceIndex: number, itemIndex: number, value: string) => {
    const services = [...(content.services?.services || [])]
    const items = [...(services[serviceIndex].items || [])]
    items[itemIndex] = value
    services[serviceIndex] = { ...services[serviceIndex], items }
    setContent((prev) => ({
      ...prev,
      services: { ...prev.services, services },
    }))
  }

  const removeServiceItem = (serviceIndex: number, itemIndex: number) => {
    const services = [...(content.services?.services || [])]
    const items = [...(services[serviceIndex].items || [])]
    items.splice(itemIndex, 1)
    services[serviceIndex] = { ...services[serviceIndex], items }
    setContent((prev) => ({
      ...prev,
      services: { ...prev.services, services },
    }))
  }

  // Projects functions
  const updateProject = (category: string, index: number, field: string, value: any) => {
    const projects = [...(content.projects?.[category] || [])]
    projects[index] = { ...projects[index], [field]: value }
    setContent((prev) => ({
      ...prev,
      projects: { ...prev.projects, [category]: projects },
    }))
  }

  const addProject = (category: string) => {
    const projects = [...(content.projects?.[category] || [])]
    projects.push({
      id: `project-${Date.now()}`,
      slug: `yeni-proje-${Date.now()}`,
      title: "Yeni Proje",
      shortDescription: "",
      fullDescription: "",
      image: "/placeholder.svg",
      location: "",
      year: new Date().getFullYear().toString(),
      features: [],
      gallery: [],
    })
    setContent((prev) => ({
      ...prev,
      projects: { ...prev.projects, [category]: projects },
    }))
  }

  const removeProject = (category: string, index: number) => {
    const projects = [...(content.projects?.[category] || [])]
    projects.splice(index, 1)
    setContent((prev) => ({
      ...prev,
      projects: { ...prev.projects, [category]: projects },
    }))
  }

  const addFeature = (category: string, projectIndex: number) => {
    const projects = [...(content.projects?.[category] || [])]
    const features = [...(projects[projectIndex].features || [])]
    features.push("")
    projects[projectIndex] = { ...projects[projectIndex], features }
    setContent((prev) => ({
      ...prev,
      projects: { ...prev.projects, [category]: projects },
    }))
  }

  const updateFeature = (category: string, projectIndex: number, featureIndex: number, value: string) => {
    const projects = [...(content.projects?.[category] || [])]
    const features = [...(projects[projectIndex].features || [])]
    features[featureIndex] = value
    projects[projectIndex] = { ...projects[projectIndex], features }
    setContent((prev) => ({
      ...prev,
      projects: { ...prev.projects, [category]: projects },
    }))
  }

  const removeFeature = (category: string, projectIndex: number, featureIndex: number) => {
    const projects = [...(content.projects?.[category] || [])]
    const features = [...(projects[projectIndex].features || [])]
    features.splice(featureIndex, 1)
    projects[projectIndex] = { ...projects[projectIndex], features }
    setContent((prev) => ({
      ...prev,
      projects: { ...prev.projects, [category]: projects },
    }))
  }

  const addGalleryImage = (category: string, projectIndex: number) => {
    const projects = [...(content.projects?.[category] || [])]
    const gallery = [...(projects[projectIndex].gallery || [])]
    gallery.push("/placeholder.svg")
    projects[projectIndex] = { ...projects[projectIndex], gallery }
    setContent((prev) => ({
      ...prev,
      projects: { ...prev.projects, [category]: projects },
    }))
  }

  const removeGalleryImage = (category: string, projectIndex: number, galleryIndex: number) => {
    const projects = [...(content.projects?.[category] || [])]
    const gallery = [...(projects[projectIndex].gallery || [])]
    gallery.splice(galleryIndex, 1)
    projects[projectIndex] = { ...projects[projectIndex], gallery }
    setContent((prev) => ({
      ...prev,
      projects: { ...prev.projects, [category]: projects },
    }))
  }

  const addUpdate = (category: string, projectIndex: number) => {
    const projects = [...(content.projects?.[category] || [])]
    const updates = [...(projects[projectIndex].updates || [])]
    updates.push({ date: "", title: "", description: "" })
    projects[projectIndex] = { ...projects[projectIndex], updates }
    setContent((prev) => ({
      ...prev,
      projects: { ...prev.projects, [category]: projects },
    }))
  }

  const updateProjectUpdate = (
    category: string,
    projectIndex: number,
    updateIndex: number,
    field: string,
    value: string,
  ) => {
    const projects = [...(content.projects?.[category] || [])]
    const updates = [...(projects[projectIndex].updates || [])]
    updates[updateIndex] = { ...updates[updateIndex], [field]: value }
    projects[projectIndex] = { ...projects[projectIndex], updates }
    setContent((prev) => ({
      ...prev,
      projects: { ...prev.projects, [category]: projects },
    }))
  }

  const removeUpdate = (category: string, projectIndex: number, updateIndex: number) => {
    const projects = [...(content.projects?.[category] || [])]
    const updates = [...(projects[projectIndex].updates || [])]
    updates.splice(updateIndex, 1)
    projects[projectIndex] = { ...projects[projectIndex], updates }
    setContent((prev) => ({
      ...prev,
      projects: { ...prev.projects, [category]: projects },
    }))
  }

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginBox}>
          <h1 style={styles.loginTitle}>Yönetim Paneli</h1>
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            style={styles.loginInput}
          />
          <button onClick={handleLogin} style={styles.loginButton}>
            Giriş Yap
          </button>
          {message && <div style={{ ...styles.alert, ...styles.alertError, marginTop: "1rem" }}>{message.text}</div>}
        </div>
      </div>
    )
  }

  // Project Card Component
  const renderProjectCard = (project: Project, category: string, index: number) => (
    <div key={project.id || index} style={styles.projectCard}>
      <div style={styles.serviceHeader}>
        <h4 style={{ fontWeight: 600, color: "#fafafa" }}>{project.title || "Proje"}</h4>
        <button style={styles.deleteButton} onClick={() => removeProject(category, index)}>
          <Trash2 size={16} />
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <div>
          <label style={styles.label}>Başlık</label>
          <input
            type="text"
            value={project.title || ""}
            onChange={(e) => updateProject(category, index, "title", e.target.value)}
            style={styles.input}
          />
        </div>
        <div>
          <label style={styles.label}>Slug (URL)</label>
          <input
            type="text"
            value={project.slug || ""}
            onChange={(e) => updateProject(category, index, "slug", e.target.value)}
            style={styles.input}
          />
        </div>
      </div>

      <div>
        <label style={styles.label}>Kısa Açıklama</label>
        <input
          type="text"
          value={project.shortDescription || ""}
          onChange={(e) => updateProject(category, index, "shortDescription", e.target.value)}
          style={styles.input}
        />
      </div>

      <div>
        <label style={styles.label}>Detaylı Açıklama</label>
        <textarea
          value={project.fullDescription || ""}
          onChange={(e) => updateProject(category, index, "fullDescription", e.target.value)}
          style={styles.textarea}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
        <div>
          <label style={styles.label}>Konum</label>
          <input
            type="text"
            value={project.location || ""}
            onChange={(e) => updateProject(category, index, "location", e.target.value)}
            style={styles.input}
          />
        </div>
        <div>
          <label style={styles.label}>Yıl</label>
          <input
            type="text"
            value={project.year || ""}
            onChange={(e) => updateProject(category, index, "year", e.target.value)}
            style={styles.input}
          />
        </div>
        <div>
          <label style={styles.label}>Alan (m²)</label>
          <input
            type="text"
            value={project.area || ""}
            onChange={(e) => updateProject(category, index, "area", e.target.value)}
            style={styles.input}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <div>
          <label style={styles.label}>Birim Sayısı</label>
          <input
            type="text"
            value={project.units || ""}
            onChange={(e) => updateProject(category, index, "units", e.target.value)}
            style={styles.input}
          />
        </div>
        <div>
          <label style={styles.label}>Kat Sayısı</label>
          <input
            type="text"
            value={project.floors || ""}
            onChange={(e) => updateProject(category, index, "floors", e.target.value)}
            style={styles.input}
          />
        </div>
      </div>

      {/* Main Image */}
      <div>
        <label style={styles.label}>Ana Görsel</label>
        <div style={{ ...styles.imagePreview, height: "150px" }}>
          {project.image && (
            <Image src={project.image || "/placeholder.svg"} alt={project.title} fill style={{ objectFit: "cover" }} />
          )}
        </div>
        <label style={styles.uploadButton}>
          <Upload size={16} />
          Görsel Yükle
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleImageUpload(e, "projects", category, index)}
          />
        </label>
      </div>

      {/* Gallery */}
      <div style={{ marginTop: "1rem" }}>
        <label style={styles.label}>Galeri Görselleri</label>
        <div style={styles.galleryGrid}>
          {(project.gallery || []).map((img: string, imgIndex: number) => (
            <div key={imgIndex} style={styles.galleryItem}>
              <Image
                src={img || "/placeholder.svg"}
                alt={`Galeri ${imgIndex + 1}`}
                fill
                style={{ objectFit: "cover" }}
              />
              <button style={styles.galleryRemove} onClick={() => removeGalleryImage(category, index, imgIndex)}>
                <X size={14} />
              </button>
              <label style={{ position: "absolute", bottom: "0.25rem", right: "0.25rem", cursor: "pointer" }}>
                <div style={{ padding: "0.25rem", backgroundColor: "rgba(0,0,0,0.7)", borderRadius: "0.25rem" }}>
                  <ImageIcon size={14} color="#fff" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleImageUpload(e, "projects", category, index, imgIndex)}
                />
              </label>
            </div>
          ))}
        </div>
        <button style={styles.addButton} onClick={() => addGalleryImage(category, index)}>
          <Plus size={16} /> Galeri Görseli Ekle
        </button>
      </div>

      {/* Features */}
      <div style={{ marginTop: "1rem" }}>
        <label style={styles.label}>Özellikler</label>
        {(project.features || []).map((feature: string, fIndex: number) => (
          <div key={fIndex} style={styles.itemRow}>
            <input
              type="text"
              value={feature}
              onChange={(e) => updateFeature(category, index, fIndex, e.target.value)}
              style={styles.smallInput}
            />
            <button style={styles.removeItemButton} onClick={() => removeFeature(category, index, fIndex)}>
              <X size={14} />
            </button>
          </div>
        ))}
        <button style={{ ...styles.addButton, marginTop: "0.5rem" }} onClick={() => addFeature(category, index)}>
          <Plus size={16} /> Özellik Ekle
        </button>
      </div>

      {/* Updates for ongoing projects */}
      {category === "ongoing" && (
        <div style={{ marginTop: "1rem" }}>
          <label style={styles.label}>Proje Güncellemeleri</label>
          {(project.updates || []).map((update: any, uIndex: number) => (
            <div
              key={uIndex}
              style={{ backgroundColor: "#52525b", padding: "0.75rem", borderRadius: "0.5rem", marginBottom: "0.5rem" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <input
                  type="month"
                  value={update.date || ""}
                  onChange={(e) => updateProjectUpdate(category, index, uIndex, "date", e.target.value)}
                  style={{ ...styles.smallInput, width: "auto" }}
                />
                <button style={styles.removeItemButton} onClick={() => removeUpdate(category, index, uIndex)}>
                  <X size={14} />
                </button>
              </div>
              <input
                type="text"
                value={update.title || ""}
                onChange={(e) => updateProjectUpdate(category, index, uIndex, "title", e.target.value)}
                placeholder="Başlık"
                style={{ ...styles.smallInput, marginBottom: "0.5rem", width: "100%" }}
              />
              <input
                type="text"
                value={update.description || ""}
                onChange={(e) => updateProjectUpdate(category, index, uIndex, "description", e.target.value)}
                placeholder="Açıklama"
                style={{ ...styles.smallInput, width: "100%" }}
              />
            </div>
          ))}
          <button style={{ ...styles.addButton, marginTop: "0.5rem" }} onClick={() => addUpdate(category, index)}>
            <Plus size={16} /> Güncelleme Ekle
          </button>
        </div>
      )}
    </div>
  )

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>Yönetim</div>
        <nav style={styles.nav}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ ...styles.navButton, ...(activeTab === tab.id ? styles.navButtonActive : {}) }}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} style={styles.logoutButton}>
          <LogOut size={18} />
          Çıkış Yap
        </button>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>{tabs.find((t) => t.id === activeTab)?.label}</h1>
            <span
              style={{
                ...styles.statusBadge,
                ...(githubConnected ? styles.statusConnected : styles.statusDisconnected),
              }}
            >
              {githubConnected ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
              {githubConnected ? "GitHub bağlantısı aktif" : "GitHub bağlantısı yok"}
            </span>
          </div>
          <div style={styles.buttonGroup}>
            <button style={{ ...styles.button, ...styles.refreshButton }} onClick={loadAllContent} disabled={loading}>
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Yenile
            </button>
            <button style={{ ...styles.button, ...styles.saveButton }} onClick={handleSave} disabled={saving}>
              <Save size={16} />
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </div>

        {message && (
          <div style={{ ...styles.alert, ...(message.type === "success" ? styles.alertSuccess : styles.alertError) }}>
            {message.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {message.text}
          </div>
        )}

        {/* Home Tab */}
        {activeTab === "home" && (
          <>
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Hero Bölümü</h3>
              <div>
                <label style={styles.label}>Başlık</label>
                <input
                  type="text"
                  value={content.home?.hero?.title || ""}
                  onChange={(e) => updateContent("hero", e.target.value, "title")}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Alt Başlık</label>
                <input
                  type="text"
                  value={content.home?.hero?.subtitle || ""}
                  onChange={(e) => updateContent("hero", e.target.value, "subtitle")}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Açıklama</label>
                <textarea
                  value={content.home?.hero?.description || ""}
                  onChange={(e) => updateContent("hero", e.target.value, "description")}
                  style={styles.textarea}
                />
              </div>
              <div>
                <label style={styles.label}>Hero Görseli</label>
                <div style={styles.imagePreview}>
                  {content.home?.hero?.image && (
                    <Image
                      src={content.home.hero.image || "/placeholder.svg"}
                      alt="Hero"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  )}
                </div>
                <label style={styles.uploadButton}>
                  <Upload size={16} />
                  Görsel Yükle
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleImageUpload(e, "home", "hero")}
                  />
                </label>
              </div>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Video Bölümü</h3>
              <div>
                <label style={styles.label}>Video URL</label>
                <input
                  type="text"
                  value={content.home?.video?.url || ""}
                  onChange={(e) => updateContent("video", e.target.value, "url")}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Başlık</label>
                <input
                  type="text"
                  value={content.home?.video?.title || ""}
                  onChange={(e) => updateContent("video", e.target.value, "title")}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Alt Başlık</label>
                <input
                  type="text"
                  value={content.home?.video?.subtitle || ""}
                  onChange={(e) => updateContent("video", e.target.value, "subtitle")}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Tecrübe Bölümü</h3>
              <div>
                <label style={styles.label}>Başlık</label>
                <input
                  type="text"
                  value={content.home?.experience?.title || ""}
                  onChange={(e) => updateContent("experience", e.target.value, "title")}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Açıklama</label>
                <textarea
                  value={content.home?.experience?.description || ""}
                  onChange={(e) => updateContent("experience", e.target.value, "description")}
                  style={styles.textarea}
                />
              </div>
            </div>
          </>
        )}

        {activeTab === "about" && (
          <>
            {/* Genel Bilgiler */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Genel Bilgiler</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={styles.label}>Sayfa Başlığı</label>
                  <input
                    type="text"
                    value={content.about?.pageTitle || ""}
                    onChange={(e) => updateDirectField("pageTitle", e.target.value)}
                    style={styles.input}
                  />
                </div>
                <div>
                  <label style={styles.label}>Firma Adı</label>
                  <input
                    type="text"
                    value={content.about?.company?.name || ""}
                    onChange={(e) => updateContent("company", e.target.value, "name")}
                    style={styles.input}
                  />
                </div>
              </div>
              <div>
                <label style={styles.label}>Firma Alt Başlık</label>
                <input
                  type="text"
                  value={content.about?.company?.subtitle || ""}
                  onChange={(e) => updateContent("company", e.target.value, "subtitle")}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Açıklama</label>
                <textarea
                  value={content.about?.description || ""}
                  onChange={(e) => updateDirectField("description", e.target.value)}
                  style={styles.textarea}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={styles.label}>Sertifika</label>
                  <input
                    type="text"
                    value={content.about?.certificate || ""}
                    onChange={(e) => updateDirectField("certificate", e.target.value)}
                    style={styles.input}
                  />
                </div>
                <div>
                  <label style={styles.label}>Sertifika Açıklaması</label>
                  <input
                    type="text"
                    value={content.about?.certificateDescription || ""}
                    onChange={(e) => updateDirectField("certificateDescription", e.target.value)}
                    style={styles.input}
                  />
                </div>
              </div>
            </div>

            {/* Görseller */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Görseller</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={styles.label}>Hero Görseli</label>
                  <div style={{ ...styles.imagePreview, height: "150px" }}>
                    {content.about?.heroImage && (
                      <Image
                        src={content.about.heroImage || "/placeholder.svg"}
                        alt="Hero"
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </div>
                  <label style={styles.uploadButton}>
                    <Upload size={16} />
                    Görsel Yükle
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handleImageUpload(e, "about", "heroImage")}
                    />
                  </label>
                </div>
                <div>
                  <label style={styles.label}>Ofis Görseli</label>
                  <div style={{ ...styles.imagePreview, height: "150px" }}>
                    {content.about?.officeImage && (
                      <Image
                        src={content.about.officeImage || "/placeholder.svg"}
                        alt="Office"
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </div>
                  <label style={styles.uploadButton}>
                    <Upload size={16} />
                    Görsel Yükle
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handleImageUpload(e, "about", "officeImage")}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Firma İletişim Bilgileri */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Firma Bilgileri (Hakkımızda Sayfasında)</h3>
              <div>
                <label style={styles.label}>Adres</label>
                <input
                  type="text"
                  value={content.about?.contact?.address || ""}
                  onChange={(e) => updateContent("contact", e.target.value, "address")}
                  style={styles.input}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={styles.label}>Yetkili</label>
                  <input
                    type="text"
                    value={content.about?.contact?.authorized || ""}
                    onChange={(e) => updateContent("contact", e.target.value, "authorized")}
                    style={styles.input}
                  />
                </div>
                <div>
                  <label style={styles.label}>Telefon</label>
                  <input
                    type="text"
                    value={content.about?.contact?.phone || ""}
                    onChange={(e) => updateContent("contact", e.target.value, "phone")}
                    style={styles.input}
                  />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={styles.label}>Fax</label>
                  <input
                    type="text"
                    value={content.about?.contact?.fax || ""}
                    onChange={(e) => updateContent("contact", e.target.value, "fax")}
                    style={styles.input}
                  />
                </div>
                <div>
                  <label style={styles.label}>Cep Telefonu</label>
                  <input
                    type="text"
                    value={content.about?.contact?.mobile || ""}
                    onChange={(e) => updateContent("contact", e.target.value, "mobile")}
                    style={styles.input}
                  />
                </div>
              </div>
              <div>
                <label style={styles.label}>E-posta</label>
                <input
                  type="email"
                  value={content.about?.contact?.email || ""}
                  onChange={(e) => updateContent("contact", e.target.value, "email")}
                  style={styles.input}
                />
              </div>
            </div>

            {/* İstatistikler */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>İstatistikler</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={styles.label}>Kuruluş Yılı</label>
                  <input
                    type="text"
                    value={content.about?.stats?.founded || ""}
                    onChange={(e) => updateContent("stats", e.target.value, "founded")}
                    style={styles.input}
                  />
                </div>
                <div>
                  <label style={styles.label}>Çalışan Sayısı</label>
                  <input
                    type="text"
                    value={content.about?.stats?.employees || ""}
                    onChange={(e) => updateContent("stats", e.target.value, "employees")}
                    style={styles.input}
                  />
                </div>
                <div>
                  <label style={styles.label}>Tamamlanan Proje</label>
                  <input
                    type="text"
                    value={content.about?.stats?.completedProjects || ""}
                    onChange={(e) => updateContent("stats", e.target.value, "completedProjects")}
                    style={styles.input}
                  />
                </div>
                <div>
                  <label style={styles.label}>Deneyim (Yıl)</label>
                  <input
                    type="text"
                    value={content.about?.stats?.experience || ""}
                    onChange={(e) => updateContent("stats", e.target.value, "experience")}
                    style={styles.input}
                  />
                </div>
              </div>
            </div>

            {/* Vizyon */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Vizyon</h3>
              <div>
                <label style={styles.label}>Başlık</label>
                <input
                  type="text"
                  value={content.about?.vision?.title || ""}
                  onChange={(e) => updateContent("vision", e.target.value, "title")}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Açıklama</label>
                <textarea
                  value={content.about?.vision?.description || ""}
                  onChange={(e) => updateContent("vision", e.target.value, "description")}
                  style={styles.textarea}
                />
              </div>
            </div>

            {/* Misyon */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Misyon</h3>
              <div>
                <label style={styles.label}>Başlık</label>
                <input
                  type="text"
                  value={content.about?.mission?.title || ""}
                  onChange={(e) => updateContent("mission", e.target.value, "title")}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Açıklama</label>
                <textarea
                  value={content.about?.mission?.description || ""}
                  onChange={(e) => updateContent("mission", e.target.value, "description")}
                  style={styles.textarea}
                />
              </div>
            </div>

            {/* Değerlerimiz */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Değerlerimiz</h3>
              <div>
                <label style={styles.label}>Başlık</label>
                <input
                  type="text"
                  value={content.about?.values?.title || ""}
                  onChange={(e) => updateContent("values", e.target.value, "title")}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Açıklama</label>
                <textarea
                  value={content.about?.values?.description || ""}
                  onChange={(e) => updateContent("values", e.target.value, "description")}
                  style={styles.textarea}
                />
              </div>
            </div>

            {/* Neden Biz */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Neden VIERA Construction?</h3>
              <div>
                <label style={styles.label}>Bölüm Başlığı</label>
                <input
                  type="text"
                  value={content.about?.whyUs?.title || ""}
                  onChange={(e) => updateContent("whyUs", e.target.value, "title")}
                  style={styles.input}
                />
              </div>

              <label style={{ ...styles.label, marginTop: "1rem" }}>Maddeler</label>
              {(content.about?.whyUs?.items || []).map((item: WhyUsItem, index: number) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#3f3f46",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span style={{ color: "#a1a1aa", fontSize: "0.875rem" }}>Madde {index + 1}</span>
                    <button style={styles.removeItemButton} onClick={() => removeWhyUsItem(index)}>
                      <X size={14} />
                    </button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0.75rem" }}>
                    <input
                      type="text"
                      value={item.title || ""}
                      onChange={(e) => updateWhyUsItem(index, "title", e.target.value)}
                      placeholder="Başlık"
                      style={styles.input}
                    />
                    <input
                      type="text"
                      value={item.description || ""}
                      onChange={(e) => updateWhyUsItem(index, "description", e.target.value)}
                      placeholder="Açıklama"
                      style={styles.input}
                    />
                  </div>
                </div>
              ))}
              <button style={styles.addButton} onClick={addWhyUsItem}>
                <Plus size={16} /> Madde Ekle
              </button>
            </div>
          </>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <>
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Hero Bölümü</h3>
              <div>
                <label style={styles.label}>Başlık</label>
                <input
                  type="text"
                  value={content.services?.hero?.title || ""}
                  onChange={(e) => updateContent("hero", e.target.value, "title")}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Alt Başlık</label>
                <input
                  type="text"
                  value={content.services?.hero?.subtitle || ""}
                  onChange={(e) => updateContent("hero", e.target.value, "subtitle")}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Giriş Bölümü</h3>
              <div>
                <label style={styles.label}>Badge</label>
                <input
                  type="text"
                  value={content.services?.intro?.badge || ""}
                  onChange={(e) => updateContent("intro", e.target.value, "badge")}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Başlık</label>
                <input
                  type="text"
                  value={content.services?.intro?.title || ""}
                  onChange={(e) => updateContent("intro", e.target.value, "title")}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Açıklama</label>
                <textarea
                  value={content.services?.intro?.description || ""}
                  onChange={(e) => updateContent("intro", e.target.value, "description")}
                  style={styles.textarea}
                />
              </div>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Hizmetler</h3>
              {(content.services?.services || []).map((service: Service, index: number) => (
                <div key={service.id || index} style={styles.serviceCard}>
                  <div style={styles.serviceHeader}>
                    <h4 style={{ fontWeight: 600, color: "#fafafa" }}>{service.title || "Hizmet"}</h4>
                    <button style={styles.deleteButton} onClick={() => removeService(index)}>
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <div>
                      <label style={styles.label}>Başlık</label>
                      <input
                        type="text"
                        value={service.title || ""}
                        onChange={(e) => updateService(index, "title", e.target.value)}
                        style={styles.input}
                      />
                    </div>
                    <div>
                      <label style={styles.label}>Icon</label>
                      <select
                        value={service.icon || "Home"}
                        onChange={(e) => updateService(index, "icon", e.target.value)}
                        style={styles.select}
                      >
                        <option value="Home">Home (Konut)</option>
                        <option value="Building">Building (Ticari)</option>
                        <option value="Landmark">Landmark (Kamu)</option>
                        <option value="Building2">Building2 (Kentsel)</option>
                        <option value="Warehouse">Warehouse (Depo)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={styles.label}>Açıklama</label>
                    <textarea
                      value={service.description || ""}
                      onChange={(e) => updateService(index, "description", e.target.value)}
                      style={styles.textarea}
                    />
                  </div>

                  <div>
                    <label style={styles.label}>Görsel</label>
                    <div style={{ ...styles.imagePreview, height: "150px" }}>
                      {service.image && (
                        <Image
                          src={service.image || "/placeholder.svg"}
                          alt={service.title}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      )}
                    </div>
                    <label style={styles.uploadButton}>
                      <Upload size={16} />
                      Görsel Yükle
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handleImageUpload(e, "services", undefined, index)}
                      />
                    </label>
                  </div>

                  <div style={{ marginTop: "1rem" }}>
                    <label style={styles.label}>Hizmet Özellikleri</label>
                    {(service.items || []).map((item: string, itemIndex: number) => (
                      <div key={itemIndex} style={styles.itemRow}>
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateServiceItem(index, itemIndex, e.target.value)}
                          style={styles.smallInput}
                        />
                        <button style={styles.removeItemButton} onClick={() => removeServiceItem(index, itemIndex)}>
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <button style={{ ...styles.addButton, marginTop: "0.5rem" }} onClick={() => addServiceItem(index)}>
                      <Plus size={16} /> Özellik Ekle
                    </button>
                  </div>
                </div>
              ))}
              <button style={{ ...styles.addButton, marginTop: "1rem" }} onClick={addService}>
                <Plus size={16} /> Yeni Hizmet Ekle
              </button>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>CTA Bölümü</h3>
              <div>
                <label style={styles.label}>Başlık</label>
                <input
                  type="text"
                  value={content.services?.cta?.title || ""}
                  onChange={(e) => updateContent("cta", e.target.value, "title")}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Açıklama</label>
                <textarea
                  value={content.services?.cta?.description || ""}
                  onChange={(e) => updateContent("cta", e.target.value, "description")}
                  style={styles.textarea}
                />
              </div>
            </div>
          </>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <>
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Sayfa Bilgileri</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={styles.label}>Sayfa Başlığı</label>
                  <input
                    type="text"
                    value={content.projects?.pageTitle || ""}
                    onChange={(e) => updateDirectField("pageTitle", e.target.value)}
                    style={styles.input}
                  />
                </div>
                <div>
                  <label style={styles.label}>Sayfa Açıklaması</label>
                  <input
                    type="text"
                    value={content.projects?.pageDescription || ""}
                    onChange={(e) => updateDirectField("pageDescription", e.target.value)}
                    style={styles.input}
                  />
                </div>
              </div>
            </div>

            {/* Tamamlanan Projeler */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Tamamlanan Projeler</h3>
              {(content.projects?.completed || []).map((project: Project, index: number) =>
                renderProjectCard(project, "completed", index),
              )}
              <button style={{ ...styles.addButton, marginTop: "1rem" }} onClick={() => addProject("completed")}>
                <Plus size={16} /> Yeni Proje Ekle
              </button>
            </div>

            {/* Devam Eden Projeler */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Devam Eden Projeler</h3>
              {(content.projects?.ongoing || []).map((project: Project, index: number) =>
                renderProjectCard(project, "ongoing", index),
              )}
              <button style={{ ...styles.addButton, marginTop: "1rem" }} onClick={() => addProject("ongoing")}>
                <Plus size={16} /> Yeni Proje Ekle
              </button>
            </div>

            {/* Başlayacak Projeler */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Başlayacak Projeler</h3>
              {(content.projects?.upcoming || []).map((project: Project, index: number) =>
                renderProjectCard(project, "upcoming", index),
              )}
              <button style={{ ...styles.addButton, marginTop: "1rem" }} onClick={() => addProject("upcoming")}>
                <Plus size={16} /> Yeni Proje Ekle
              </button>
            </div>
          </>
        )}

        {/* Contact Tab */}
        {activeTab === "contact" && (
          <>
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>İletişim Bilgileri</h3>
              <div>
                <label style={styles.label}>Adres</label>
                <textarea
                  value={content.contact?.address || ""}
                  onChange={(e) => updateDirectField("address", e.target.value)}
                  style={styles.textarea}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={styles.label}>Telefon</label>
                  <input
                    type="text"
                    value={content.contact?.phone || ""}
                    onChange={(e) => updateDirectField("phone", e.target.value)}
                    style={styles.input}
                  />
                </div>
                <div>
                  <label style={styles.label}>Cep Telefonu</label>
                  <input
                    type="text"
                    value={content.contact?.mobile || ""}
                    onChange={(e) => updateDirectField("mobile", e.target.value)}
                    style={styles.input}
                  />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={styles.label}>E-posta</label>
                  <input
                    type="email"
                    value={content.contact?.email || ""}
                    onChange={(e) => updateDirectField("email", e.target.value)}
                    style={styles.input}
                  />
                </div>
                <div>
                  <label style={styles.label}>Fax</label>
                  <input
                    type="text"
                    value={content.contact?.fax || ""}
                    onChange={(e) => updateDirectField("fax", e.target.value)}
                    style={styles.input}
                  />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={styles.label}>Yetkili Kişi</label>
                  <input
                    type="text"
                    value={content.contact?.authorized || ""}
                    onChange={(e) => updateDirectField("authorized", e.target.value)}
                    style={styles.input}
                  />
                </div>
                <div>
                  <label style={styles.label}>WhatsApp (ülke kodu ile)</label>
                  <input
                    type="text"
                    value={content.contact?.whatsapp || ""}
                    onChange={(e) => updateDirectField("whatsapp", e.target.value)}
                    style={styles.input}
                    placeholder="905334798387"
                  />
                </div>
              </div>
              <div>
                <label style={styles.label}>Çalışma Saatleri</label>
                <input
                  type="text"
                  value={content.contact?.hours || ""}
                  onChange={(e) => updateDirectField("hours", e.target.value)}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Google Maps Embed URL</label>
                <input
                  type="text"
                  value={content.contact?.mapUrl || ""}
                  onChange={(e) => updateDirectField("mapUrl", e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
