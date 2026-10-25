<div align="center">

# ⚡ MODULO VoltCube Pro: 3B Ürün Satış Sitesi

[![Live Website](https://img.shields.io/badge/Website-yusuftunga1.github.io/modulo--voltcube--pro-5CC8E8.svg?style=for-the-badge&logo=google-chrome&logoColor=white)](https://yusuftunga1.github.io/modulo-voltcube-pro/)
[![License: MIT](https://img.shields.io/badge/License-MIT-00ff88.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)](https://en.wikipedia.org/wiki/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6.svg?style=for-the-badge&logo=css3&logoColor=white)](https://en.wikipedia.org/wiki/CSS)
[![JavaScript](https://img.shields.io/badge/Vanilla_JS-F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Three.js](https://img.shields.io/badge/Three.js-r128-000000.svg?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org)

[🚀 Canlı Siteyi Aç](https://yusuftunga1.github.io/modulo-voltcube-pro/) · [✨ Öne Çıkanlar](#-öne-çıkanlar) · [💻 Çalıştırma](#-çalıştırma) · [🛠️ Teknik](#️-teknik-özellikler) · [🔒 Güvenlik](#-güvenlik) · [📋 Yayın Öncesi](#-yayın-öncesi-yapılacaklar)

</div>

---

MODULO VoltCube Pro (100W akıllı GaN şarj istasyonu) için hazırlanmış, tek sayfalık, hareketli ürün satış sitesi. Ürün gerçek fotoğraflarına göre 3B olarak kurulmuş; ziyaretçi kaydırdıkça model sayfada yer değiştiriyor, dönüyor ve seçilen özelliğe yaklaşıyor.

> **VoltCube Pro.** Dört cihaz. Tek üs.

---

## 📦 Ne var burada?

Düz HTML, CSS ve JavaScript. Çerçeve yok, derleme adımı yok, npm bağımlılığı yok.  
Dosyaları bir sunucuya kopyalamak siteyi yayına almak için yeterli.

| Dosya | Açıklama |
|---|---|
| `index.html` | Sayfa yapısı ve metinler |
| `style.css` | Tasarım, ürün renkleri, duyarlı düzen |
| `app.js` | 3B sahne, kaydırma animasyonu, sepet, menü, galeri |
| `assets/` | Ürün fotoğrafları, kırpmaları ve paylaşım görseli (`og.jpg`) |
| `fonts/` | Barlow Condensed ve Inter (SIL OFL), kendi sunucumuzdan |
| `vendor/` | Three.js r128 (SRI özetiyle doğrulanır) |
| `scripts/check.mjs` | Yayın öncesi otomatik doğrulama |
| `404.html`, `robots.txt`, `sitemap.xml` | Hata sayfası ve arama motoru dosyaları |

---

## ✨ Öne Çıkanlar

- 🧊 **Fotoğrafa Göre 3B Ürün:** Mat antrasit gövde, canlı değişen watt ekranı, ışıklı stand ve fırçalanmış metal yan paneller. Model tarayıcıda kodla çiziliyor, ayrı bir 3B dosyası yok.
- 🧭 **Kaydırmayla Yürüyen Sahne:** Model her bölümde durup bölümler arasında tek tur dönerek yer değiştiriyor. Hareket kaydırma konumuna bağlı, geri kaydırınca aynı yoldan dönüyor.
- 🎚️ **Özellik Şeritleri:** 100W GaN, güç göstergesi, 4'ü 1 arada ve ısı kontrolü şeritleri. Seçilen şeride göre model yaklaşıyor, arka plan ışığı ürünün ilgili rengine (LED camgöbeği, USB-A turuncusu) dönüyor.
- 🖼️ **Gerçek Ürün Galerisi:** Ön, yan ve arka yüz fotoğrafları yatay kaydırmalı, sayfaya sabitlenen bir bölümde akıyor.
- 🛒 **Sepet:** Adet seçimi, sepet çekmecesi, tarayıcıda saklanan sepet, Standart ile Pro fiyat karşılaştırması.
- 📱 **Mobil Uyumluluk:** Hamburger menü ve telefonda ayrı kurulan kompozisyon.
- ♿ **Erişilebilirlik:** İçeriğe atlama bağlantısı, klavye odağı, `prefers-reduced-motion` desteği ve WebGL yoksa 2B yedek.

---

## 🚀 Çalıştırma

```bash
python3 -m http.server 4173
```

Ardından `http://localhost:4173` adresini açın. Yayın öncesi doğrulama için:

```bash
node scripts/check.mjs
```

Betik yerel dosya bağlantılarını, three.js SRI özetini, CSP'yi, `app.js` söz dizimini ve temel sayfa kurallarını kontrol eder; kalan yayın öncesi maddeleri uyarı olarak listeler.

---

## 🛠️ Teknik Özellikler

| Özellik | Değer |
|---|---|
| **Diller** | HTML, CSS, JavaScript (Vanilla / Çerçevesiz) |
| **3B** | Three.js r128 (WebGL) |
| **Derleme (Build)** | Yok (Doğrudan çalışır) |
| **Yazı Tipleri** | *Barlow Condensed*, *Inter* (kendi sunucumuzdan, latin + latin-ext) |
| **Dış Bağımlılık** | Yok (Three.js ve yazı tipleri depoda) |
| **Düşük Güç Modu** | Zayıf cihazlarda çizim çözünürlüğü otomatik düşer |

---

## 🔒 Güvenlik

- Three.js depodaki kopyadan, **Subresource Integrity (SRI)** özetiyle yükleniyor; dosya değişirse tarayıcı çalıştırmıyor.
- `Content-Security-Policy` yalnızca kendi kaynağına izin veriyor; satır içi tek betik özetiyle (hash) izinli. Üçüncü taraf sunucuya istek gitmiyor.
- `referrer` bilgisi gönderilmiyor.
- Depoda API anahtarı, jeton ya da kişisel veri yok. Sepet yalnızca ziyaretçinin tarayıcısında (`localStorage`) tutuluyor; "Siparişi tamamla" sunucuya veri göndermiyor, yalnızca ziyaretçinin e-posta uygulamasını açıyor.

---

## 🧪 Güvenilirlik

- 3B sahne çökerse, WebGL yoksa ya da bağlam kaybolursa sayfanın geri kalanı (sepet, menü, galeri) çalışmaya devam eder; model yerine gerçek ürün fotoğrafı gösterilir.
- Sepet `localStorage` kullanılamasa da çalışır. Siparişte e-posta uygulaması açılmazsa "Sipariş özetini kopyala" düğmesi vardır.
- Eski tarayıcılar için `vh` yedekleri ve konik gradyan yedeği vardır.
- Arama motorları ve paylaşım için canonical, Open Graph, Twitter kartı, `Product` şeması, `robots.txt` ve `sitemap.xml` hazırdır.

---

## 📋 Yayın Öncesi Yapılacaklar

> Site GitHub Pages ile herkese açık yayında. Aşağıdaki maddeler gerçek satışa başlamadan önce tamamlanmalı.

- [ ] `siparis@modulo.example` ve `merhaba@modulo.example` yer tutucu e-postalarını gerçekleriyle değiştirin.
- [ ] Gerçek ödeme yok: "Siparişi tamamla" yalnızca e-posta taslağı açıyor. Ödeme altyapısı (ör. iyzico, Stripe) bağlanmalı.
- [ ] Kargo, iade ve garanti koşulları sitede yok; kesinleşince eklenmeli.
- [ ] Galerideki arka yüz için "güç girişi" ifadesini ürün bilgisiyle doğrulayın.
- [ ] Sepet tarayıcıda (`localStorage`) tutuluyor, çerez ve üçüncü taraf istek yok. Yine de gerçek satış için gizlilik ve mesafeli satış metinleri eklenmeli.
- [ ] `assets/` içindeki ürün fotoğraflarının kullanım hakkının size ait olduğundan emin olun.

---

## 📄 Lisans

Kod [MIT](LICENSE) lisansıyla paylaşılıyor. `assets/` içindeki ürün fotoğrafları ve MODULO markası bu lisansın kapsamında değildir.
