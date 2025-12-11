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
      certification: {
        title: "Müteahhitlik Belgemiz",
        description: "Firmamız D sınıfı Müteahhitlik Belgesine sahiptir.",
      },
      projects: {
        title: "Projelerimiz",
        description: "60 yılı aşkın sürede 100'den fazla proje başarıyla tamamlanmıştır.",
      },
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
  services: {
    hero: {
      title: "Hizmetlerimiz",
      subtitle: "60 yılı aşkın tecrübemizle modern yaşam alanları inşa ediyoruz.",
      image: "/services-hero.jpg",
    },
    intro: {
      badge: "Uzmanlık Alanlarımız",
      title: "Sunduğumuz Hizmetler",
      description: "Modern ve kaliteli projeler üretiyoruz.",
    },
    services: [
      {
        id: "konut",
        icon: "Home",
        title: "Konut Projeleri",
        description: "Modern yaşam standartlarına uygun konut projeleri geliştiriyoruz.",
        image: "/service-residential.jpg",
        items: [
          { title: "Lüks Apartman Kompleksleri", description: "Modern mimarisi ile" },
          { title: "Rezidans Projeleri", description: "Premium hizmet anlayışıyla" },
          { title: "Villa ve Müstakil Konutlar", description: "Özel yaşam alanları" },
        ],
      },
      {
        id: "ticari",
        icon: "Building",
        title: "Ticari Projeler",
        description: "Fonksiyonel ve prestijli ticari binalar inşa ediyoruz.",
        image: "/service-commercial.jpg",
        items: [
          { title: "İş Merkezleri ve Plazalar", description: "Kurumsal ofis alanları" },
          { title: "Alışveriş Kompleksleri", description: "Modern perakende merkezleri" },
        ],
      },
      {
        id: "karma",
        icon: "Landmark",
        title: "Karma Kullanımlı Projeler",
        description: "Yaşam, iş ve alışveriş alanlarını bir araya getiren entegre yaşam merkezleri.",
        image: "/service-mixed.jpg",
        items: [{ title: "Rezidans-Ofis Kompleksleri", description: "Entegre yaşam alanları" }],
      },
    ],
    cta: {
      title: "Hayalinizdeki Projeyi Birlikte Gerçekleştirelim",
      description: "60 yılı aşkın tecrübemiz ve uzman ekibimizle projelerinizi hayata geçirmek için hazırız.",
    },
  },
  projects: {
    pageTitle: "Projelerimiz",
    pageDescription: "60 yılı aşkın tecrübemizle gerçekleştirdiğimiz projeler",
    heroImage: "/projects-hero.jpg",
    categories: {
      completed: "Tamamlanan Projeler",
      ongoing: "Devam Eden Projeler",
      upcoming: "Başlayacak Projeler",
    },
    completed: [
      {
        id: "validebag-27-28",
        slug: "validebag-27-28-blok",
        title: "Validebağ 27-28 Blok",
        shortDescription: "Altunizade Mah. Kalfa Çeşme Sok. - 56 Daire",
        fullDescription: "Altunizade Mahallesi Kalfa Çeşme Sokak'ta konumlanan prestijli konut projemiz.",
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
        fullDescription: "Barbaros Mahallesi'nde yer alan şık tasarımlı projemiz.",
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
        fullDescription: "Kentsel dönüşüm kapsamında yürütülen modern konut projemiz.",
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
  },
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const file = searchParams.get("file")

  if (!file) {
    return NextResponse.json({ error: "Missing file parameter" }, { status: 400 })
  }

  const defaultData = DEFAULT_CONTENT[file] || {}

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
    const content = JSON.parse(Buffer.from(data.content, "base64").toString("utf-8"))
    return NextResponse.json({
      data: content,
      content: content,
      sha: data.sha,
      source: "github",
    })
  } catch (err: any) {
    return NextResponse.json({
      data: defaultData,
      content: defaultData,
      source: "default",
      reason: err.message,
    })
  }
}

export async function POST(request: Request) {
  return PUT(request)
}

