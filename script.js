/* ============================================================
   SÜMOLOJİ - Bartın hava rehberi
   - Veri: OpenWeatherMap (anahtarın varsa) ya da Open-Meteo (anahtarsız)
   - Anahtar boşsa ya da çalışmazsa Open-Meteo otomatik devreye girer
   ============================================================ */

/* ================== AYARLAR ================== */
/* 👇 OpenWeatherMap anahtarını tırnakların içine yapıştır.
      Boş bırakırsan site anahtarsız Open-Meteo ile çalışır. */
const OWM_KEY = "";

const LAT = 41.6344;            // Bartın
const LON = 32.3375;
const TZ  = "Europe/Istanbul";

const OWM_TEMEL = "https://api.openweathermap.org/data/2.5/";
const METEO_URL =
  "https://api.open-meteo.com/v1/forecast" +
  "?latitude=" + LAT + "&longitude=" + LON +
  "&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation" +
  "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset" +
  "&hourly=precipitation" +
  "&timezone=Europe%2FIstanbul&forecast_days=7";

/* Test için adres sonuna ekleyebilirsin:
   ?tema=gece | aksam | gunduz     ?efekt=yagmur | kar | yok            */
const PARAM = new URLSearchParams(location.search);

/* ================== GÜZEL SÖZLER ================== */
/* Havaya uygun cümle havuzları. Seçili günün tarihine göre her gün farklı cümle gelir. */
const SOZLER = {
  gunes: [
    "Bugün güneş senin için doğdu, çok güzelsin! ☀️",
    "Gülüşün bugünün en güzel ışığı, parla bakalım! ✨",
    "Bugün her şey çok güzel olacak, sen zaten harikasın. 🌷",
    "Enerjin güneş gibi, girdiğin her yeri aydınlatıyorsun. 💛",
    "Kendine güven, bugün senin günün! 🌸",
    "Çok güzelsin ve bugün bunu herkes görecek. 💖",
    "Güneş açtı, gülüşünü de açtırıyoruz, hadi! 🌼",
    "Bugün kendine bir iyilik yap: sevdiğin şarkıyı aç ve gülümse. 🎶"
  ],
  bulut: [
    "Bulutlar bile senin güzelliğine hayran kalıyor. ☁️💗",
    "Hava kapalı olsa da içindeki güneş hiç batmıyor. 🌤️",
    "Bugün sakin ve huzurlu bir gün, kendini mutlu et. 🧸",
    "Pastel bir gün, pastel bir ruh hali: çok tatlısın! 🍬",
    "Bugün küçük şeylerle mutlu olmayı unutma, harikasın. 🌸",
    "Gökyüzü gri ama sen pembe pembe parlıyorsun! 💖",
    "Kendine güzel bir kahve ısmarla, bunu hak ediyorsun. ☕",
    "Çok güzelsin, çok güçlüsün, bugün de başaracaksın! 🌷"
  ],
  yagmur: [
    "Yağmur yağsa da sen içimizi ısıtan güzelliksin. 🌧️💗",
    "Her damla yeni bir başlangıç, sen de her gün daha da güzelsin. 🌈",
    "Yağmurlu günlerde bile gülüşün şemsiyeden daha koruyucu. ☔",
    "Bugün çizmeni giy, su birikintilerinde zıpla, çok yakışırsın. 👢",
    "Hava gri olabilir ama sen rengarenksin, çok güzelsin! 🎀",
    "Sıcak bir içecek, güzel bir müzik ve sen: mükemmel bir gün. ☕",
    "Yağmurdan sonra gökkuşağı çıkar, sen de zorlukların ardından parlarsın. 🌈",
    "Bugün kendine nazik ol, harika gidiyorsun. 🌸"
  ],
  ruzgar: [
    "Rüzgar saçlarını uçuştursa da güzelliğin yerinde, bayıldım! 💨💖",
    "Rüzgar gibi özgür ve güçlüsün, hiçbir şey seni durduramaz. 🌬️",
    "Saçların uçuşsa ne olur, sen yine en şıksın! 🎀",
    "Bugün fırtınalar bile senin enerjine yetişemez. ✨",
    "Rüzgar kötü düşünceleri alıp götürsün, geriye sadece güzellik kalsın. 🍃",
    "Dik dur, gülümse, bugün çok güzelsin! 🌷",
    "Hafif bir esinti, kocaman bir gülümseme: günün formülü. 😊",
    "Sen kendi rüzgarını yaratan bir kızsın, çok güzelsin. 💜"
  ],
  soguk: [
    "Hava soğuk ama sen kalbimizi ısıtıyorsun, çok güzelsin! 🧣💗",
    "Atkını sar, gülüşünü tak: bugün tamamsın. 🧣",
    "Soğuk hava sana çok yakışıyor, yanakların pembe pembe. 🌸",
    "Üşüsen de parlıyorsun, bugünün yıldızı sensin! ✨",
    "Sıcacık giyin, sıcacık gül, bugün de harikasın. ☕",
    "Bugün kendine sıcak bir çikolata hak ettin. 🍫",
    "Soğuk günlerde bile içindeki sıcaklık seni parlatıyor. 💖",
    "Kalın giyin, güzel gül, bugün de sen kazanacaksın. 🧤"
  ],
  kar: [
    "Kar taneleri bile senin gibi eşsiz, çok güzelsin! ❄️",
    "Kar yağıyor, yanakların pembe, ruhun sıcak. 🧣",
    "Bugün her yer bembeyaz, sen ise rengarenk parlıyorsun. 🌸",
    "Kardan adam yapacak kadar eğlenceli bir gün seni bekliyor. ⛄",
    "Soğuğa inat gülümse, çok yakışıyor. 💖",
    "Sıcak çikolata ve güzel bir film: kar günü formülü. 🍫",
    "Kar gibi saf ve güzelsin, bugün de harikasın. ❄️💗",
    "Kayma ama parla! Bugün yavaş ve güzel adımlarla ilerle. ✨"
  ],
  aksam: [
    "İyi akşamlar güzelim,bugün de her zamanki gibi mükemmeldin. 🌇",
    "Gün batarken bile sen en parlak olansın. 🌅💗",
    "Akşam ışığı sana çok yakışıyor, çok güzelsin. 🧡",
    "Günün yorgunluğunu bırak, sıcak bir şeyler iç, kendine iyi bak. ☕",
    "Bugün elinden geleni yaptın, kendinle gurur duy. 💜",
    "Gün batımı gibi sen de her an güzelsin. 🌇",
    "Akşam yürüyüşü, güzel müzik ve sen: mükemmel üçlü. 🎧",
    "Yarın daha da güzel olacak, şimdi biraz dinlen. 🌸"
  ],
  gece: [
    "İyi akşamlar güzelim, bugün de her zamanki gibi mükemmeldin. 🌙💗",
    "Yıldızlar bile senin kadar parlak değil, tatlı rüyalar! ✨",
    "Gün bitti, şimdi sıra dinlenmekte. Sen buna değersin. 🧸",
    "Bugün elinden geleni yaptın, kendinle gurur duy. 💜",
    "Gece sakin, sen huzurlu ol. Yarın yine harika olacak. 🌸",
    "Güzel uykular, yarın seni yeni güzel şeyler bekliyor. 🌟",
    "Bu gece kendine iyi bak, sıcak bir şeyler iç ve dinlen. ☕",
    "Çok güzelsin, çok çalıştın, şimdi rahatça dinlen. 🌷"
  ],
  genel: [
    "Bugün çok güzelsin, bunu sakın unutma! 💖",
    "Sen eşsizsin, bugün de harika bir gün geçireceksin. 🌷",
    "Kendine inan, çünkü sen düşündüğünden çok daha güçlüsün. ✨",
    "Gülüşün dünyanın en güzel şeylerinden biri. 🌸",
    "Bugün de seni mutlu edecek küçük şeyler bulacaksın. 🍀",
    "Sen yeterlisin, sen değerlisin, sen çok güzelsin. 💜",
    "Her gün biraz daha parlıyorsun, devam et! 🌟",
    "Bugün kendini sev, çünkü sen buna değersin. 🎀"
  ]
};

