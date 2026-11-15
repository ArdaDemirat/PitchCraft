/* ==========================================================================
   PitchCraft Studio — Data Models, Guided GDD Knowledge Base & Presets
   ========================================================================== */

const CHART_THEMES = {
  "notion-light": {
    name: "Notion Light",
    bg: "#ffffff",
    cardBg: "#f7f7f4",
    cardAlt: "#efefe9",
    border: "#e2e2dc",
    text: "#191918",
    muted: "#6b6b64",
    primary: "#2563eb",
    accents: ["#2563eb", "#7c3aed", "#059669", "#d97706", "#e11d48", "#0891b2"],
    isDark: false
  },
  "linear-dark": {
    name: "Linear Dark",
    bg: "#0f1117",
    cardBg: "#181c26",
    cardAlt: "#202533",
    border: "#2d3345",
    text: "#f3f4f6",
    muted: "#9ca3af",
    primary: "#6366f1",
    accents: ["#818cf8", "#34d399", "#fbbf24", "#f472b6", "#38bdf8", "#a78bfa"],
    isDark: true
  },
  "cyberpunk-neon": {
    name: "Cyberpunk Neon",
    bg: "#090a14",
    cardBg: "#131629",
    cardAlt: "#1a1f38",
    border: "#2f2a63",
    text: "#f0fdfa",
    muted: "#94a3b8",
    primary: "#00f5d4",
    accents: ["#00f5d4", "#f72585", "#fee440", "#4cc9f0", "#b5179e", "#fb5607"],
    isDark: true
  },
  "cozy-pastel": {
    name: "Cozy Pastel",
    bg: "#fdf8f4",
    cardBg: "#fffdf9",
    cardAlt: "#f6ede4",
    border: "#e8dbd0",
    text: "#3a2e28",
    muted: "#847266",
    primary: "#d97757",
    accents: ["#d97757", "#6b9080", "#e9b872", "#c97b84", "#8e9aaf", "#52796f"],
    isDark: false
  },
  "emerald-pro": {
    name: "Emerald Pro",
    bg: "#081713",
    cardBg: "#0f241e",
    cardAlt: "#153028",
    border: "#20473b",
    text: "#ecfdf5",
    muted: "#86efac",
    primary: "#10b981",
    accents: ["#10b981", "#38bdf8", "#f59e0b", "#ec4899", "#a855f7", "#14b8a6"],
    isDark: true
  }
};

