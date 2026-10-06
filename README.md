# sumoloji
Bartın Üniversitesinde okuyan kız öğrencilerine, hava durumu tahmini sunan ve minik tavsiyeler veren HTML sitesi.

🌸 Sümoloji

Hayatı kolaylaştıracak tahminler ✨

Bartın'da okuyan üniversiteli kızlar için hazırlanmış, tatlı ve renkli bir hava durumu sayfası. Sadece sıcaklık göstermiyor, ortama göre ne giyeceğini de söylüyor ve her gün güzel hissettiren bir cümleyle başlıyor.

Saf HTML, CSS ve JavaScript ile yazıldı. Kurulum, derleme ya da sunucu gerekmiyor, index.htmltarayıcıda açma yeterli.

# ÖZELLİKLER
7 günlük tahmin: her günün, günün havası, cümlesi ve güncellemeleri değişir.
Ne giysem? :
Saç: rüzgar km/s'ye göre saçların uçuşup uçuşmayacağını söyler, topuz, örgü ya da toka önerir.
Kıyafet: sıcaklığa göre kaban, mont, ceket, hırka ya da ince kıyafet önerir.
Ayakkabı: Yağmurda çizme ya da bot, havanın devamında devam etmesi için spor ayakkabı, babet ve topukluları önerir. Yağmur ve karda babet ile topukluyu önermez.
Çanta: şemsiye, toka, el kremi gibi unutulmaması gerekenleri sıralar.
Günün cümlesi: günün uygun bir motivasyon cümlesi ve her gün boyunca devam eden bir cümlesi (31 farklı cümle).
Otomatik tema: gün doğumu ve kaybına göre gündüz (lila, pembe, mavi), akşam (gün kaybı) ve gece (yıldızlı, ay ışığı) teması. İstersen elle de sisteminsin.
Hava değişimi: yağmurda yağmur damlaları, karda kenarlarda kar taneleri.
Canlı veri: 15 dakikada bir kendini yeniler.
Telefon uyumlu tasarım.
# KULLANIM AŞAMALARI
Depoyu indir ya da klonla:
vurmak
   git clone https://github.com/KULLANICI_ADIN/sumoloji.git
index.htmlDosyaya çift tıklayın, tarayıcıda açın. Hepsi bu.

VS Code kullanansan Live Server eklentisiyle index.html'e sağ açabilir Live Server ile aç diyebilirsin, kaydettiğin anda sayfa yenilenir.

# VERİ KAYNAĞI VE API ANAHTARI

Sayfa iki hava durumu servisini destekleme:

Servis	Anahtar	Açıklama
Açık Meteo	Gerekmez	varsayılan. 7 günlük tahmin verir.
AçıkHavaHaritası	Gerekir	İstersen kullansın. Ücretsiz plan 5 günlük tahmini gelir.

OpenWeatherMap kullanarak script.jselinizdekilerin başındaki satıra anahtarını yazın:

js
const OWM_KEY = "anahtarın";

Anahtar boşsa ya da çalışmazsa sayfa otomatik olarak Open-Meteo'ya geçer. Hangi kaynağın sanayi sayfasının altında yazar.

⚠️Önemli : Bu depoyu GitHub'a yüklerken OWM_KEYsatırını boş bırakır . Bu sayfa tarayıcısı için anahtar, siteyi açan herkes tarafından okunabilir. Herkesin açık bir depoya yazdığı anahtarın diğerlerini da görebilir. Açık yayında Open-Meteo ile kalmak güvenlidir.

# EFEKTLERİ DENEME

ek Aşağıdakileri adres değiştirirki sayfa adresinin sonuna kadar temayı ve değiştirme hemen görünürse:

Adres eki	Ne yapar
?tema=gece	Gece temasını sağlar ( aksamve gunduzde olur)
?efekt=kar	Kar yağdırır ( yagmurve yokda olur)
?tema=gece&efekt=kar	birden
# DÜZENLEME
Ne değişecek	Nerede
Güzeller	script.jsiçindeki SOZLERveOZGUVEN
Öneri metinleri	script.jsiç saciOner, kiyafetOner, ayakkabiOner,cantaOner
günler	style.cssTekil --bg, --quotegibi değişkenler (gündüz, akşam ve gece için ayrı ayrı)
Şehir	script.jsiçindeki LATve LON(şu an Bartın)

# GITHUB PAGES İLE YAYINLAMA  
Dosyaları yeni bir GitHub deposuna yükleyin ( OWM_KEYboş kalsın).
Depoda Ayarlar → Sayfalar bölümüne git.
Kaynak olarak Şubeden dağıt seçeneğini seçin, dal olarak mainve klasör olarak / (root)seçin, Kaydet de.
Birkaç dakika sonra sayfanın https://KULLANICI_ADIN.github.io/sumoloji/bulunduğu yerde yayında olur.
# DOSYALAR
sumoloji/
├── index.html   # sayfanın iskeleti
├── style.css    # tasarım ve üç tema
├── script.js    # veri çekme, öneriler, efektler
├── README.md
└── LICENSE
# VERİ KAYNAKLARI
Hava verileri: Open-Meteo ve OpenWeatherMap . Kullanım verileri ve kaynak gösterme kaybı kendi sayfalarından kontrol et. Open-Meteo'nun ücretsiz sürümü ticari olmayan kullanımlar içindir.
📄 Lisans

Bu proje MIT Lisansı ile paylaşılmıştır. Kodu özgürce kullanabilir, şansınızı paylaşabilirsiniz.