export async function PUT(request: Request) {
  if (!GITHUB_TOKEN) {
    return NextResponse.json(
      {
        success: false,
        error: "GitHub Token eksik. Vercel Dashboard > Settings > Environment Variables'dan GITHUB_TOKEN ekleyin.",
      },
      { status: 400 },
    )
  }

  if (!GITHUB_OWNER) {
    return NextResponse.json(
      {
        success: false,
        error: "GitHub Owner eksik. Vercel Dashboard'dan GITHUB_OWNER (kullanıcı adı) ekleyin.",
      },
      { status: 400 },
    )
  }

  if (!GITHUB_REPO) {
    return NextResponse.json(
      {
        success: false,
        error: "GitHub Repo eksik. Vercel Dashboard'dan GITHUB_REPO (repo adı) ekleyin.",
      },
      { status: 400 },
    )
  }

  try {
    const body = await request.json()
    const { file, content, sha } = body

    if (!file) {
      return NextResponse.json({ success: false, error: "Dosya adı eksik" }, { status: 400 })
    }

    if (!content) {
      return NextResponse.json({ success: false, error: "İçerik eksik" }, { status: 400 })
    }

    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/content/${file}.json`

    let fileSha = sha
    if (!fileSha) {
      try {
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
      } catch {
        // File doesn't exist, will create new
      }
    }

    const requestBody: any = {
      message: `Update ${file}.json - ${new Date().toLocaleString("tr-TR")}`,
      content: Buffer.from(JSON.stringify(content, null, 2)).toString("base64"),
      branch: GITHUB_BRANCH,
    }

    if (fileSha) {
      requestBody.sha = fileSha
    }

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
      if (res.status === 404) {
        // Try creating content folder first
        return NextResponse.json(
          {
            success: false,
            error: `Repo veya klasör bulunamadı. GitHub'da "${GITHUB_OWNER}/${GITHUB_REPO}" reposunda "content" klasörü oluşturun.`,
          },
          { status: 404 },
        )
      }

      if (res.status === 401) {
        return NextResponse.json(
          {
            success: false,
            error: "GitHub Token geçersiz veya süresi dolmuş. GitHub'dan yeni Personal Access Token oluşturun.",
          },
          { status: 401 },
        )
      }

      if (res.status === 403) {
        return NextResponse.json(
          {
            success: false,
            error:
              "GitHub Token yetkisi yetersiz. Token oluştururken 'repo' (Full control of private repositories) seçeneğini işaretleyin.",
          },
          { status: 403 },
        )
      }

      if (res.status === 409) {
        return NextResponse.json(
          {
            success: false,
            error: "Dosya değiştirilmiş. Sayfayı yenileyip tekrar kaydedin.",
          },
          { status: 409 },
        )
      }

      if (res.status === 422) {
        // SHA mismatch - retry without SHA to create new file
        const retryBody = {
          message: `Create ${file}.json - ${new Date().toLocaleString("tr-TR")}`,
          content: Buffer.from(JSON.stringify(content, null, 2)).toString("base64"),
          branch: GITHUB_BRANCH,
        }

        const retryRes = await fetch(url, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(retryBody),
        })

        if (retryRes.ok) {
          const retryResult = await retryRes.json()
          return NextResponse.json({
            success: true,
            sha: retryResult.content?.sha,
            message: "Dosya oluşturuldu",
          })
        }

        return NextResponse.json(
          {
            success: false,
            error: "Dosya oluşturulamadı. GitHub reposunda 'content' klasörünün var olduğundan emin olun.",
          },
          { status: 422 },
        )
      }

      return NextResponse.json(
        {
          success: false,
          error: responseData.message || "Bilinmeyen GitHub hatası",
        },
        { status: res.status },
      )
    }

    return NextResponse.json({
      success: true,
      sha: responseData.content?.sha,
      message: "Başarıyla kaydedildi",
    })
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: `Sunucu hatası: ${err.message}`,
      },
      { status: 500 },
    )
  }
}
