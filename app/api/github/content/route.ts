import { NextResponse } from "next/server"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_OWNER = process.env.GITHUB_OWNER
const GITHUB_REPO = process.env.GITHUB_REPO
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main"

const DEFAULT_CONTENT: Record<string, any> = {
  home: {
    hero: {
      title: "Viera & Alkan Yapı",
      subtitle: "Güven, Kalite, Profesyonellik",
      description: "60 yılı aşkın tecrübemizle İstanbul'un prestijli projelerinde fark yaratıyoruz.",
      image: "/hero-bg.jpg",
    },
    video: {
      url: "https://cdn.pixabay.com/video/2020/06/23/42926-434300944_large.mp4",
      title: "Viera & Alkan Yapı",
      subtitle: "Güven, Kalite, Profesyonellik",
    },
    stats: {
      founded: "1965",
      foundedLabel: "KURULUŞ YILI",
      employees: "50+",
      employeesLabel: "ÇALIŞAN",
      completedProjects: "100+",
      completedProjectsLabel: "TAMAMLANAN PROJE",
      experience: "60+",
      experienceLabel: "YIL DENEYİM",
    },
    experience: {
      title: "60 Yılı Aşkın Tecrübe",
      description:
        "Kurucumuz Servet Alkan'ın temellerini attığı firmamız, köklü geçmişinden aldığı güçle konut ve iş yeri üretimine aralıksız devam etmektedir.",
    },
    about: {
      badge: "Hakkımızda",
      title: "Firma Geçmişimiz",
      description:
        "Kurucumuz Servet Alkan'ın temellerini attığı firmamız, 60 yılı aşkın deneyimi ve köklü geçmişinden aldığı güçle konut ve iş yeri üretimine aralıksız devam etmektedir.",
      image: "/about-office.jpg",
    },
    whyUs: {
      title: "Neden VIERA Construction?",
      items: [
        { title: "Kalite", description: "Her projede en yüksek kalite standartlarını uyguluyoruz." },
        { title: "Güvenilirlik", description: "Söz verdiğimiz zamanda, söz verdiğimiz kalitede teslim ediyoruz." },
        { title: "Yenilikçilik", description: "Sektördeki en son teknolojileri ve yöntemleri kullanıyoruz." },
        { title: "Sürdürülebilirlik", description: "Çevreye duyarlı projeler geliştiriyoruz." },
      ],
    },
  },
  about: {
    title: "Hakkımızda",
    pageTitle: "Firmamız Hakkında",
    heroImage: "/about-hero.jpg",
    officeImage: "/about-office.jpg",
    description:
      "VIERA Construction - Alkan Yapı & Viera Ortaklığı olarak konut ve iş yeri üretimine aralıksız devam etmekteyiz.",
    certificate: "D Sınıfı Müteahhitlik Belgesi",
    certificateDescription:
      "Deneyimli kadromuz ve modern ekipmanlarımızla müşterilerimizin ihtiyaçlarına en uygun çözümleri sunmaktayız.",
    stats: {
      founded: "1965",
      foundedLabel: "KURULUŞ YILI",
      employees: "50+",
      employeesLabel: "ÇALIŞAN",
      completedProjects: "100+",
      completedProjectsLabel: "TAMAMLANAN PROJE",
      experience: "60+",
      experienceLabel: "YIL DENEYİM",
    },
    company: {
      name: "VIERA Construction",
      subtitle: "Alkan Yapı & Viera Ortaklığı",
      founder: "Servet Alkan",
      founderTitle: "Kurucu",
    },
    contact: {
      address: "Altunizade Mah. Ord. Prof Fahrettin Kerim Gökay Cad. No7/8 Üsküdar - İstanbul",
      authorized: "Erdem Alkan",
      phone: "0216 391 49 40",
      fax: "0216 310 90 74",
      mobile: "0533 479 83 87",
      email: "info@vieraconstruction.com",
    },
    vision: { title: "Vizyonumuz", description: "Türkiye'nin en güvenilir inşaat firması olmak." },
    mission: { title: "Misyonumuz", description: "Kaliteli ve güvenilir projeler üretmek." },
    values: { title: "Değerlerimiz", description: "Dürüstlük, şeffaflık, müşteri odaklılık." },
    whyUs: {
      title: "Neden VIERA Construction?",
      items: [
        { title: "Kalite", description: "En yüksek kalite standartları." },
        { title: "Güvenilirlik", description: "Zamanında teslim." },
      ],
    },
  },
  services: { hero: { title: "Hizmetlerimiz", subtitle: "", image: "/services-hero.jpg" }, intro: {}, services: [], cta: {} },
  projects: { pageTitle: "Projelerimiz", pageDescription: "", completed: [], ongoing: [], upcoming: [] },
  contact: {
    address: "Altunizade Mah. Ord. Prof Fahrettin Kerim Gökay Cad. No7/8 Üsküdar/ İstanbul",
    phone: "0216 391 49 40",
    mobile: "0533 479 83 87",
    email: "info@alkanyapi.com.tr",
    fax: "0216 310 90 74",
    authorized: "Erdem Alkan",
    hours: "Pazartesi - Cuma: 09:00 - 18:00",
    heroImage: "/contact-hero.jpg",
    whatsapp: "905334798387",
  },
}

