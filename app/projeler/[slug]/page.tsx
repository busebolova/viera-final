import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Calendar, MapPin, Building2, Layers, ArrowRight, CheckCircle2, Camera } from "lucide-react"
import { getContent } from "@/lib/github-content"

const DEFAULT_PROJECTS = {
  completed: [
    {
      id: "validebag-27-28",
      slug: "validebag-27-28-blok",
      title: "Validebağ 27-28 Blok",
      shortDescription: "Altunizade Mah. Kalfa Çeşme Sok. - 56 Daire",
      fullDescription:
        "Altunizade Mahallesi Kalfa Çeşme Sokak'ta konumlanan prestijli konut projemiz. Modern mimarisi ve kaliteli işçiliğiyle dikkat çeken proje, 56 daireden oluşmaktadır.",
      details: "56 Daire",
      year: "2024",
      location: "Altunizade, Üsküdar - İstanbul",
      mainImage: "/project-1.jpg",
      gallery: [],
      features: ["Modern mimari", "Depreme dayanıklı", "Kapalı otopark", "7/24 güvenlik"],
      status: "completed",
    },
    {
      id: "azade-86",
      slug: "azade-evleri-86-parsel",
      title: "AZADE Evleri 86 Parsel",
      shortDescription: "Barbaros Mah. Mütevelliçeşme Cad. - 36 Daire",
      fullDescription:
        "Barbaros Mahallesi'nde yer alan şık tasarımlı projemiz. Merkezi konumu ve kaliteli malzemeleriyle öne çıkan proje, 36 daireden oluşmaktadır.",
      details: "36 Daire",
      year: "2021",
      location: "Barbaros, Üsküdar - İstanbul",
      mainImage: "/project-2.jpg",
      gallery: [],
      features: ["Merkezi konum", "Kaliteli malzeme", "Akıllı ev sistemleri"],
      status: "completed",
    },
  ],
  ongoing: [
    {
      id: "validebag-29",
      slug: "validebag-29-kentsel-donusum",
      title: "Validebağ 29 Kentsel Dönüşüm",
      shortDescription: "38 Daire - Kaba inşaat tamamlandı",
      fullDescription:
        "Kentsel dönüşüm kapsamında yürütülen modern konut projemiz. 38 daireden oluşan proje, 2025 yılının 3. çeyreğinde tamamlanacaktır.",
      details: "2025 Q3 tamamlanacak",
      year: "2025",
      location: "Altunizade, Üsküdar - İstanbul",
      progress: 65,
      mainImage: "/project-3.jpg",
      gallery: [],
      features: ["Kentsel dönüşüm", "Modern mimari", "Yeşil bina sertifikası"],
      status: "ongoing",
      updates: [
        { date: "2024-12", title: "Kaba İnşaat Tamamlandı", description: "Kaba inşaat aşaması başarıyla bitti." },
      ],
    },
  ],
  upcoming: [
    {
      id: "yeni-proje-2025",
      slug: "yeni-proje-2025",
      title: "Yeni Proje 2025",
      shortDescription: "Yakında başlayacak yeni projemiz",
      fullDescription: "2025 yılında başlayacak yeni konut projemiz hakkında detaylar yakında paylaşılacaktır.",
      details: "Detaylar yakında",
      year: "2025",
      location: "İstanbul",
      mainImage: "/project-4.jpg",
      gallery: [],
      features: [],
      status: "upcoming",
    },
  ],
}

const PLACEHOLDER_HERO = "/placeholder.svg?height=900&width=1600&query=modern+construction+project"
const PLACEHOLDER_GALLERY = "/placeholder.svg?height=600&width=800&query=construction+interior+detail"

async function getProjectsData() {
  try {
    const data = await getContent<any>("projects")
    if (data && (data.completed?.length > 0 || data.ongoing?.length > 0 || data.upcoming?.length > 0)) return data
  } catch {}
  return DEFAULT_PROJECTS
}

async function getProject(slug: string) {
  const projectsData = await getProjectsData()
  const allProjects = [...(projectsData.completed || []), ...(projectsData.ongoing || []), ...(projectsData.upcoming || [])]
  return allProjects.find((p: any) => p.slug === slug) || null
}

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug)
  if (!project) {
    return { title: "Proje Bulunamadı | VIERA Construction", description: "Aradığınız proje bulunamadı." }
  }
  return { title: `${project.title} | VIERA Construction`, description: project.shortDescription }
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug)

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col p-8">
        <h1 className="text-2xl font-bold mb-4">Proje bulunamadı</h1>
        <p className="mb-6 text-zinc-500">Aradığınız proje mevcut değil veya kaldırılmış olabilir.</p>
        <Link href="/projeler" className="inline-flex items-center px-6 py-3 bg-zinc-900 text-white rounded-lg">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Projelere Dön
        </Link>
      </div>
    )
  }

  const statusColors: Record<string, { pill: string; label: string }> = {
    completed: { pill: "bg-emerald-500 text-white", label: "Tamamlandı" },
    ongoing: { pill: "bg-blue-500 text-white", label: "Devam Ediyor" },
    upcoming: { pill: "bg-amber-500 text-white", label: "Başlayacak" },
  }
  const statusInfo = statusColors[project.status] || statusColors.completed

  const heroSrc = project.mainImage || PLACEHOLDER_HERO
  const gallery: string[] = Array.isArray(project.gallery) ? project.gallery : []

  return (
    <div className="min-h-screen pb-16">
      {/* HERO */}
      <section className="relative w-full">
        <div className="relative h-[46vh] min-h-[360px] max-h-[560px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/75 z-10" />
          <Image
            src={heroSrc}
            alt={project.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 z-20 flex items-end">
            <div className="w-full max-w-6xl mx-auto px-4 md:px-6 pb-8 md:pb-12">
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium ${statusInfo.pill}`}>
                {statusInfo.label}
              </span>
              <h1 className="mt-3 text-3xl md:text-5xl font-bold text-white leading-tight">{project.title}</h1>
              <p className="mt-2 text-base md:text-lg text-white/85 max-w-3xl">{project.shortDescription}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pt-8 md:pt-12">
        <Link href="/projeler" className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-700 mb-8">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Tüm Projelere Dön
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* MAIN */}
          <div className="lg:col-span-8 space-y-10">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold mb-4">Proje Hakkında</h