/* Her gün değişen özgüven cümleleri (31 tane, ayın her günü farklı) */
const OZGUVEN = [
  "Çok güzelsin, bunu sakın unutma. 💖",
  "Gülüşün bütün günü aydınlatıyor. ✨",
  "Sen kendi başına bir moda dergisisin, bugün de kapaktasın. 📸",
  "Aynaya bak, hak ettiğin kadar güzel görünüyorsun. 🪞",
  "Bugün kimse seni senin gibi taşıyamaz, çok şıksın. 👑",
  "Kendine inanan kız en güzel kızdır. Sen de o kızsın! 🌷",
  "Zekân da güzelliğin kadar parlıyor. 🧠💜",
  "Bugün kendini beğenmek serbest, hatta zorunlu! 😌🌸",
  "Sen yeterlisin, olduğun gibi çok değerlisin. 💫",
  "Gözlerindeki ışık bütün sınavlardan daha güçlü. 🌟",
  "Bugün de başaracaksın, bunu çok net görüyorum. 🍀",
  "Güzelliğin sadece dışarıda değil, kalbinde de. 💗",
  "Saçların dursa da uçuşsa da güzelsin, başka seçenek yok. 🎀",
  "Sen o kadar tatlısın ki hava bile seni kıskanıyor. ☁️",
  "Kimse seninle yarışmıyor, çünkü sen tek bir tanesin. 🦋",
  "Kendine karşı nazik ol, sen buna değersin. 🌼",
  "Bugün de kampüsün en parlak kızı sensin. 🎓✨",
  "Hata yapsan da güzelsin, yorulsan da güzelsin. 🤍",
  "Sesin, tarzın, gülüşün... hepsi çok güzel. 🎶",
  "Kalbin güzel, enerjin güzel, sen güzelsin. 🌺",
  "Bugün kendine bir iltifat et, ben başlıyorum: muhteşemsin! 💐",
  "Sen bir çiçek gibisin, her gün biraz daha açıyorsun. 🌸",
  "Dünyanın en güzel ayrıntısı senin gülümsemen. 😊",
  "Cesursun, güçlüsün ve çok güzelsin. 🦄",
  "Bugün sevdiğin bir şey yap, çünkü değerlisin. 🧁",
  "Güzel olmak için çabalamıyorsun, zaten güzelsin. 💎",
  "Güvenle girdiğin her yer senin yerin. 🚪✨",
  "Hayallerin kadar güzelsin, hayallerin kadar güçlüsün. 🌙",
  "Bu dünyada senin gibi biri yok, bu çok özel bir şey. 🌈",
  "Kendini tanıdıkça daha da güzelleşiyorsun. 🌿",
  "Çok güzelsin, çok akıllısın, çok güçlüsün. Hepsi senin! 💜"
];

