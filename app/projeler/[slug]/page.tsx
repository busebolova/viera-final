import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, MapPin, Calendar, Building2, Layers, CheckCircle2 } from "lucide-react"
import { getContent } from "@/lib/github-content"

export const dynamic = "force-dynamic"

async function getProject(slug: string) {
  const data = await getContent<any>("projects")

  const all = [
    ...(data?.completed || []),
    ...(data?.ongoing || []),
    ...(data?.upcoming || []),
  ]

  return all.find((p: any) => p.slug === slug) || null
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug)

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Proje bulunamadı</p>
      </div>
    )
  }

  /** 🔴 KRİTİK DÜZELTME */
  const heroImage =
    project.image ||
    project.mainImage ||
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600"

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
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute bottom-0 p-8 max-w-5xl">
          <h1 className="text-4xl font-bold text-white mb-2">
            {project.title}
          </h1>
          <p className="text-white/80">
            {project.shortDescription}
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-10">
          <Link
            href="/projeler"
            className="inline-flex items-center text-sm text-zinc-500 hover:text-black"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Projelere dön
          </Link>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Proje Hakkında</h2>
            <p className="text-zinc-600 leading-relaxed">
              {project.fullDescription}
            </p>
          </div>

          {project.features?.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Özellikler</h3>
              <ul className="grid md:grid-cols-2 gap-3">
                {project.features.map((f: string, i: number) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    {f}
                  </li>