const GDD_SECTIONS_META = [
  {
    id: "overview",
    title: "1. Genel Bakış & Elevator Pitch",
    subtitle: "Projenizi 30 saniyede bir yayıncıya veya ekip arkadaşına anlatan özet kart.",
    hasStructuredMeta: true,
    guide: [
      "Oyunun/Projenin türü, platformu ve hedef kitlesi kim?",
      "Asansör Konuşması (Elevator Pitch): '[X oyunu] ile [Y oyununun] birleşimi gibi; ancak [benzersiz fark] sunuyor' kalıbını kullanın.",
      "Benzersiz Satış Önerisi (USP): Oyuncu neden piyasadaki yüzlerce benzer oyun yerine sizinkini oynasın?"
    ],
    examples: [
      {
        game: "Hades",
        text: "Yunan mitolojisinde geçen, her ölümde hikâyenin ve diyalogların ilerlediği hızlı tempolu izometrik roguelike dungeon crawler."
      },
      {
        game: "Slay the Spire",
        text: "Deste kurma (deck-building) mekaniklerini roguelike zindan keşfiyle birleştiren, her kararın hayatta kalmayı belirlediği taktiksel kart oyunu."
      }
    ],
    templateSnippet:
      "Proje Vizyonu: [Oyun/Proje Adı], [Hedef Kitle] için tasarlanmış bir [Tür] deneyimidir.\n\nTemel Kanca (Hook): Oyuncular [ana eylem] yaparak [temel çatışma/hedef] ile yüzleşir; diğer oyunlardan farkı ise [benzersiz mekanik/sistem] sunmasıdır."
  },
  {
    id: "pillars",
    title: "2. Tasarım Sütunları (Design Pillars)",
    subtitle: "Geliştirme boyunca karar verirken pusula görevi görecek 3 temel ilke.",
    hasStructuredPillars: true,
    guide: [
      "Ekip kararsız kaldığında 'Bu özellik oyunumuza uygun mu?' sorusuna cevap verecek 3 ana sütun belirleyin.",
      "Her sütun kısa bir başlık + 1-2 cümlelik 'bu ne demek?' açıklaması içermelidir.",
      "Sütunlar birbirine zıt değil, birbirini destekleyici olmalıdır."
    ],
    examples: [
      {
        game: "Hollow Knight",
        text: "1) Keşifle Ödüllendirme (Harita bile kazanılır) • 2) Keskin & Adil Dövüş • 3) Melankolik, Sözsüz Atmosfer."
      },
      {
        game: "Subnautica",
        text: "1) Silahsız Hayatta Kalma (Korkuyu şiddetle değil kaçışla çöz) • 2) Dikey Derinlik Keşfi • 3) Üs İnşası ile Güvenli Liman."
      }
    ],
    templateSnippet:
      "Sütun 1 — [Örn: Hızlı ve Akıcı Tempo]: Oyuncu hiçbir zaman bekleme ekranında veya gereksiz menüde takılmaz.\nSütun 2 — [Örn: Anlamlı Risk-Ödül Dengesi]: Daha büyük ödül için oyuncu her zaman daha tehlikeli yolu seçebilir.\nSütun 3 — [Örn: Yaşayan Dünya Tepkisi]: Oyuncunun her kararı çevreyi ve NPC'leri kalıcı olarak etkiler."
  },
  {
    id: "mechanics",
    title: "3. Temel Mekanikler & Oynanış (Core Mechanics)",
    subtitle: "Oyuncunun saniye saniye elleriyle yaptığı hareketler, kontroller ve kurallar.",
    guide: [
      "Oyuncu ilk 10 saniyede klavye/fare veya dokunmatik ekranda tam olarak ne yapıyor?",
      "Savaş, hareket, zıplama, inşa, kaynak toplama veya bulmaca çözme kuralları nasıl işliyor?",
      "Kontrol hissi (Game Feel / Juice): Kamera sarsıntısı, hit-stop, ses tepkisi gibi detayları unutmayın."
    ],
    examples: [
      {
        game: "Celeste",
        text: "Sadece 3 temel eylem (Zıpla, Duvara Tutun, Dash) üzerine kurulu; ancak zamanlama ve momentum kombinasyonlarıyla yüzlerce farklı bulmaca doğurur."
      },
      {
        game: "Vampire Survivors",
        text: "Saldırılar otomatiktir; oyuncu yalnızca hareket eder ve doğru pozisyon alarak düşman dalgalarından sıyrılır."
      }
    ],
    templateSnippet:
      "Kontroller: [WASD ile hareket, Sol Tık ile ana eylem, Sağ Tık ile savunma/özel yetenek].\n\nTemel Sistemler:\n• Hareket & Fizik: [Dash, zıplama, stamina kuralları]\n• Etkileşim / Savaş: [Kombo sistemi, zamanlama penceresi, bekleme süreleri]\n• Hata & Ceza: [Hasar alma, yeniden doğma veya kaynak kaybı]"
  },
  {
    id: "loop",
    title: "4. Oyun Döngüsü & İlerleme (Core Loop & Progression)",
    subtitle: "Dakikalık ve saatlik döngüler; oyuncunun neden 50. saatte de oynamaya devam edeceği.",
    guide: [
      "Mikro Döngü (30 sn - 5 dk): Savaş/Topla -> Ödül Kazan -> Güçlen.",
      "Makro Döngü (Seans / Meta): Run bittiğinde veya gün tamamlandığında kalıcı olarak ne açılıyor?",
      "Zorluk Eğrisi: Yeni özellikler oyuncuya hangi sırayla tanıtılıyor?"
    ],
    examples: [
      {
        game: "Stardew Valley",
        text: "Mikro: Tarla sula, maden kaz, kasabalılarla konuş. Makro: Mevsim döngüleri, Topluluk Merkezi görevleri, çiftlik otomasyonu."
      },
      {
        game: "Dead Cells",
        text: "Bölüm geç & hücre topla -> Ölünce merkeze dön -> Kalıcı silah ve mutasyon aç -> Yeni rotalara ulaş."
      }
    ],
    templateSnippet:
      "Mikro Döngü (Anlık): [Görevi başlat] → [Engelleri aş / kaynak topla] → [Anlık ödül seç].\nMakro Döngü (Kalıcı İlerleme): Kazanılan [para/tecrübe birimi] ile ana üste/menüde kalıcı yetenekler ve yeni ekipmanlar açılır.\nZorluk Artışı: Her yeni bölümde [düşman çeşitliliği / zaman baskısı] artar."
  },
  {
    id: "world",
    title: "5. Dünya, Hikâye & Karakterler",
    subtitle: "Evrenin atmosferi, anlatım tarzı, ana karakter motivasyonu ve düşman/NPC rolleri.",
    guide: [
      "Hikâye nasıl anlatılıyor? (Ara sahneler, çevre tasarımı, eşya açıklamaları, kısa diyaloglar?)",
      "Ana karakter kim ve bu yolculuğa neden çıktı?",
      "Dünya neden ilginç? Temel çatışma veya gizem nedir?"
    ],
    examples: [
      {
        game: "Inside / Limbo",
        text: "Tek satır diyalog olmadan tamamen görsel ipuçları ve arka plan olaylarıyla distopik bir dünya anlatır."
      },
      {
        game: "Disco Elysium",
        text: "Karakterin kendi iç sesleri ve zihinsel becerileri birer NPC gibi tartışarak hikâyeyi şekillendirir."
      }
    ],
    templateSnippet:
      "Evren & Atmosfer: Hikâye, [zaman ve mekân] içinde geçer. Dünyadaki temel kriz [çatışma sebebi]dir.\nAna Karakter: [İsim/Rol], kaybettiği [amaç/kişi/hatıra] peşindedir.\nAnlatım Yöntemi: [Kısa dinamik diyaloglar + çevresel ipuçları (Environmental Storytelling)]."
  },
  {
    id: "artAudio",
    title: "6. Sanat Yönetimi, UI/UX & Ses Tasarımı",
    subtitle: "Görsel stil referansları, arayüz okunabilirliği ve ses/müzik yönlendirmesi.",
    guide: [
      "Görsel Stil: 2D Pixel Art, Low-Poly 3D, Hand-Drawn, Cel-Shaded vb. — en yakın 2 görsel referans oyun nedir?",
      "UI / HUD: Ekranda oyuncu sürekli neleri görmek zorunda? (Can, harita, kaynak, mini-hedef).",
      "Ses & Müzik: Çatışma anında müzik dinamik değişiyor mu? Geri bildirim sesleri nasıl?"
    ],
    examples: [
      {
        game: "Persona 5",
        text: "Arayüzün kendisi oyunun karakterini yansıtır; dinamik kamera açıları ve yüksek kontrastlı tipografi kullanır."
      },
      {
        game: "Tunic",
        text: "Oyun içi kullanım kılavuzu sayfalarını toplayarak UI ve mekanikleri keşfetmeyi görsel bir bulmacaya dönüştürür."
      }
    ],
    templateSnippet:
      "Görsel Stil: [Örn: Stylized Low-Poly / 2D Hand-Painted], sıcak ve yüksek kontrastlı renk paleti.\nReferanslar: [Oyun A] + [Oyun B] görsel dili.\nHUD / Arayüz: Minimalist yaklaşım; yalnızca [can barı, aktif yetenek ikonu, mini görev] görünür.\nSes & Müzik: Dinamik adaptif müzik + vuruş/etkileşim seslerinde tatmin edici akustik katmanlar."
  },
  {
    id: "tech",
    title: "7. Teknik Mimari, Kapsam & Üretim Planı",
    subtitle: "Oyun motoru, hedef FPS/platform, ekip rolleri ve kilometre taşları (Milestones).",
    guide: [
      "Hangi motor ve araçlar kullanılıyor? (Unity, Unreal Engine 5, Godot, Web/React vb.)",
      "Hedef performans nedir? (Örn: PC 1080p 60 FPS, Steam Deck uyumluluğu).",
      "Kapsam yönetimi: İlk oynanabilir demo (Vertical Slice) ne zaman hazır olacak?"
    ],
    examples: [
      {
        game: "Balatro",
        text: "Tek geliştirici tarafından LÖVE2D motoruyla sade, modüler ve hızlı iterasyona uygun yapıda geliştirildi."
      },
      {
        game: "Sea of Stars",
        text: "Kendi özel 2D ışıklandırma gölgelendiricileriyle Unity üzerinde geliştirilip önce Vertical Slice demo ile Kickstarter'a çıkıldı."
      }
    ],
    templateSnippet:
      "Motor & Teknoloji: [Unity / Godot / Unreal], sürüm kontrolü için [Git / Plastic SCM].\nHedef Platformlar: [PC (Steam) + Steam Deck doğrulaması], hedef [60 FPS].\nEkip Yapısı: [1 Programcı, 1 2D/3D Sanatçı, 1 Tasarımcı/Ses].\nİlk Hedef: [X ay içinde 15 dakikalık Vertical Slice oynanabilir demo]."
  },
  {
    id: "monetization",
    title: "8. Gelir Modeli, Pazarlama & Topluluk",
    subtitle: "Oyunun nasıl satılacağı, fiyatlandırma stratejisi ve oyunculara ulaşma planı.",
    guide: [
      "Gelir Modeli: Premium tek seferlik satış mı ($14.99), Free-to-Play kozmetik mi, yoksa abonelik/SaaS mı?",
      "İlk 10.000 istek listesi (Wishlist) nasıl gelecek? (Steam Next Fest, TikTok/Shorts geliştirici günlükleri, yayıncılar).",
      "Çıkış sonrası plan: Ücretsiz içerik güncellemeleri veya DLC planı var mı?"
    ],
    examples: [
      {
        game: "Manor Lords",
        text: "Düzenli geliştirme günlükleri ve Steam Next Fest demosu ile çıkış öncesi 3 milyondan fazla Wishlist topladı."
      },
      {
        game: "Lethal Company",
        text: "Düşük fiyat ($9.99) + yayıncı dostu kaotik co-op anları sayesinde organik viral büyüme yakaladı."
      }
    ],
    templateSnippet:
      "Fiyatlandırma & Model: [Tek seferlik $14.99 Premium satış, oyun içi mikro ödeme yok].\nPazarlama Kanalları:\n• Steam Sayfası & Next Fest Demo Katılımı\n• Haftalık kısa oynanış videoları (TikTok, YouTube Shorts, Reddit r/indiedev)\n• Mikro-influencer ve tür odaklı yayıncılara erken anahtar gönderimi."
  }
];