/* ================== HAVA TÜRLERİ ==================
   Her iki servisin kodları da aşağıdaki ortak türlere çevrilir.
   tur: acik | bulut | yagmur | kar                                  */
const HAVA = {
  acik:      { g: ["☀️", "Güneşli"],            a: ["🌇", "Açık akşam"],          n: ["🌙", "Açık gece"],            tur: "acik" },
  azbulutlu: { g: ["🌤️", "Az bulutlu"],         a: ["🌇", "Az bulutlu akşam"],    n: ["🌙", "Az bulutlu gece"],      tur: "acik" },
  parcali:   { g: ["⛅", "Parçalı bulutlu"],     a: ["⛅", "Parçalı bulutlu"],      n: ["☁️", "Parçalı bulutlu gece"], tur: "bulut" },
  kapali:    { g: ["☁️", "Kapalı"],             tur: "bulut" },
  sis:       { g: ["🌫️", "Sisli"],              tur: "bulut" },
  cise:      { g: ["🌦️", "Çisenti"],            tur: "yagmur" },
  yagmur:    { g: ["🌧️", "Yağmurlu"],           tur: "yagmur" },
  saganak:   { g: ["🌧️", "Sağanak yağış"],      tur: "yagmur" },
  kar:       { g: ["❄️", "Karlı"],              tur: "kar" },
  firtina:   { g: ["⛈️", "Gök gürültülü fırtına"], tur: "yagmur" }
};

function havaBilgisi(kind, faz) {
  const h = HAVA[kind] || HAVA.kapali;
  const secim = faz === "gece" ? (h.n || h.g) : faz === "aksam" ? (h.a || h.g) : h.g;
  return { icon: secim[0], text: secim[1], tur: h.tur };
}

/* OpenWeatherMap kodu -> ortak tür */
function owmKind(id) {
  if (id === 800) return "acik";
  if (id === 801) return "azbulutlu";
  if (id === 802) return "parcali";
  if (id === 803 || id === 804) return "kapali";
  if (id >= 200 && id < 300) return "firtina";
  if (id >= 300 && id < 400) return "cise";
  if (id >= 500 && id < 600) return id >= 520 ? "saganak" : "yagmur";
  if (id >= 600 && id < 700) return "kar";
  if (id === 781) return "firtina";
  if (id >= 700 && id < 800) return "sis";
  return "kapali";
}

/* Open-Meteo (WMO) kodu -> ortak tür */
function meteoKind(k) {
  if (k === 0) return "acik";
  if (k === 1) return "azbulutlu";
  if (k === 2) return "parcali";
  if (k === 3) return "kapali";
  if (k === 45 || k === 48) return "sis";
  if (k >= 51 && k <= 57) return "cise";
  if (k >= 61 && k <= 67) return "yagmur";
  if (k >= 71 && k <= 77) return "kar";
  if (k >= 80 && k <= 82) return "saganak";
  if (k === 85 || k === 86) return "kar";
  if (k >= 95) return "firtina";
  return "kapali";
}

const YAGMUR_SIRA = { cise: 1, yagmur: 2, saganak: 3, firtina: 4 };

/* ================== YARDIMCI ================== */
let veri = null;          // en son gelen hava verisi
let secili = 0;           // seçili gün (0 = bugün)
let temaSecimi = "oto";   // oto | gunduz | aksam | gece

const FMT = new Intl.DateTimeFormat("en-CA", {
  timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", hour12: false
});

/* Bir zamanı Türkiye saatine göre {tarih, saat, dakika} yapar */
function yerel(ms) {
  const o = {};
  FMT.formatToParts(new Date(ms)).forEach((p) => { o[p.type] = p.value; });
  const saat = parseInt(o.hour, 10) % 24;
  return { tarih: o.year + "-" + o.month + "-" + o.day, saat, dakika: saat * 60 + parseInt(o.minute, 10) };
}

const gunAdi = (t) => {
  const g = new Date(t + "T12:00:00").toLocaleDateString("tr-TR", { weekday: "long" });
  return g.charAt(0).toLocaleUpperCase("tr-TR") + g.slice(1);
};
const kisaTarih = (t) => new Date(t + "T12:00:00").toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
const yuvarla = (x) => Math.round(x);

function yilinGunu(tarih) {
  const d = new Date(tarih + "T12:00:00");
  return Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
}

function gununSozu(tarih, kategori) {
  const havuz = SOZLER[kategori] || SOZLER.genel;
  return havuz[yilinGunu(tarih) % havuz.length];
}
function gununOzguveni(tarih) {
  return OZGUVEN[yilinGunu(tarih) % OZGUVEN.length];
}

/* Bir günün hava türü: yağış varsa en şiddetlisi, yoksa öğlene en yakın saat */
function gunKind(kodlar, yagisToplam) {
  const sira = (k) => YAGMUR_SIRA[k] || 0;
  const firtina = kodlar.find((k) => k.kind === "firtina");
  if (firtina) return "firtina";
  if (kodlar.some((k) => k.kind === "kar")) return "kar";
  const yagmurlular = kodlar.filter((k) => sira(k.kind) > 0);
  if (yagmurlular.length >= 2 || yagisToplam >= 1) {
    return yagmurlular.reduce((a, b) => (sira(b.kind) > sira(a.kind) ? b : a), yagmurlular[0] || kodlar[0]).kind;
  }
  let enYakin = kodlar[0];
  kodlar.forEach((k) => { if (Math.abs(k.saat - 13) < Math.abs(enYakin.saat - 13)) enYakin = k; });
  return enYakin.kind;
}

