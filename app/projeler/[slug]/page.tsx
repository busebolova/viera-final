import Image from "next/image"
import Link from "next/link"
import {
  ChevronLeft,
  Calendar,
  MapPin,
  Building2,
  Layers,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"
import { getContent } from "@/lib/github-content"

/* -------------------------------------------------- */
/* TEMP / FALLBACK PROJECT DATA                       */
/* -------------------------------------------------- */

const DEFAULT_PROJECTS = {
  completed: [
    {
      id: "validebag-27-28",
      slug: "validebag-27-28-blok",
      title: "Validebağ 27-28 Blok",
      shortDescription: "Altunizade Mah. Kalfa Çeşme Sok. – 56 Daire",
      fullDescription:
        "Altunizade Mahallesi Kalfa Çeşme Sokak'ta konumlanan prestijli konut projemiz. Modern mimarisi ve kaliteli işçiliğiyle öne çıkar.",
      year: "2024",
      location: "Altunizade, Üsküdar – İstanbul",
      details: "56 Daire",
      status: "completed",
      features: ["Modern mimari", "Depreme dayanıklı", "Kapalı otopark", "7/24 güvenlik"],
      mainImage:
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop",
      ],
    },
  ],
}

/* -------------------------------------------------- */
/* DATA HELPERS                                       */
/* -------------------------------------------------- */

async function getProjectsData() {
  try {
    const data = await getContent<any>("projects")
    if (data) return data
  } catch {}
  return DEFAULT_PROJECTS
}

async function getProject(slug: string) {
  const data = await getProjectsData()
  const all = [...(data.completed || []), ...(data.ongoing || []), ...(data.upcoming || [])]
  return all.find((p: any) => p.slug === slug) || null
}

export const dynamic = "force-dynamic"

/* -------------------------------------------------- */
/* PAGE                                               */
/* -------------------------------------------------- */

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const project = await getProject(params.slug)

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-2xl font-bold mb-4">Proje bulunamadı</h1>
        <Link href="/projeler" className="text-sm text-zinc-500 underline">
          Projelere dön
        </Link>
      </div>
    )
  }

  const heroImage =
    project.mainImage ||
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600&auto=format&fit=crop"

  return (
    <div className="min-h-screen pb-20">
      {/* HERO */}
      <div className="relative h-[60vh] min-h-[420px]">
        <Image
          src={heroImage}
          alt={project.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/55" />

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl">
          <div className="backdrop-blur-md bg-white/85 dark:bg-black/60 rounded-2xl p-8">
            <span className="text-xs uppercase tracking-wider text-zinc-500">
              Proje
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mt-2">
              {project.title}
            </h1>
            <p className="mt-3 text-zinc-600 dark:text-zinc-300">
              {project.shortDescription}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 text-sm">
              <div>
                <p className="text-zinc-500">Konum</p>
                <p className="font-medium">{project.location}</p>
              </div>
              <div>
                <p className="text-zinc-500">Yıl</p>
                <p className="font-medium">{project.year}</p>
              </div>
              <div>
                <p className="text-zinc-500">Detay</p>
                <p className="font-medium">{project.details}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-4">Proje Hakkında</h2>
            <p className="text-zinc-600 leading-relaxed">
              {project.fullDescription}
            </p>
          </section>

          {project.features?.length > 0 && (
            <section>
              <h3 className="text-xl font-semibold mb-4">Öne Çıkan Özellikler</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.features.map((f: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4 py-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {project.gallery?.length > 0 && (
            <section>
              <h3 className="text-xl font-semibold mb-4">Galeri</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {project.gallery.map((img: string, i: number) => (
                  <div
                    key={i}
                    className="relative aspect-[4/3] overflow-hidden rounded-xl"
                  >
                    <Image
                      src={img}
                      alt={`${project.title} ${i + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="sticky top-24 h-fit bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6">Proje Bilgileri</h3>

          <div className="space-y-5 text-sm">
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-zinc-500" />
              <span>{project.location}</span>
            </div>
            <div className="flex gap-3">
              <Calendar className="w-5 h-5 text-zinc-500" />
              <span>{project.year}</span>
            </div>
            <div className="flex gap-3">
              <Building2 className="w-5 h-5 text-zinc-500" />
              <span>{project.details}</span>
            </div>
          </div>

          <Link
            href="/iletisim"
            className="mt-8 flex items-center justify-center gap-2 bg-zinc-900 text-white py-3 rounded-xl font-medium"
          >
            Bilgi Al
            <ArrowRight className="w-4 h-4" />
          </Link>
        </aside>
      </div>
    </div>
  )
}