const GENRE_TEMPLATES = {
  roguelike: {
    label: "Aksiyon / Roguelike",
    genre: "Aksiyon Roguelike",
    platform: "PC (Steam), Steam Deck",
    targetAudience: "Hades, Dead Cells ve Risk of Rain 2 seven aksiyon oyuncuları (18-35)",
    elevatorPitch: "Hızlı tempolu kılıç dövüşünü zaman bükme mekanikleriyle birleştiren, her başarısız denemenin yeni sinerjiler açtığı bir aksiyon roguelike.",
    usp: "Düşman saldırılarını durdurup kendi lehine çevirebildiğin Zaman Yankısı (Time Echo) sistemi.",
    pillars: [
      "Hızlı & Affetmeyen Akış: İlk 5 saniyede aksiyona giriş, sıfır bekleme.",
      "Sınırsız Build Sinerjisi: 40+ pasif kalıntı birbiriyle çarpıcı kombinasyonlar üretir.",
      "Ölüm = İlerleme: Her ölüm yeni bir NPC diyaloğu ve kalıcı mekanik açar."
    ]
  },
  rpg: {
    label: "RPG / Hikaye Odaklı",
    genre: "İzometrik RPG / Macera",
    platform: "PC, PlayStation, Xbox",
    targetAudience: "Baldur's Gate, Divinity ve Disco Elysium hayranları",
    elevatorPitch: "Her kararın lonca dengelerini ve haritadaki şehirlerin kaderini kalıcı olarak değiştirdiği, sıra tabanlı taktiksel RPG.",
    usp: "Savaşmadan da ikna, sabotaj veya ittifak kurarak tüm görevlerin çözülebilmesi.",
    pillars: [
      "Anlamlı Seçim ve Sonuç: Her ana görevde en az 3 farklı çözüm yolu.",
      "Taktiksel Çevre Etkileşimi: Yağ, ateş, su ve yükseklik avantajı savaşı belirler.",
      "Derin Yoldaş İlişkileri: Ekip arkadaşları kararlarınıza göre yanınızda kalır veya ayrılır."
    ]
  },
  cozy: {
    label: "Cozy / Yaşam Simülasyonu",
    genre: "Cozy Yönetim & Yaşam Simülasyonu",
    platform: "PC, Nintendo Switch",
    targetAudience: "Stardew Valley, Unpacking ve Animal Crossing seven rahatlatıcı oyun kitlesi",
    elevatorPitch: "Ay ışığında açılan büyülü bir fırını yönetip kasaba halkının anılarına göre özel tatlılar pişirdiğin sıcak bir simülasyon oyunu.",
    usp: "Müşterilerin ruh haline ve mevsimlere göre tariflerin hikâyeleri ortaya çıkarması.",
    pillars: [
      "Sıfır Stres & Zaman Baskısı Yok: Oyuncu kendi hızında dekorasyon ve üretim yapar.",
      "Dokunsal Pişirme Hissi: Hamur yoğurma ve süsleme mini oyunları rahatlatıcı seslerle desteklenir.",
      "Sıcak Kasaba Topluluğu: Her NPC'nin kendine özgü haftalık rutini ve hikâyesi vardır."
    ]
  },
  platformer: {
    label: "Platformer / Metroidvania",
    genre: "2D Precision Platformer / Metroidvania",
    platform: "PC, Switch, Konsollar",
    targetAudience: "Hollow Knight, Celeste ve Ori seven keşif & beceri odaklı oyuncular",
    elevatorPitch: "Manyetik kanca mekaniğiyle birbirine bağlı yeraltı antik saat kulelerini keşfettiğin atmosferik bir Metroidvania.",
    usp: "Hem hareket hem bulmaca hem de boss savaşlarında kullanılan çift kutuplu manyetik kanca.",
    pillars: [
      "Hassas Hareket Hissetimi: Coyote time, input buffering ve akıcı ivmelenme.",
      "Birbirine Bağlı Harita: Kısayolların açılmasıyla anlam kazanan dikey dünya.",
      "Görsel Hikâye Anlatımı: Diyalogdan çok antik kalıntılarla anlatılan tarih."
    ]
  },
  mobile: {
    label: "Mobil / Hybrid-Casual",
    genre: "Hybrid-Casual Strateji / Arcade",
    platform: "iOS & Android",
    targetAudience: "Kısa molalarda (3-5 dk) oynayıp uzun vadeli ilerleme arayan mobil oyuncular",
    elevatorPitch: "Tek parmakla kontrol edilen savunma kulesi aksiyonunu, seanslar arası üs geliştirme meta döngüsüyle birleştiren mobil oyun.",
    usp: "İlk 15 saniyede öğrenilen sürükle-bırak mekaniği + derin kart yükseltme sistemi.",
    pillars: [
      "Tek Elle & Dikey Oynanış: Otobüs veya metroda rahatça oynanabilir ergonomik arayüz.",
      "Anlık Tatmin (Juice): İlk 30 saniyede yüksek görsel ve ses geri bildirimi.",
      "Adil Monetizasyon: Zorunlu reklam yerine ödüllü reklam ve kozmetik paketler."
    ]
  },
  saas: {
    label: "Girişim / Yazılım Projesi",
    genre: "B2B / B2C SaaS Web Uygulaması",
    platform: "Web, Masaüstü & Mobil Tarayıcı",
    targetAudience: "KOBİ ekipleri, serbest çalışanlar ve ürün yöneticileri",
    elevatorPitch: "Ekiplerin dağınık toplantı notlarını ve iş planlarını tek bir akıllı iş akışında otomatik aksiyonlara dönüştüren üretkenlik platformu.",
    usp: "Mevcut araçlarla 5 dakikada kurulan sıfır sürtünmeli entegrasyon ve görsel raporlama.",
    pillars: [
      "Sıfır Kurulum Sürtünmesi: Üyelikten sonraki 60 saniyede ilk somut değer.",
      "Şeffaf İş Akışı: Tüm ekip aynı gerçek zamanlı durumu tek ekranda görür.",
      "Ölçülebilir Zaman Tasarrufu: Haftalık manuel raporlama yükünü %70 azaltır."
    ]
  }
};

const CHECKLIST_CATEGORIES = [
  {
    id: "story",
    title: "1. Sunum Hikâyesi & İlk İzlenim",
    items: [
      {
        id: "chk-hook",
        title: "Tek cümlelik 'Kanca' (Elevator Pitch) hazır",
        why: "Yayıncılar bir sunumun ilk 20 saniyesinde oyunun ne olduğunu anlamazsa ilgisini kaybeder.",
        linkType: "gdd",
        linkTarget: "overview"
      },
      {
        id: "chk-pillars",
        title: "3 Net Tasarım Sütunu (Design Pillars) belirlendi",
        why: "Projenin neden benzersiz ve tutarlı olduğunu yatırımcıya/ekibe kanıtlar.",
        linkType: "gdd",
        linkTarget: "pillars"
      },
      {
        id: "chk-onepage",
        title: "One-Page GDD Özeti gözden geçirildi",
        why: "Sunum sonrası e-posta ekinde gönderilebilecek 1 sayfalık profesyonel özet sağlar.",
        linkType: "view",
        linkTarget: "onepage"
      },
      {
        id: "chk-art-ref",
        title: "Görsel stil & referans oyunlar netleştirildi",
        why: "Henüz tam sanat üretilmemiş olsa bile hedef kaliteyi somutlaştırır.",
        linkType: "gdd",
        linkTarget: "artAudio"
      }
    ]
  },
  {
    id: "gameplay",
    title: "2. Oynanış & Ürün Kanıtı",
    items: [
      {
        id: "chk-coreloop",
        title: "Core Loop (Temel Döngü) diyagramı çizildi",
        why: "Oyuncunun oyunda sürekli ne yapacağını ve neden devam edeceğini 1 bakışta gösterir.",
        linkType: "chart",
        linkTarget: "coreLoop"
      },
      {
        id: "chk-video",
        title: "30-60 saniyelik oynanış videosu/GIF eklendi",
        why: "Konsept çiziminden çok, çalışan bir prototip/oynanış görmek yayıncı güvenini 5 kat artırır.",
        linkType: "gdd",
        linkTarget: "mechanics"
      },
      {
        id: "chk-moscow",
        title: "MoSCoW Kapsam Tablosu (Scope Control) hazır",
        why: "Özellikle küçük ekiplerin 'her şeyi yapacağız' tuzağına düşmediğini ve gerçekçi olduğunu gösterir.",
        linkType: "chart",
        linkTarget: "moscow"
      },
      {
        id: "chk-progression",
        title: "Mikro & Makro ilerleme (Retention) açıklandı",
        why: "Oyunun 2 saatte bitip gitmeyeceğini, uzun soluklu eğlence sunduğunu gösterir.",
        linkType: "gdd",
        linkTarget: "loop"
      }
    ]
  },
  {
    id: "market",
    title: "3. Pazar & Rakip Konumlandırma",
    items: [
      {
        id: "chk-matrix",
        title: "2x2 Rakip Konumlandırma Matrisi oluşturuldu",
        why: "Pazardaki boşluğu ve rakiplerden nasıl ayrıştığınızı görsel olarak kanıtlar.",
        linkType: "chart",
        linkTarget: "matrix"
      },
      {
        id: "chk-core-analysis",
        title: "Rakip Çekirdek & Katman Analizi (Onion Diyagramı) hazırlandı",
        why: "Rakiplerin çekirdek mekaniği, yan mekanikleri ve ilerleme katmanlarının sizin projenizle nasıl ayrıştığını gösterir.",
        linkType: "chart",
        linkTarget: "coreAnalysis"
      },
      {
        id: "chk-radar",
        title: "Hedef Oyuncu / Özellik Radar Grafiği hazır",
        why: "Hedef kitlenin beklentileriyle oyunun odak noktalarının örtüştüğünü gösterir.",
        linkType: "chart",
        linkTarget: "radar"
      },
      {
        id: "chk-comps",
        title: "3 Benzer Referans Oyun (Comps) & satış tahmini var",
        why: "Yatırımcı benzer oyunların başarısına bakarak sizin potansiyel gelirinizi hesaplar.",
        linkType: "gdd",
        linkTarget: "monetization"
      },
      {
        id: "chk-gtm",
        title: "Pazarlama & Wishlist (İstek Listesi) planı yazıldı",
        why: "İyi oyun yapmak yetmez; oyuncuların oyunu nasıl bulacağını bilmeniz gerekir.",
        linkType: "gdd",
        linkTarget: "monetization"
      }
    ]
  },
  {
    id: "plan",
    title: "4. Üretim Takvimi, Bütçe & Ekip",
    items: [
      {
        id: "chk-roadmap",
        title: "Milestone & Yol Haritası (Roadmap) grafiği hazır",
        why: "Yayıncı parasını hangi aşamalarda (Alpha, Beta, Launch) nasıl kullanacağınızı görmek ister.",
        linkType: "chart",
        linkTarget: "roadmap"
      },
      {
        id: "chk-budget",
        title: "Bütçe Dağılımı & Başa Baş (Break-Even) hesaplandı",
        why: "Kaç adet satınca maliyetin çıkacağını bilen geliştirici profesyonel güven verir.",
        linkType: "chart",
        linkTarget: "budget"
      },
      {
        id: "chk-team",
        title: "Ekip rolleri & teknik altyapı belirlendi",
        why: "Yatırımcı fikirden çok o fikri tamamlayabilecek ekibe yatırım yapar.",
        linkType: "gdd",
        linkTarget: "tech"
      },
      {
        id: "chk-ask",
        title: "Net Talep (The Ask): Ne kadar fon/destek istendiği yazıldı",
        why: "Sunumun son slaytında tam olarak ne kadar bütçe, süre veya yayıncı desteği aradığınız net olmalıdır.",
        linkType: "chart",
        linkTarget: "budget"
      }
    ]
  }
];