/* ================== VERİ: OpenWeatherMap ================== */
async function owmGetir() {
  const ortak = "?lat=" + LAT + "&lon=" + LON + "&units=metric&lang=tr&appid=" + encodeURIComponent(OWM_KEY.trim());
  const [r1, r2] = await Promise.all([fetch(OWM_TEMEL + "weather" + ortak), fetch(OWM_TEMEL + "forecast" + ortak)]);
  if (r1.status === 401 || r2.status === 401) {
    throw new Error("OpenWeatherMap 401: anahtar geçersiz ya da henüz aktif olmamış");
  }
  if (!r1.ok || !r2.ok) throw new Error("OpenWeatherMap hatası: " + r1.status + " / " + r2.status);
  return owmHazirla(await r1.json(), await r2.json());
}

function owmHazirla(s, t) {
  const simdiMs = s.dt * 1000;
  const bugun = yerel(simdiMs).tarih;
  const gunler = {};
  let sonraki6 = 0;

  t.list.forEach((h) => {
    const ms = h.dt * 1000;
    const y = yerel(ms);
    const g = gunler[y.tarih] || (gunler[y.tarih] = {
      tarih: y.tarih, sayi: 0, max: -99, min: 99, ruzgar: 0, pop: 0, yagis: 0, sabah: 0, ogleden: 0, kodlar: []
    });
    const mm = ((h.rain && h.rain["3h"]) || 0) + ((h.snow && h.snow["3h"]) || 0);
    g.sayi++;
    g.max = Math.max(g.max, h.main.temp_max);
    g.min = Math.min(g.min, h.main.temp_min);
    g.ruzgar = Math.max(g.ruzgar, h.wind.speed * 3.6);        // m/s -> km/s
    g.pop = Math.max(g.pop, (h.pop || 0) * 100);
    g.yagis += mm;
    if (y.saat >= 6 && y.saat < 14) g.sabah += mm;
    else if (y.saat >= 14 && y.saat < 22) g.ogleden += mm;
    g.kodlar.push({ kind: owmKind(h.weather[0].id), saat: y.saat });
    if (ms > simdiMs && ms <= simdiMs + 6 * 3600 * 1000) sonraki6 += mm;
  });

  const simdi = {
    sicaklik: s.main.temp,
    hissedilen: s.main.feels_like,
    kind: owmKind(s.weather[0].id),
    ruzgar: s.wind.speed * 3.6,
    yagis: ((s.rain && s.rain["1h"]) || 0) + ((s.snow && s.snow["1h"]) || 0),
    sonraki6
  };

  /* Gece geç saatte liste yarından başlayabilir; bugünü elle oluştur */
  if (!gunler[bugun]) {
    gunler[bugun] = {
      tarih: bugun, sayi: 0, max: simdi.sicaklik, min: simdi.sicaklik, ruzgar: simdi.ruzgar,
      pop: 0, yagis: 0, sabah: 0, ogleden: 0, kodlar: [{ kind: simdi.kind, saat: yerel(simdiMs).saat }]
    };
  }
  const bg = gunler[bugun];
  bg.max = Math.max(bg.max, simdi.sicaklik);
  bg.min = Math.min(bg.min, simdi.sicaklik);
  bg.ruzgar = Math.max(bg.ruzgar, simdi.ruzgar);
  bg.yagis += simdi.yagis;

  const liste = Object.keys(gunler).sort()
    .map((k) => gunler[k])
    .filter((g) => g.tarih >= bugun && (g.tarih === bugun || g.sayi >= 4))   // eksik son günü at
    .map((g) => ({
      tarih: g.tarih, max: g.max, min: g.min, ruzgar: g.ruzgar, pop: g.pop,
      yagis: g.yagis, sabah: g.sabah, ogleden: g.ogleden, kind: gunKind(g.kodlar, g.yagis)
    }));

  return {
    kaynak: "OpenWeatherMap",
    simdi,
    gunes: { dogus: yerel(s.sys.sunrise * 1000).dakika, batis: yerel(s.sys.sunset * 1000).dakika },
    gunler: liste
  };
}

/* ================== VERİ: Open-Meteo ================== */
async function meteoGetir() {
  const r = await fetch(METEO_URL);
  if (!r.ok) throw new Error("Open-Meteo hatası: " + r.status);
  return meteoHazirla(await r.json());
}