function getFileParam(request: Request) {
  const { searchParams } = new URL(request.url)
  return searchParams.get("file") || searchParams.get("key") // ✅ ikisini de kabul et
}

export async function GET(request: Request) {
  const file = getFileParam(request)

  if (!file) {
    return NextResponse.json({ error: "Missing file parameter (file/key)" }, { status: 400 })
  }

  const defaultData = DEFAULT_CONTENT[file] || {}

  // ENV yoksa default dön
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return NextResponse.json({
      data: defaultData,
      content: defaultData,
      source: "default",
      config: {
        hasToken: !!GITHUB_TOKEN,
        hasOwner: !!GITHUB_OWNER,
        hasRepo: !!GITHUB_REPO,
      },
    })
  }

  try {
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/content/${file}.json?ref=${GITHUB_BRANCH}`
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
      cache: "no-store",
    })

    if (!res.ok) {
      return NextResponse.json({
        data: defaultData,
        content: defaultData,
        source: "default",
        reason: `GitHub returned ${res.status}`,
      })
    }

    const data = await res.json()
    const decoded = Buffer.from(data.content, "base64").toString("utf-8")
    const parsed = JSON.parse(decoded)

    return NextResponse.json({
      data: parsed,
      content: parsed,
      sha: data.sha,
      source: "github",
    })
  } catch (err: any) {
    return NextResponse.json({
      data: defaultData,
      content: defaultData,
      source: "default",
      reason: err?.message || "Unknown error",
    })
  }
}

export async function POST(request: Request) {
  return PUT(request)
}

export async function PUT(request: Request) {
  if (!GITHUB_TOKEN) return NextResponse.json({ success: false, error: "GITHUB_TOKEN eksik" }, { status: 400 })
  if (!GITHUB_OWNER) return NextResponse.json({ success: false, error: "GITHUB_OWNER eksik" }, { status: 400 })
  if (!GITHUB_REPO) return NextResponse.json({ success: false, error: "GITHUB_REPO eksik" }, { status: 400 })

  try {
    const body = await request.json()

    // ✅ Admin panelin gönderdiği iki formatı da kabul et
    const file = body.file || body.key
    const content = body.content
    const sha = body.sha

    if (!file) return NextResponse.json({ success: false, error: "Dosya adı eksik (file/key)" }, { status: 400 })
    if (content === undefined) return NextResponse.json({ success: false, error: "İçerik eksik" }, { status: 400 })

    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/content/${file}.json`

    let fileSha = sha
    if (!fileSha) {
      const checkRes = await fetch(`${url}?ref=${GITHUB_BRANCH}`, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        cache: "no-store",
      })
      if (checkRes.ok) {
        const checkData = await checkRes.json()
        fileSha = checkData.sha
      }
    }

    const requestBody: any = {
      message: `Update ${file}.json - ${new Date().toLocaleString("tr-TR")}`,
      content: Buffer.from(JSON.stringify(content, null, 2)).toString("base64"),
      branch: GITHUB_BRANCH,
    }
    if (fileSha) requestBody.sha = fileSha

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    const responseData = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: responseData?.message || `GitHub hatası: ${res.status}` },
        { status: res.status },
      )
    }

    return NextResponse.json({ success: true, sha: responseData?.content?.sha, message: "Başarıyla kaydedildi" })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Sunucu hatası" }, { status: 500 })
  }
}