const CLASSIC_GAME_LOOP_TEMPLATE = {
  title: "Game loop",
  subtitle: "'A detailed series of actions that players are able to do.'",
  classicWireframe: true,
  steps: [
    { title: "Player turn", subItems: [] },
    { title: "Roll dice", subItems: ["Trade", "Auction", "Deposit etc."] },
    { title: "Move to result", subItems: [] },
    { title: "Location", subItems: [] }
  ],
  branches: [
    { condition: "If another player", action: "Pay to opponent" },
    { condition: "Empty", action: "Buy / Pass" },
    { condition: "Already owned", action: "Build" },
    { condition: "Chance etc.", action: "Draw card etc." }
  ],
  resultLabel: "Result",
  endLabel: "Next player",
  footerTag: "PitchCraft Studio"
};

const SAMPLE_PRESETS = {
  "chrono-blade": {
    projectTitle: "Chrono Blade",
    chartTheme: "linear-dark",
    transparentBg: false,
    charts: {
      coreLoop: {
        title: "Chrono Blade — Temel Oynanış Döngüsü",
        subtitle: "15-20 dakikalık her denemede oyuncu güçlenir ve zamanı büker",
        centerTitle: "TEMEL DÖNGÜ",
        centerSub: "15-20 Dk Run",
        nodes: [
          { icon: "⚔️", title: "Odaya Gir & Savaş", desc: "Hızlı yakın dövüş ve dash ile düşman dalgalarını temizle" },
          { icon: "⏳", title: "Zaman Yankısı Topla", desc: "Düşman saldırılarını durdurup krono-parçacık kazan" },
          { icon: "✨", title: "Kalıntı & Build Seç", desc: "3 rastgele güçlendirmeden birini seçerek sinerji kur" },
          { icon: "👑", title: "Bölge Bossu ile Yüzleş", desc: "Kazanılan build ile zaman muhafızını alt et" },
          { icon: "🏛️", title: "Merkeze Dön & Aç", desc: "Kalıcı yetenek ağacı ve yeni silahları açarak güçlen" }
        ]
      },
      gameLoopFlow: {
        title: "Chrono Blade — Detaylı Game Loop",
        subtitle: "'Oyuncunun her odada ve karşılaşmada izleyebildiği dallanan eylem akışı.'",
        classicWireframe: true,
        steps: [
          { title: "Odaya Giriş", subItems: [] },
          { title: "Keşif & Savaş", subItems: ["Yakın Kombo", "Zaman Yankısı", "Dash / Kaçınma"] },
          { title: "Oda Temizliği", subItems: [] },
          { title: "Kapı / Ödül", subItems: [] }
        ],
        branches: [
          { condition: "Normal Oda", action: "Kalıntı Seç" },
          { condition: "Elit / Boss", action: "Silah Evrimi Al" },
          { condition: "Mağaza Odası", action: "Takas / İyileş" },
          { condition: "Oyuncu Ölürse", action: "Merkeze Dön" }
        ],
        resultLabel: "Build Güncelle",
        endLabel: "Sonraki Oda",
        footerTag: "Chrono Blade • Game Loop"
      },
      roadmap: {
        title: "Chrono Blade — Üretim Yol Haritası",
        subtitle: "18 Aylık Geliştirme ve Yayınlama Takvimi",
        phases: [
          {
            name: "Pre-Production",
            date: "Q1 2027",
            status: "Tamamlandı",
            progress: 100,
            items: ["Core combat prototipi", "Tasarım sütunları & GDD", "Sanat stili testi"]
          },
          {
            name: "Vertical Slice",
            date: "Q2 2027",
            status: "Devam Ediyor",
            progress: 65,
            items: ["1 oynanabilir biyom & boss", "15 kalıntı sinerjisi", "Yayıncı pitch demosu"]
          },
          {
            name: "Alpha & Next Fest",
            date: "Q4 2027",
            status: "Planlandı",
            progress: 15,
            items: ["3 biyom & 25 düşman türü", "Steam sayfası & Public Demo", "Next Fest Wishlist kampanyası"]
          },
          {
            name: "Beta & Launch",
            date: "Q2 2028",
            status: "Planlandı",
            progress: 0,
            items: ["Tam hikâye & 5 Boss", "Steam Deck optimizasyonu", "1.0 Global Çıkış"]
          }
        ]
      },
      matrix: {
        title: "2x2 Pazar & Rakip Konumlandırması",
        subtitle: "Aksiyon Roguelike Pazarındaki Fırsat Alanı",
        axisLeft: "Geleneksel / Yavaş Tempo",
        axisRight: "Yüksek Tempo & Akıcı",
        axisBottom: "Lineer / Sabit Build",
        axisTop: "Derin Sinerji & Zaman Mekaniği",
        targetLabel: "Hedef Fırsat Alanı",
        competitors: [
          { name: "Chrono Blade (Biz)", x: 82, y: 84, isOurs: true },
          { name: "Hades", x: 86, y: 66, isOurs: false },
          { name: "Dead Cells", x: 74, y: 58, isOurs: false },
          { name: "Slay the Spire", x: 24, y: 82, isOurs: false },
          { name: "Klasik Dungeon Crawler", x: 30, y: 28, isOurs: false }
        ]
      },
      coreAnalysis: {
        title: "Rakip Çekirdek Katman Analizi (Competitors Core Analysis)",
        subtitle: "Çekirdek Mekanik, Yan Mekanikler, Toplanabilirler ve İlerleme Karşılaştırması",
        useClassicColors: true,
        layerLabels: {
          progression: "PROGRESSION",
          collectibles: "COLLECTIBLES",
          side: "SIDE MECHANICS",
          core: "CORE MECHANIC"
        },
        footerNote:
          "Hedef kitleleri kim? • Neden oynuyorlar? • Hangi oyuncu tiplerini kapsıyorlar? • Temel mekanik yan mekanikler ve ilerleme ile nasıl destekleniyor?",
        games: [
          {
            name: "Chrono Blade (Bizim Oyun)",
            isOurs: true,
            progression: "Kalıcı Zaman Tapınağı & Silah Evrimleri",
            collectibles: "Krono-Kalıntılar & Zaman Kristalleri",
            side: "Zaman Yankısı Parry & Tuzak Yansıtma",
            core: "Hızlı Yakın Dövüş & Zaman Bükme",
            audience: "18-35 Yaş • Başaran & Ustalaşmak İsteyen Aksiyon Oyuncuları",
            whyPlay: "Zamanı dondurup düşman saldırısını kendi lehine çevirme tatmini ve patlayıcı build sinerjileri."
          },
          {
            name: "Hades (Rakip A)",
            isOurs: false,
            progression: "Mirror of Night & NPC Hikâye İlerlemesi",
            collectibles: "Olimpos Lütuf (Boon) & Karanlık Puanı",
            side: "Oda İçi Tuzak & İlişki Hediyeleri",
            core: "İzometrik Dash & Silah Kombosu",
            audience: "Hikâye + Hızlı Aksiyon Sevenler (Keşfeden & Başaran)",
            whyPlay: "Her ölümde gelişen mitolojik diyaloglar ve akıcı silah temposu için tekrar oynanır."
          },
          {
            name: "Dead Cells (Rakip B)",
            isOurs: false,
            progression: "Boss Hücreleri & Kalıcı Rün Yolları",
            collectibles: "Silah Planları (Blueprints) & Parşömenler",
            side: "Kalkan Parry & İkincil Yetenek Slotları",
            core: "2D Metroidvania Platform & Savaş",
            audience: "Yüksek Zorluk & Speedrun Odaklı Hardcore Oyuncular",
            whyPlay: "Sıkı platform hissi, yüksek risk-ödül dengesi ve yüzlerce silah kombinasyonu için oynanır."
          }
        ]
      },
      radar: {
        title: "Oyun Odak & Oyuncu Profili Radarı",
        subtitle: "Chrono Blade Tasarım Dengesi vs. Tür Ortalaması",
        primaryLabel: "Chrono Blade",
        benchmarkLabel: "Tür Ortalaması",
        showBenchmark: true,
        insightTitle: "Tasarım Özeti",
        insightText: "Dövüş hızı ve tekrar oynanabilirlik en yüksek önceliğimiz. Uzun ara sahneler yerine aksiyon içi anlatıma odaklanıyoruz.",
        axes: [
          { label: "Dövüş Hızı", value: 94, benchmark: 75 },
          { label: "Build Derinliği", value: 88, benchmark: 70 },
          { label: "Tekrar Oynanabilirlik", value: 92, benchmark: 80 },
          { label: "Görsel Atmosfer", value: 80, benchmark: 68 },
          { label: "Anlatım / Hikâye", value: 65, benchmark: 55 },
          { label: "Çok Oyunculu", value: 20, benchmark: 35 }
        ]
      },
      budget: {
        title: "Geliştirme Bütçesi & Başa Baş (Break-Even) Analizi",
        subtitle: "18 Aylık Tam Geliştirme Maliyeti ve Steam Net Satış Projeksiyonu",
        currency: "$",
        unitPrice: 14.99,
        platformFeePct: 30,
        slices: [
          { label: "Yazılım & Tasarım", amount: 52000 },
          { label: "2D/3D Sanat & Animasyon", amount: 38000 },
          { label: "Ses Tasarımı & Müzik", amount: 12000 },
          { label: "Pazarlama & Lokalizasyon", amount: 18000 }
        ]
      },
      moscow: {
        title: "MoSCoW Kapsam Yönetimi (1.0 Sürümü)",
        subtitle: "Takvimi ve bütçeyi korumak için net özellik sınırlandırması",
        must: [
          "Akıcı yakın dövüş + Zaman Yankısı mekaniği",
          "3 farklı biyom ve 4 benzersiz Boss",
          "40+ kalıntı ve silah yükseltme ağacı",
          "60 FPS PC & tam kontrolcü desteği"
        ],
        should: [
          "Türkçe, İngilizce, Almanca, Japonca dil desteği",
          "Günlük mücadele (Daily Run) liderlik tablosu",
          "Steam Başarımları & Cloud Save"
        ],
        could: [
          "Özel Boss Rush modu",
          "Görsel kostüm ve kılıç kaplamaları",
          "Gelişmiş erişilebilirlik & renk körü modları"
        ],
        wont: [
          "Çevrimiçi Co-op / PvP (Çıkış sonrası DLC)",
          "Mobil iOS/Android portu (1.0 sonrası)",
          "Oyun içi mikro ödeme (Kesinlikle yok)"
        ]
      }
    },
    gdd: {
      genreKey: "roguelike",
      meta: {
        genre: "Aksiyon Roguelike",
        platform: "PC (Steam), Steam Deck",
        targetAudience: "Hades, Dead Cells ve Katana Zero seven aksiyon oyuncuları (18-35)",
        elevatorPitch:
          "Chrono Blade, hızlı yakın dövüşü zaman bükme mekanikleriyle birleştiren izometrik bir aksiyon roguelike oyunudur. Oyuncu düşman saldırılarını dondurup kendi lehine çevirir; her ölüm ise kuledeki gizli zaman çizgilerini ve yeni silah sinerjilerini açar.",
        usp: "Zaman Yankısı (Time Echo) sistemi: Düşmanların son 3 saniyelik saldırılarını yakalayıp kombolarına ekle."
      },
      sections: {
        overview:
          "Proje Vizyonu: Chrono Blade, kısa ama yüksek tempolu seanslarda ustalık hissi yaşatan bir aksiyon roguelike deneyimidir.\n\nAna Kanca: Oyuncular her 15-20 dakikalık denemede rastgele odalardan geçerken zamanı manipüle eden kalıntılar toplar ve yıkılan saat kulesinin sırrını çözer.",
        pillars:
          "Sütun 1 — Keskin ve Affetmeyen Akış: İlk 5 saniyede aksiyona giriş; bekleme ekranı veya uzun eğitim duvarları yok.\nSütun 2 — Patlayıcı Build Sinerjisi: Her kalıntı bir diğeriyle çarpıcı kombinasyonlar üretir.\nSütun 3 — Ölüm Anlamlıdır: Her başarısız run, merkezdeki NPC ilişkilerini ve kalıcı yetenekleri ileri taşır.",
        mechanics:
          "Kontroller: WASD hareket, Sol Tık 3 vuruşlu kılıç kombosu, Sağ Tık Zaman Yankısı kalkanı, Boşluk ile I-frame Dash.\n\nGame Feel: Kusursuz zamanlamalı parry anında 60ms hit-stop, ekran parlaması ve zamanın 2 saniye yavaşlaması oyuncuya güçlü bir ustalık hissi verir.",
        loop:
          "Mikro Döngü: Odaya gir -> Düşmanları temizle -> 3 Krono-Kalıntıdan birini seç -> Bir sonraki kapıyı seç.\nMakro Döngü: Ölüm sonrası Zaman Tapınağı'na dönüş -> Toplanan Krono-Kristallerle kalıcı silah evrimleri aç.",
        world:
          "Evren: Zamanın kırıldığı, gökyüzünde dev dişlilerin asılı kaldığı 'Aethelgard Saat Kulesi'.\nAna Karakter: Hafızasını kaybetmiş eski zaman muhafızı Kael; bozulan saat çekirdeğini yeniden başlatmaya çalışır.",
        artAudio:
          "Görsel Stil: Stylized Low-Poly 3D modeller üzerinde keskin el boyaması dokular ve yüksek kontrastlı neon-altın efektler.\nReferanslar: Hades + Death's Door.\nSes: Dinamik synth-orkestra hibrit müzik; boss fazlarında tempo yükselir.",
        tech:
          "Motor: Unity (URP), C# modüler yetenek mimarisi.\nHedef: PC 1080p 60 FPS sabit, Steam Deck Verified.\nEkip: 2 Programcı, 1 Teknik Sanatçı, 1 Tasarımcı/Ses.",
        monetization:
          "Fiyat: $14.99 (Türkiye ve bölgesel fiyatlandırma dahil), mikro ödeme yok.\nPazarlama: Steam Next Fest için 20 dakikalık ücretsiz demo, haftalık TikTok/Shorts kombo videoları ve roguelike yayıncılarına erken anahtar gönderimi."
      }
    },
    checklist: {
      "chk-hook": true,
      "chk-pillars": true,
      "chk-coreloop": true,
      "chk-matrix": true,
      "chk-roadmap": true,
      "chk-budget": true
    }
  },

  "moonlight-bakery": {
    projectTitle: "Moonlight Bakery",
    chartTheme: "cozy-pastel",
    transparentBg: false,
    charts: {
      coreLoop: {
        title: "Moonlight Bakery — Günlük Cozy Döngü",
        subtitle: "Stres olmadan rahatlatıcı toplama, pişirme ve kasaba ilişkileri",
        centerTitle: "GECE FIRINI",
        centerSub: "1 Oyun Günü = 8 Dk",
        nodes: [
          { icon: "🌿", title: "Malzeme Topla", desc: "Ay ışığı ormanından nadir meyve ve büyülü unlar bul" },
          { icon: "🥐", title: "Tatlıları Pişir", desc: "Rahatlatıcı mini oyunlarla hamur yoğur ve süsle" },
          { icon: "🕯️", title: "Fırını Aç & Sun", desc: "Gece gelen kasabalılara ruh hallerine göre servis yap" },
          { icon: "💌", title: "Hikâyeleri Dinle", desc: "Müşterilerle dostluk kur, özel gizli tarifler öğren" },
          { icon: "🏡", title: "Fırını Güzelleştir", desc: "Kazançla yeni mobilyalar, fırınlar ve bahçe dekoru al" }
        ]
      },
      gameLoopFlow: {
        title: "Moonlight Bakery — Günlük Akış Döngüsü",
        subtitle: "'Gündüz hazırlıktan gece servisine uzanan karar ve eylem dallanmaları.'",
        classicWireframe: true,
        steps: [
          { title: "Sabah Hazırlık", subItems: [] },
          { title: "Malzeme Topla", subItems: ["Orman Keşfi", "Sera Hasadı", "Pazar Takası"] },
          { title: "Fırını Aç", subItems: [] },
          { title: "Müşteri Talebi", subItems: [] }
        ],
        branches: [
          { condition: "Özel Anı Talebi", action: "Duygu Tarifi Pişir" },
          { condition: "Klasik Sipariş", action: "Hızlı Servis Et" },
          { condition: "Kasabalı Sohbeti", action: "İlişki / Hikâye Aç" },
          { condition: "Gece Biterse", action: "Kazanç & Dekor Al" }
        ],
        resultLabel: "Gün Özeti",
        endLabel: "Yeni Gün",
        footerTag: "Moonlight Bakery • Game Loop"
      },
      roadmap: {
        title: "Moonlight Bakery — Yayın Yol Haritası",
        subtitle: "12 Aylık Bağımsız Geliştirme Planı",
        phases: [
          {
            name: "Prototip & Tarifler",
            date: "Q1 2027",
            status: "Tamamlandı",
            progress: 100,
            items: ["Pişirme mini oyunları", "2D izometrik fırın haritası", "İlk 5 NPC diyaloğu"]
          },
          {
            name: "Demo & Cozy Fest",
            date: "Q2 2027",
            status: "Devam Ediyor",
            progress: 50,
            items: ["Wholesome Direct başvurusu", "15 tarif & 3 günlük demo", "Steam Wishlist açılışı"]
          },
          {
            name: "İçerik Üretimi",
            date: "Q3 2027",
            status: "Planlandı",
            progress: 10,
            items: ["4 mevsim & 45 tarif", "Dekorasyon kataloğu (80+ eşya)", "Orijinal Lo-Fi akustik müzik"]
          },
          {
            name: "PC & Switch Çıkış",
            date: "Q4 2027",
            status: "Planlandı",
            progress: 0,
            items: ["Tam lokalizasyon (8 dil)", "Nintendo Switch portu", "1.0 Cozy Lansman"]
          }
        ]
      },
      matrix: {
        title: "Cozy Simülasyon Pazarı Konumlandırması",
        subtitle: "Zaman Baskısız Hikâye Odaklı Fırın Deneyimi",
        axisLeft: "Yüksek Zaman Baskısı / Kaotik",
        axisRight: "Rahatlatıcı / Kendi Hızında",
        axisBottom: "Sadece Mekanik Yönetim",
        axisTop: "Derin Karakter Hikâyeleri",
        targetLabel: "Mavi Okyanus Alanı",
        competitors: [
          { name: "Moonlight Bakery (Biz)", x: 84, y: 82, isOurs: true },
          { name: "Coffee Talk", x: 78, y: 88, isOurs: false },
          { name: "Overcooked", x: 14, y: 20, isOurs: false },
          { name: "Good Pizza, Great Pizza", x: 48, y: 45, isOurs: false },
          { name: "Stardew Valley", x: 70, y: 74, isOurs: false }
        ]
      },
      coreAnalysis: {
        title: "Rakip Çekirdek Katman Analizi (Moonlight Bakery)",
        subtitle: "Pişirme Çekirdeği, Yan Mekanikler ve Uzun Vadeli Cozy İlerleme Kıyaslaması",
        useClassicColors: true,
        layerLabels: {
          progression: "PROGRESSION",
          collectibles: "COLLECTIBLES",
          side: "SIDE MECHANICS",
          core: "CORE MECHANIC"
        },
        footerNote:
          "Hedef kitleleri kim? • Neden bu oyunları oynuyorlar? • Hangi oyuncu tiplerini kapsıyorlar? • Çekirdek mekanik yan mekanikler ve ilerlemeyle nasıl destekleniyor?",
        games: [
          {
            name: "Moonlight Bakery (Bizim Oyun)",
            isOurs: true,
            progression: "Fırın Büyütme & Kasaba Hikâye Zinciri",
            collectibles: "Büyülü Tarifler & Duygu Malzemeleri",
            side: "Ormanda Toplama & Fırın Dekorasyonu",
            core: "Dokunsal Tatlı Pişirme & Servis",
            audience: "Cozy Kitle • Rahatlama & Hikâye Odaklı (Keşfeden & Sosyalleşen)",
            whyPlay: "Zaman baskısı olmadan rahatlatıcı ASMR pişirme hissi ve duygusal kasaba dostlukları."
          },
          {
            name: "Coffee Talk (Rakip A)",
            isOurs: false,
            progression: "Günlük Epizodik Hikâye Dallanması",
            collectibles: "Gizli İçecek Tarifleri & Kısa Öyküler",
            side: "Akıllı Telefon Akışı & Müzik Seçimi",
            core: "İçecek Hazırlama & Diyalog Seçimi",
            audience: "Görsel Roman & Lo-Fi Atmosfer Seven Oyuncular",
            whyPlay: "Gece atmosferinde karakterlerin hayat dertlerini dinleyip doğru içeceği sunmak için."
          },
          {
            name: "Good Pizza, Great Pizza (Rakip B)",
            isOurs: false,
            progression: "Yeni Malzemeler & Rakip Dükkân Hikâyesi",
            collectibles: "Dekorasyon Eşyaları & Başarımlar",
            side: "Teslimat Siparişleri & Bahçe Bakımı",
            core: "Zamanlı Sipariş Hazırlama",
            audience: "Mobil & Casual Yönetim Oyuncuları (Başaran)",
            whyPlay: "Kısa seanslarda hızlı sipariş çözüp dükkân ekonomisini büyütmek için."
          }
        ]
      },
      radar: {
        title: "Oyuncu Deneyimi Dengesi",
        subtitle: "Cozy Topluluk Beklentileriyle Uyum",
        primaryLabel: "Moonlight Bakery",
        benchmarkLabel: "Cozy Tür Ortalaması",
        showBenchmark: true,
        insightTitle: "Odak Noktamız",
        insightText: "Zorluk ve rekabet yerine sıcak atmosfer, dokunsal ses tasarımı ve duygusal NPC bağlarına yatırım yapıyoruz.",
        axes: [
          { label: "Rahatlatıcılık", value: 96, benchmark: 82 },
          { label: "Karakter Hikâyesi", value: 90, benchmark: 70 },
          { label: "Dekorasyon / Özelleştirme", value: 85, benchmark: 76 },
          { label: "Ses & Müzik Hissi", value: 92, benchmark: 72 },
          { label: "Mekanik Zorluk", value: 30, benchmark: 45 },
          { label: "Tekrar Oynanabilirlik", value: 78, benchmark: 68 }
        ]
      },
      budget: {
        title: "Üretim Bütçesi & Başa Baş Hesabı",
        subtitle: "Küçük Ekip (2 Kişi) 12 Aylık Bağımsız Bütçe",
        currency: "$",
        unitPrice: 12.99,
        platformFeePct: 30,
        slices: [
          { label: "Geliştirme & Tasarım", amount: 24000 },
          { label: "2D Çizim & Karakterler", amount: 18000 },
          { label: "Lo-Fi Müzik & SFX", amount: 6500 },
          { label: "Pazarlama & Festivaller", amount: 7500 }
        ]
      },
      moscow: {
        title: "MoSCoW Kapsam Planı (Moonlight Bakery)",
        subtitle: "İlk sürümde odaklanılan ve ertelenen özellikler",
        must: [
          "30 büyülü tatlı tarifi ve pişirme mini oyunları",
          "10 kasabalı NPC ile derinleşen diyalog hikâyeleri",
          "Fırın içi masa, ışık ve bitki dekorasyon sistemi",
          "Gündüz malzeme toplama / gece servis döngüsü"
        ],
        should: [
          "Kedi & baykuş evcil hayvan dostları",
          "Mevsimsel festival günleri ve özel tarifler",
          "Fotoğraf modu (Oyuncuların fırınını paylaşması için)"
        ],
        could: [
          "Özel tarif defteri dışa aktarma kartları",
          "Dinamik yağmur ve şömine ambiyans ayarları"
        ],
        wont: [
          "Zamanlayıcıya bağlı müşteri sinirlenme cezası",
          "Çok oyunculu rekabetçi mod"
        ]
      }
    },
    gdd: {
      genreKey: "cozy",
      meta: {
        genre: "Cozy Yönetim & Hikâye Simülasyonu",
        platform: "PC (Steam), Nintendo Switch",
        targetAudience: "Coffee Talk, Stardew Valley ve Unpacking seven rahatlatıcı oyun oyuncuları",
        elevatorPitch:
          "Yalnızca gece yarısı açılan büyülü bir fırını devraldığınız; kasaba halkının anılarına dokunan sıcak tatlılar pişirerek hikâyelerini iyileştirdiğiniz stresiz bir cozy simülasyon.",
        usp: "Müşterilerin anlattığı anılardan doğru 'duygu malzemesini' seçip tatlıya ekleme mekaniği."
      },
      sections: {
        overview:
          "Moonlight Bakery, oyunculara günlük hayatın stresinden uzaklaşıp sıcak bir fırın atmosferinde nefes alma alanı sunar.",
        pillars:
          "Sütun 1 — Sıfır Stres & Zaman Baskısı Yok.\nSütun 2 — Dokunsal & Duyusal Pişirme Hissi.\nSütun 3 — Anlamlı Kasaba Dostlukları.",
        mechanics:
          "Gündüz orman ve seradan malzeme toplama; gece fırını açıp hamur yoğurma, fırınlama ve süsleme mini oyunlarıyla sipariş hazırlama.",
        loop:
          "Mikro: Sipariş sohbeti -> Malzeme & duygu seçimi -> Tatlı pişirme -> Müşteri tepkisi.\nMakro: Kazanılan yıldız tozuyla fırını büyütme ve yeni kasaba bölgelerini açma.",
        world:
          "Sisli dağların eteğindeki Fenerli Vadi kasabası; herkesin uykuya daldığı saatlerde yalnızca fırının sıcak ışığı yanar.",
        artAudio:
          "El çizimi suluboya dokular, sıcak amber ışıklar, çıtırdayan fırın ve yağmur sesleri eşliğinde lo-fi piyano.",
        tech:
          "Godot 4 Engine, hafif 2D sahneler, düşük sistem gereksinimi (Switch ve eski laptoplar için 60 FPS).",
        monetization:
          "$12.99 fiyat etiketi. Wholesome Direct, Steam Cozy Fest ve TikTok/Instagram'da 'Bugün hangi tatlıyı pişiriyoruz?' serisi ile organik büyüme."
      }
    },
    checklist: {
      "chk-hook": true,
      "chk-pillars": true,
      "chk-coreloop": true,
      "chk-art-ref": true
    }
  },

  "flowpulse": {
    projectTitle: "FlowPulse",
    chartTheme: "notion-light",
    transparentBg: false,
    charts: {
      coreLoop: {
        title: "FlowPulse — Ürün Kullanım & Büyüme Döngüsü",
        subtitle: "Kullanıcının ilk dakikadan ekip içi viral yayılıma uzanan döngüsü",
        centerTitle: "ÜRÜN DÖNGÜSÜ",
        centerSub: "Haftalık Ritim",
        nodes: [
          { icon: "📥", title: "Toplantıyı Bağla", desc: "Takvim ve ses özetini tek tıkla içeri aktar" },
          { icon: "⚡", title: "Aksiyonları Çıkar", desc: "Otomatik görev, sorumlu ve tarih listesi oluştur" },
          { icon: "📊", title: "Canlı Panelde İzle", desc: "Ekibin haftalık tıkanıklıklarını tek bakışta gör" },
          { icon: "🔗", title: "Ekiple Paylaş", desc: "Slack/Notion'a tek tıkla özet gönder" },
          { icon: "🚀", title: "Yeni Üyeleri Çek", desc: "Paylaşılan raporlarla diğer ekipler de katılır" }
        ]
      },
      gameLoopFlow: {
        title: "FlowPulse — Ürün Akış & Karar Döngüsü",
        subtitle: "'Toplantı tetikleyicisinden otomatik aksiyon dallanmalarına ürün akışı.'",
        classicWireframe: true,
        steps: [
          { title: "Toplantı Biter", subItems: [] },
          { title: "Notları Tara", subItems: ["Ses Özetle", "Kararları Ayıkla", "Sorumlu Ata"] },
          { title: "Doğrulama", subItems: [] },
          { title: "Öğe Türü", subItems: [] }
        ],
        branches: [
          { condition: "Yeni Görev İse", action: "Linear/Jira'ya Ekle" },
          { condition: "Doküman Kararı", action: "Notion'a Kaydet" },
          { condition: "Acil Engel Varsa", action: "Slack Uyarısı At" },
          { condition: "Hafta Sonu", action: "Yönetici Özeti Üret" }
        ],
        resultLabel: "Takip Paneli",
        endLabel: "Yeni Döngü",
        footerTag: "FlowPulse • Product Loop"
      },
      roadmap: {
        title: "FlowPulse — İş Planı & Ürün Yol Haritası",
        subtitle: "Tohum Yatırım (Pre-Seed) Sonrası 12 Aylık Büyüme Planı",
        phases: [
          {
            name: "MVP & Beta",
            date: "Q1 2027",
            status: "Tamamlandı",
            progress: 100,
            items: ["20 pilot KOBİ ile test", "Google Meet & Zoom entegrasyonu", "Otomatik görev çıkarımı"]
          },
          {
            name: "V1 Lansman",
            date: "Q2 2027",
            status: "Devam Ediyor",
            progress: 70,
            items: ["Self-serve ödeme altyapısı", "Notion & Linear 2-yönlü senkron", "Product Hunt lansmanı"]
          },
          {
            name: "Büyüme & B2B",
            date: "Q3 2027",
            status: "Planlandı",
            progress: 20,
            items: ["Takım analitiği & yönetici raporu", "SSO & kurumsal güvenlik", "1.000 aktif ödeyen ekip hedefi"]
          },
          {
            name: "Global Ölçek",
            date: "Q4 2027",
            status: "Planlandı",
            progress: 0,
            items: ["Çoklu dil (EN, DE, TR)", "API & Webhook pazaryeri", "Seri A hazırlığı ($50K MRR)"]
          }
        ]
      },
      matrix: {
        title: "Rekabet Matrisi — İş Akışı & Toplantı Araçları",
        subtitle: "Kurulum Kolaylığı vs. Otomatik Aksiyon Derinliği",
        axisLeft: "Ağır Kurulum & Karmaşık",
        axisRight: "60 Saniyede Sıfır Kurulum",
        axisBottom: "Sadece Pasif Not Alma",
        axisTop: "Otomatik Görev & Takip",
        targetLabel: "Hedef Pazar Boşluğu",
        competitors: [
          { name: "FlowPulse (Biz)", x: 86, y: 85, isOurs: true },
          { name: "Geleneksel PM Araçları", x: 25, y: 72, isOurs: false },
          { name: "Basit Not Uygulamaları", x: 80, y: 28, isOurs: false },
          { name: "Toplantı Kayıt Botları", x: 64, y: 46, isOurs: false },
          { name: "E-Tablo / Manuel Takip", x: 40, y: 18, isOurs: false }
        ]
      },
      coreAnalysis: {
        title: "Rakip Ürün Katman Analizi (Product Core Analysis)",
        subtitle: "Çekirdek Değer, Yardımcı İş Akışları ve Uzun Vadeli Tutundurma Katmanları",
        useClassicColors: true,
        layerLabels: {
          progression: "RETENTION / ÖLÇEK",
          collectibles: "ÇIKTILAR / VARLIKLAR",
          side: "YARDIMCI ARAÇLAR",
          core: "ÇEKİRDEK DEĞER"
        },
        footerNote:
          "Hedef kullanıcı kim? • Ürünü neden kullanıyorlar? • Hangi kullanıcı profillerini kapsıyor? • Çekirdek değer yan özellikler ve ölçeklenmeyle nasıl güçleniyor?",
        games: [
          {
            name: "FlowPulse (Bizim Ürün)",
            isOurs: true,
            progression: "Ekip Analitiği & Haftalık Hedef Takibi",
            collectibles: "Otomatik Özet Raporları & Karar Arşivi",
            side: "Slack/Notion 2-Yönlü Senkron & Uyarılar",
            core: "Toplantıdan Otomatik Görev Çıkarma",
            audience: "10-100 Kişilik Teknoloji Ekipleri & Ürün Yöneticileri",
            whyPlay: "Sıfır manuel veri girişiyle toplantı kararlarının takipsiz kaybolmasını önlediği için."
          },
          {
            name: "Geleneksel PM Araçları",
            isOurs: false,
            progression: "Sprint Raporları & Kurumsal Portföy",
            collectibles: "Ticket Geçmişi & Doküman Bağları",
            side: "Özel Alanlar & Manuel Otomasyonlar",
            core: "Manuel Görev & Pano Yönetimi",
            audience: "Büyük Kurumsal Mühendislik Departmanları",
            whyPlay: "Detaylı süreç kontrolü sunar ancak kurulum ve günlük güncelleme yükü ağırdır."
          },
          {
            name: "Toplantı Kayıt Botları",
            isOurs: false,
            progression: "Aranabilir Toplantı Kütüphanesi",
            collectibles: "Transkriptler & Video Klipler",
            side: "Anahtar Kelime Etiketleme",
            core: "Ses Kaydı & Metin Özeti",
            audience: "Bireysel Satış & Danışmanlık Ekipleri",
            whyPlay: "Konuşulanları kaydeder fakat iş takip araçlarına canlı aksiyon olarak aktarmaz."
          }
        ]
      },
      radar: {
        title: "Ürün Yetenek & Değer Önerisi Radarı",
        subtitle: "FlowPulse vs. Geleneksel Proje Yönetim Araçları",
        primaryLabel: "FlowPulse",
        benchmarkLabel: "Sektör Ortalaması",
        showBenchmark: true,
        insightTitle: "Yatırımcı Özeti",
        insightText: "Karmaşık menüler yerine kurulum hızı ve otomatik takip üzerine odaklanarak KOBİ'lerde adaptasyon süresini %80 düşürüyoruz.",
        axes: [
          { label: "Kurulum Hızı", value: 95, benchmark: 45 },
          { label: "Otomasyon", value: 90, benchmark: 60 },
          { label: "Kullanım Kolaylığı", value: 92, benchmark: 58 },
          { label: "Entegrasyon", value: 82, benchmark: 75 },
          { label: "Raporlama", value: 85, benchmark: 70 },
          { label: "Fiyat Avantajı", value: 88, benchmark: 50 }
        ]
      },
      budget: {
        title: "12 Aylık Maliyet Dağılımı & Başa Baş (Break-Even)",
        subtitle: "Yıllık Abonelik (ARPU) Bazlı Başa Baş Analizi",
        currency: "$",
        unitPrice: 180,
        platformFeePct: 10,
        slices: [
          { label: "Ürün & Mühendislik", amount: 65000 },
          { label: "Bulut & AI Altyapısı", amount: 18000 },
          { label: "Büyüme & Satış (GTM)", amount: 28000 },
          { label: "Operasyon & Hukuk", amount: 14000 }
        ]
      },
      moscow: {
        title: "MVP & V1 Ürün Kapsam Planı (MoSCoW)",
        subtitle: "Kaynakları en yüksek müşteri değerine odaklama tablosu",
        must: [
          "Toplantı notu -> otomatik görev & sorumlu çıkarma",
          "Google Takvim ve Slack bildirim entegrasyonu",
          "Ekip bazlı haftalık ilerleme özet ekranı",
          "Kredi kartı ile aylık/yıllık abonelik"
        ],
        should: [
          "Notion ve Linear iki yönlü senkronizasyon",
          "PDF / Markdown yönetici raporu dışa aktarımı",
          "Türkçe ve İngilizce arayüz"
        ],
        could: [
          "Özel marka renkleri ile müşteri paylaşım linki",
          "Mobil PWA özet bildirimleri"
        ],
        wont: [
          "Gelişmiş finansal muhasebe modülü",
          "On-premise özel sunucu kurulumu (V2)"
        ]
      }
    },
    gdd: {
      genreKey: "saas",
      meta: {
        genre: "B2B SaaS / Üretkenlik Platformu",
        platform: "Web Uygulaması (SaaS)",
        targetAudience: "10-100 kişilik teknoloji şirketleri, ajanslar ve ürün ekipleri",
        elevatorPitch:
          "FlowPulse, ekiplerin toplantı ve sohbetlerde kaybolan kararlarını saniyeler içinde atanmış görevlere ve haftalık ilerleme grafiklerine dönüştüren otonom iş takip platformudur.",
        usp: "Tek bir yeni alışkanlık gerektirmeden mevcut Slack, Meet ve Notion akışından otomatik veri toplar."
      },
      sections: {
        overview:
          "Problem: Orta ölçekli ekiplerde kararların %40'ı toplantı sonrasında takipsizlikten kayboluyor.\nÇözüm: FlowPulse, ekibin kullandığı iletişim kanallarından aksiyon maddelerini yakalar.",
        pillars:
          "Sütun 1 — Sıfır Veri Girişi Yükü.\nSütun 2 — 60 Saniyede Değer.\nSütun 3 — Yönetici ve Ekip İçin Tek Gerçek Kaynağı.",
        mechanics:
          "Kullanıcı takvimini bağlar -> Sistem her toplantı sonrası sorumlu & tarih listesi önerir -> Tek tıkla onaylanır ve ilgili araca (Notion/Jira/Slack) düşer.",
        loop:
          "Haftalık Döngü: Pazartesi hedef özeti -> Çarşamba tıkanıklık uyarısı -> Cuma otomatik tamamlananlar raporu.",
        world:
          "Hedef Kullanıcı Personaları: 1) Zamanı kısıtlı Kurucu/CTO, 2) Çoklu proje yöneten Ürün Müdürü.",
        artAudio:
          "Minimalist Notion/Linear görsel dili; yüksek okunabilirlik, dikkat dağıtmayan renk hiyerarşisi ve koyu/açık mod desteği.",
        tech:
          "Frontend: Modern Web SPA, Backend: Node/Python API, Gerçek zamanlı Webhook senkronizasyonu ve SOC2 uyumlu şifreleme.",
        monetization:
          "Fiyat: Kullanıcı başı $15/ay (yıllık $180). Product-Led Growth (PLG) + ücretsiz 14 gün ekip denemesi ile büyüme."
      }
    },
    checklist: {
      "chk-hook": true,
      "chk-onepage": true,
      "chk-matrix": true,
      "chk-roadmap": true,
      "chk-budget": true
    }
  }
};

function createDefaultState() {
  return JSON.parse(JSON.stringify(SAMPLE_PRESETS["chrono-blade"]));
}