function meteoHazirla(m) {
  const d = m.daily;
  const dakika = (s) => parseInt(s.slice(11, 13), 10) * 60 + parseInt(s.slice(14, 16), 10);

  /* saatlik yağıştan sabah/öğleden sonra ve sonraki 6 saati hesapla */
  const sabah = {}, ogleden = {};
  m.hourly.time.forEach((t, i) => {
    const tarih = t.slice(0, 10), saat = parseInt(t.slice(11, 13), 10), mm = m.hourly.precipitation[i] || 0;
    if (saat >= 6 && saat < 14) sabah[tarih] = (sabah[tarih] || 0) + mm;
    else if (saat >= 14 && saat < 22) ogleden[tarih] = (ogleden[tarih] || 0) + mm;
  });
  const simdiSaat = m.current.time.slice(0, 13);
  const idx = m.hourly.time.findIndex((t) => t.slice(0, 13) === simdiSaat);
  let sonraki6 = 0;
  if (idx >= 0) for (let i = idx + 1; i <= idx + 6 && i < m.hourly.precipitation.length; i++) sonraki6 += m.hourly.precipitation[i] || 0;

  return {
    kaynak: "Open-Meteo",
    simdi: {
      sicaklik: m.current.temperature_2m,
      hissedilen: m.current.apparent_temperature,
      kind: meteoKind(m.current.weather_code),
      ruzgar: m.current.wind_speed_10m,
      yagis: m.current.precipitation || 0,
      sonraki6
    },
    gunes: { dogus: dakika(d.sunrise[0]), batis: dakika(d.sunset[0]) },
    gunler: d.time.map((tarih, i) => ({
      tarih,
      max: d.temperature_2m_max[i], min: d.temperature_2m_min[i],
      ruzgar: d.wind_speed_10m_max[i],
      pop: d.precipitation_probability_max[i] || 0,
      yagis: d.precipitation_sum[i] || 0,
      sabah: sabah[tarih] || 0, ogleden: ogleden[tarih] || 0,
      kind: meteoKind(d.weather_code[i])
    }))
  };
}

/* ================== TEMA (gündüz / akşam / gece) ================== */
function fazHesapla() {
  const zorla = PARAM.get("tema");
  if (["gunduz", "aksam", "gece"].indexOf(zorla) >= 0) return zorla;
  if (temaSecimi !== "oto") return temaSecimi;

  const simdi = yerel(Date.now()).dakika;
  const dogus = veri ? veri.gunes.dogus : 6 * 60 + 30;
  const batis = veri ? veri.gunes.batis : 19 * 60;
  if (simdi < dogus - 20 || simdi >= batis + 45) return "gece";
  if (simdi >= batis - 80) return "aksam";
  return "gunduz";
}

let sonFaz = "";
function temayiUygula() {
  const faz = fazHesapla();
  document.body.dataset.faz = faz;
  document.documentElement.dataset.faz = faz;      // sayfanın tamamı aynı renkte olsun
  if (faz !== sonFaz) { yildizlariCiz(faz === "gece"); sonFaz = faz; }
  return faz;
}

function yildizlariCiz(goster) {
  const gok = document.getElementById("gok");
  gok.querySelectorAll(".yildiz").forEach((y) => y.remove());
  if (!goster) return;
  for (let i = 0; i < 70; i++) {
    const y = document.createElement("i");
    const boyut = 1 + Math.random() * 2.2;
    y.className = "yildiz";
    y.style.cssText =
      "left:" + (Math.random() * 100) + "%;top:" + (Math.random() * 70) + "%;" +
      "width:" + boyut + "px;height:" + boyut + "px;" +
      "animation-delay:" + (Math.random() * 3).toFixed(2) + "s;" +
      "animation-duration:" + (2 + Math.random() * 3).toFixed(2) + "s";
    gok.appendChild(y);
  }
}

/* ================== YAĞMUR VE KAR EFEKTİ ================== */
const Efekt = (() => {
  const cv = document.getElementById("efekt");
  const cx = cv.getContext("2d");
  const azHareket = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let tur = "yok", yogun = 1, parcalar = [], w = 0, h = 0, raf = 0, son = 0;

  function boyutla() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    cv.width = w * dpr; cv.height = h * dpr;
    cv.style.width = w + "px"; cv.style.height = h + "px";
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function yagmurDamlasi(rastgeleY) {
    return { x: Math.random() * (w + 80) - 40, y: rastgeleY ? Math.random() * h : -20,
             uzun: 10 + Math.random() * 16, hiz: 650 + Math.random() * 450 };
  }
  function karTanesi(rastgeleY) {
    /* Taneler çoğunlukla sağ ve sol kenarlarda toplanır */
    const kenarda = Math.random() < 0.78;
    const x = kenarda
      ? (Math.random() < 0.5 ? Math.random() * w * 0.16 : w - Math.random() * w * 0.16)
      : Math.random() * w;
    return { x, y: rastgeleY ? Math.random() * h : -10, r: 1.5 + Math.random() * 3.2,
             hiz: 30 + Math.random() * 55, sal: 12 + Math.random() * 22, faz: Math.random() * 6.28 };
  }

  function kur() {
    parcalar = [];
    if (tur === "yok") return;
    const sayi = tur === "yagmur" ? Math.round(120 * yogun) : 95;
    for (let i = 0; i < sayi; i++) parcalar.push(tur === "yagmur" ? yagmurDamlasi(true) : karTanesi(true));
  }

  function ciz(zaman) {
    const dt = Math.min((zaman - son) / 1000 || 0.016, 0.05);
    son = zaman;
    cx.clearRect(0, 0, w, h);
    const gece = document.body.dataset.faz === "gece";

    if (tur === "yagmur") {
      cx.lineWidth = 1.3; cx.lineCap = "round";
      cx.strokeStyle = gece ? "rgba(185, 205, 255, .55)" : "rgba(70, 120, 210, .5)";
      cx.beginPath();
      parcalar.forEach((p) => {
        cx.moveTo(p.x, p.y);
        cx.lineTo(p.x - p.uzun * 0.18, p.y + p.uzun);
        p.y += p.hiz * dt; p.x -= p.hiz * dt * 0.18;
        if (p.y > h + 20) Object.assign(p, yagmurDamlasi(false));
      });
      cx.stroke();
    } else if (tur === "kar") {
      cx.fillStyle = "rgba(255, 255, 255, .95)";
      cx.shadowColor = gece ? "rgba(200, 215, 255, .8)" : "rgba(110, 130, 200, .75)";
      cx.shadowBlur = 5;
      parcalar.forEach((p) => {
        p.y += p.hiz * dt; p.faz += dt * 1.2;
        const x = p.x + Math.sin(p.faz) * p.sal;
        cx.beginPath(); cx.arc(x, p.y, p.r, 0, 6.2832); cx.fill();
        if (p.y > h + 10) Object.assign(p, karTanesi(false));
      });
      cx.shadowBlur = 0;
    }
    raf = requestAnimationFrame(ciz);
  }

  function ayarla(yeniTur, yeniYogun) {
    yogun = yeniYogun || 1;
    if (azHareket) yeniTur = "yok";
    if (yeniTur === tur && parcalar.length) return;
    tur = yeniTur;
    cancelAnimationFrame(raf);
    cx.clearRect(0, 0, w, h);
    kur();
    if (tur !== "yok") { son = performance.now(); raf = requestAnimationFrame(ciz); }
  }

  window.addEventListener("resize", () => { boyutla(); kur(); });
  boyutla();
  return { ayarla };
})();

/* ================== ANALİZ ================== */
function analiz(i) {
  const g = veri.gunler[i];
  const bugunMu = i === 0;
  const bilgi = havaBilgisi(g.kind, "gunduz");
  const ort = (g.max + g.min) / 2;
  const kar = bilgi.tur === "kar" || (bugunMu && HAVA[veri.simdi.kind].tur === "kar");

  const simdiYagmurlu = bugunMu && (HAVA[veri.simdi.kind].tur === "yagmur" || veri.simdi.yagis >= 0.2);
  let yagmurlu = bilgi.tur === "yagmur" || g.yagis >= 1 || g.pop >= 60 || simdiYagmurlu;
  let sonraAcar, sonraYagar;

  if (bugunMu) {
    /* Bugün için: şu an yağıyor mu, yakında dinecek ya da başlayacak mı? */
    sonraAcar = simdiYagmurlu && veri.simdi.sonraki6 < 0.3;
    sonraYagar = !simdiYagmurlu && veri.simdi.sonraki6 >= 0.5;
    if (sonraAcar) yagmurlu = true;
    if (sonraYagar) yagmurlu = false;        // henüz yağmıyor, sadece uyarı verilecek
  } else {
    sonraAcar = g.sabah >= 0.3 && g.ogleden < 0.2;
    sonraYagar = g.sabah < 0.2 && g.ogleden >= 0.3;
    if (sonraYagar) yagmurlu = false;
  }

  let kategori = "genel";
  if (kar) kategori = "kar";
  else if (ort < 6) kategori = "soguk";
  else if (yagmurlu || sonraAcar) kategori = "yagmur";
  else if (g.ruzgar >= 30) kategori = "ruzgar";
  else if (bilgi.tur === "acik" && ort >= 14) kategori = "gunes";
  else if (bilgi.tur === "bulut") kategori = "bulut";

  return {
    tarih: g.tarih, kind: g.kind, bilgi, max: g.max, min: g.min, ort,
    ruzgar: g.ruzgar, yagisMM: g.yagis, yagisOlasilik: g.pop,
    yagmurlu, sonraAcar, sonraYagar, kar, kategori
  };
}

/* ================== ÖNERİLER ================== */
function saciOner(a) {
  const km = yuvarla(a.ruzgar);
  let m;
  if (a.ruzgar >= 35) {
    m = "Rüzgar saatte " + km + " km'ye kadar çıkıyor, saçların kesinlikle uçuşacak! 💨 Topuz, örgü ya da at kuyruğu yap, toka ve tarak al yanına. Açık saçla çıkarsan yüzüne dolanır.";
  } else if (a.ruzgar >= 20) {
    m = "Rüzgar saatte " + km + " km civarında, saçların biraz uçuşabilir. 🎀 Yarım toka, saç bandı ya da tek örgü çok yakışır, saç spreyi de işini görür.";
  } else {
    m = "Rüzgar sakin (" + km + " km/s), saçların bugün düzgün kalır. 💖 İstersen açık bırak, dalgalı ya da düz harika olur!";
  }
  if (a.yagmurlu || a.kar) m += " Nemden kabarabilir, örgü ya da topuz daha güvenli, bir de saç serumu iyi gider.";
  return m;
}

function kiyafetOner(a) {
  let m;
  const ort = a.ort;
  if (a.kar || ort < 3) m = "Kaban ya da kalın mont, bere, atkı ve eldiven şart! Altına termal ya da kazak giy, sıcacık kal.";
  else if (ort < 10) m = "Kaban ya da mont giy, altına kazak ekle.  Atkı ve bere de çok yakışır.";
  else if (ort < 16) m = "Ceket, trençkot ya da kalın hırka tam kararında. Altına uzun kollu bir şey giy.";
  else if (ort < 22) m = "İnce ceket ya da hırka yeter.  Tişört ya da gömlek üstüne katmanlı giyinebilirsin.";
  else if (ort < 27) m = "Hafif ve ferah kıyafetler: elbise, tişört ya da ince pantolon! ";
  else m = "Çok sıcak, ince pamuklu elbiseler ve açık renkler seç. Güneş gözlüğü ve şapka da unutma!";

  if (a.yagmurlu || a.sonraAcar) m += " ☔ Yağmurluk ya da şemsiye al.";
  if (a.sonraYagar) m += " Öğleden sonra yağmur gelebilir, şemsiyeni yanında taşı.";
  if (a.ruzgar >= 30) m += " Rüzgar sert, rüzgarlık ya da kapüşonlu bir şey iyi olur.";
  if (a.max - a.min >= 10 && ort >= 10) m += " Sabahla akşam arası fark büyük, katmanlı giyin ki üşüme.";
  if (a.min < 8 && ort >= 10) m += " Akşam serinleyecek, yanına bir mont ya da ceket al.";
  return m;
}

function ayakkabiOner(a) {
  if (a.kar) {
    return "Kar var! ❄️ Su geçirmez, kaymaz tabanlı bot ya da çizme giy. Babet ve topuklu bugün kaygan zeminde risk, evde kalsın.";
  }
  if (a.sonraAcar) {
    return "Yağmur var ama hava sonradan açacak! 🌤️ Şimdilik çizme ya da bot giy. Yağmur dinince spor ayakkabı, babet ya da topuklu da olur.";
  }
  if (a.yagmurlu) {
    return "Yağmurlu bir gün, çizme ya da su geçirmez bot giy. 👢 Spor ayakkabı da idare eder ama ıslanabilir. Babet ve topuklu bugün ıslanır, kayar, evde kalsın.";
  }
  if (a.sonraYagar) {
    return "Şu an kuru ama yağmur gelebilir. 🌦️ Bot ya da spor ayakkabı en garantisi. Babet ve topuklu giyeceksen çantana yedek ayakkabı ve şemsiye ekle.";
  }
  if (a.ort < 8) {
    return "Soğuk bir gün, kalın tabanlı bot ya da kapalı ayakkabı giy. 🥾 Kalın çorap da unutma! Babet için bugün biraz soğuk.";
  }
  if (a.ort >= 25) {
    return "Hava sıcak: babet, sandalet ya da hafif spor ayakkabı tam sana göre. 👡 Topuklu da olur, ama kaldırımlarda ayakların yorulmasın.";
  }
  return "Hava kuru ve güzel: spor ayakkabı, babet ya da topuklu, hepsi uygun! 👟👠 Kampüste çok yürüyeceksen spor ya da babet daha rahat olur.";
}

function cantaOner(a, gunduz) {
  const l = [];
  if (a.yagmurlu || a.sonraYagar || a.sonraAcar) l.push("şemsiye ☔");
  if (a.ruzgar >= 20) l.push("toka ya da tarak 🎀");
  if (a.ort < 10 || a.ruzgar >= 25) l.push("dudak koruyucu ve el kremi 💄");
  if (a.kind === "acik" && a.ort >= 15 && gunduz) l.push("güneş gözlüğü 🕶️");
  if (a.ort >= 24) l.push("su şişesi 💧");
  if (a.kar || a.ort < 3) l.push("eldiven 🧤");
  l.push("şarj aleti,cüzdanın,dudak kalemi ve glossun,güzelliğine bakmak için aynan,mendil,saçların için de küçük bir toka alabilirsin, okul kartını da unutma tatlım <3");
  return "Bugün çantanda bunlar olsun: " + l.join(", ") + ".";
}

/* ================== EKRANA ÇİZ ================== */
function anaKutuyuCiz(faz) {
  const a = analiz(secili);
  const bugunMu = secili === 0;
  const c = veri.simdi;

  const kind = bugunMu ? c.kind : a.kind;
  const bilgi = havaBilgisi(kind, bugunMu ? faz : "gunduz");
  const sicaklik = bugunMu ? yuvarla(c.sicaklik) : yuvarla(a.max);
  const ruzgar = bugunMu ? yuvarla(c.ruzgar) : yuvarla(a.ruzgar);
  const etiket = bugunMu ? (faz === "gece" ? "Şu an (gece)" : faz === "aksam" ? "Şu an (akşam)" : "Şu an") : gunAdi(a.tarih);
  const hissedilen = bugunMu
    ? '<div class="chip">🤗 Hissedilen: <b>' + yuvarla(c.hissedilen) + '°</b></div>' : "";

  /* Bugün için akşam/gece cümleleri, diğer günlerde havaya uygun cümle */
  let kategori = a.kategori;
  if (bugunMu && (faz === "gece" || faz === "aksam") && ["gunes", "genel", "bulut"].indexOf(kategori) >= 0) {
    kategori = faz;
  }

  document.getElementById("main").innerHTML =
    '<div class="quote">' +
      '<small>💗 Günün Cümlesi</small>' +
      '<p>' + gununSozu(a.tarih, kategori) + '</p>' +
      '<p class="ozguven">' + gununOzguveni(a.tarih) + '</p>' +
    '</div>' +
    '<div class="now">' +
      '<div class="icon">' + bilgi.icon + '</div>' +
      '<div>' +
        '<div class="dayname">' + etiket + " · " + kisaTarih(a.tarih) + ' · Bartın</div>' +
        '<div class="temp">' + sicaklik + '°C</div>' +
        '<div class="desc">' + bilgi.text + '</div>' +
      '</div>' +
    '</div>' +
    '<div class="chips">' +
      '<div class="chip">🔺 En yüksek: <b>' + yuvarla(a.max) + '°</b></div>' +
      '<div class="chip">🔻 En düşük: <b>' + yuvarla(a.min) + '°</b></div>' +
      '<div class="chip">💨 Rüzgar: <b>' + ruzgar + ' km/s</b></div>' +
      '<div class="chip">🌧️ Yağış ihtimali: <b>%' + yuvarla(a.yagisOlasilik || 0) + '</b></div>' +
      hissedilen +
    '</div>';

  /* Arka plan efektini ve hava rengini ayarla */
  document.body.dataset.hava = bilgi.tur;
  let efekt = bilgi.tur === "yagmur" ? "yagmur" : bilgi.tur === "kar" ? "kar" : "yok";
  const zorla = PARAM.get("efekt");
  if (zorla) { efekt = zorla === "yagmur" || zorla === "kar" ? zorla : "yok"; }
  if (zorla) document.body.dataset.hava = efekt === "yok" ? bilgi.tur : efekt;
  Efekt.ayarla(efekt, kind === "saganak" || kind === "firtina" ? 1.8 : kind === "cise" ? 0.5 : 1);
}

function onerileriCiz(faz) {
  const a = analiz(secili);
  document.getElementById("adviceGrid").innerHTML =
    '<div class="advice hair"><b>Saçlar💇‍♀️ </b>' + saciOner(a) + '</div>' +
    '<div class="advice outfit"><b>Kıyafet👚</b>' + kiyafetOner(a) + '</div>' +
    '<div class="advice shoes"><b> Ayakkabı👟</b>' + ayakkabiOner(a) + '</div>' +
    '<div class="advice bag"><b> Çanta🎒</b>' + cantaOner(a, faz === "gunduz") + '</div>';
  document.getElementById("adviceCard").hidden = false;
}

function haftayiCiz(faz) {
  const kutu = document.getElementById("week");
  kutu.innerHTML = "";
  document.getElementById("weekTitle").textContent = "📅 " + veri.gunler.length + " Günlük Tahmin";

  veri.gunler.forEach((g, i) => {
    const b = havaBilgisi(i === 0 ? veri.simdi.kind : g.kind, i === 0 ? faz : "gunduz");
    const el = document.createElement("div");
    el.className = "day" + (i === secili ? " active" : "");
    el.innerHTML =
      '<div class="n">' + (i === 0 ? "Bugün" : gunAdi(g.tarih)) + '</div>' +
      '<div class="d">' + kisaTarih(g.tarih) + '</div>' +
      '<div class="i">' + b.icon + '</div>' +
      '<div class="t"><b>' + yuvarla(g.max) + '°</b> / <span>' + yuvarla(g.min) + '°</span></div>' +
      '<div class="r">💧 %' + yuvarla(g.pop || 0) + ' · 💨 ' + yuvarla(g.ruzgar) + '</div>';
    el.addEventListener("click", () => { secili = i; hepsiniCiz(); });
    kutu.appendChild(el);
  });
  document.getElementById("weekCard").hidden = false;
}

function hepsiniCiz() {
  if (!veri) return;
  if (secili >= veri.gunler.length) secili = 0;
  const faz = temayiUygula();
  anaKutuyuCiz(faz);
  onerileriCiz(faz);
  haftayiCiz(faz);
}

/* ================== VERİYİ ÇEK (API) ================== */
async function havaGetir() {
  let yeni = null, owmHata = null;
  const anahtarVar = OWM_KEY && OWM_KEY.trim() !== "" && OWM_KEY.indexOf("BURAYA") < 0;

  if (anahtarVar) {
    try { yeni = await owmGetir(); }
    catch (e) { owmHata = e; console.warn(e); }
  }
  if (!yeni) {
    try { yeni = await meteoGetir(); }
    catch (e) {
      console.error(e);
      if (!veri) {
        document.getElementById("main").innerHTML =
          '<div class="error">😢 Hava durumu alınamadı.<br><small>Hata: ' + e.message + '</small></div>';
      }
      return;
    }
  }

  veri = yeni;
  hepsiniCiz();

  document.getElementById("updated").textContent =
    "Son güncelleme: " + new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", timeZone: TZ }) +
    " · Veri: " + veri.kaynak;
  document.getElementById("sourceNote").textContent = owmHata
    ? "(OpenWeatherMap çalışmadı, yedek kaynak kullanıldı: " + owmHata.message + ")"
    : "";
}

/* ================== BUTONLAR ================== */
function temaButonlari() {
  let kayitli = null;
  try { kayitli = localStorage.getItem("sumoloji-tema"); } catch (e) { /* önemli değil */ }
  if (kayitli) temaSecimi = kayitli;

  const dugmeler = document.querySelectorAll(".tema-sec button");
  const isaretle = () => dugmeler.forEach((d) => d.classList.toggle("aktif", d.dataset.tema === temaSecimi));
  dugmeler.forEach((d) => d.addEventListener("click", () => {
    temaSecimi = d.dataset.tema;
    try { localStorage.setItem("sumoloji-tema", temaSecimi); } catch (e) { /* önemli değil */ }
    isaretle();
    hepsiniCiz();
  }));
  isaretle();
}

temaButonlari();
temayiUygula();
document.getElementById("refreshBtn").addEventListener("click", havaGetir);
havaGetir();
setInterval(havaGetir, 15 * 60 * 1000);          // 15 dakikada bir veriyi yenile
setInterval(() => { if (veri) hepsiniCiz(); }, 60 * 1000);   // her dakika temayı kontrol et
