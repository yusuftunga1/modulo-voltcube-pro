<div align="center">

# ⚡ MODULO VoltCube Pro: 3B Ürün Satış Sitesi

[![License: MIT](https://img.shields.io/badge/License-MIT-00ff88.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)](https://en.wikipedia.org/wiki/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6.svg?style=for-the-badge&logo=css3&logoColor=white)](https://en.wikipedia.org/wiki/CSS)
[![JavaScript](https://img.shields.io/badge/Vanilla_JS-F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Three.js](https://img.shields.io/badge/Three.js-r128-000000.svg?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org)

[✨ Öne Çıkanlar](#-öne-çıkanlar) · [🚀 Çalıştırma](#-çalıştırma) · [🛠️ Teknik](#️-teknik-özellikler) · [🔒 Güvenlik](#-güvenlik) · [📋 Yayın Öncesi](#-yayın-öncesi-yapılacaklar)

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
| `assets/` | Ürün fotoğrafları ve kırpmaları |

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

Ardından `http://localhost:4173` adresini açın.

---

## 🛠️ Teknik Özellikler

| Özellik | Değer |
|---|---|
| **Diller** | HTML, CSS, JavaScript (Vanilla / Çerçevesiz) |
| **3B** | Three.js r128 (WebGL) |
| **Derleme (Build)** | Yok (Doğrudan çalışır) |
| **Yazı Tipleri** | *Barlow Condensed*, *Inter* |
| **Düşük Güç Modu** | Zayıf cihazlarda çizim çözünürlüğü otomatik düşer |

---

## 🔒 Güvenlik

- Three.js, **Subresource Integrity (SRI)** özetiyle yükleniyor; dosya değişirse tarayıcı çalıştırmıyor.
- `Content-Security-Policy` ile yalnızca cdnjs betikleri ve Google Fonts'a izin veriliyor.
- `referrer` bilgisi gönderilmiyor.
- Depoda API anahtarı, jeton ya da kişisel veri yok. Sepet yalnızca ziyaretçinin tarayıcısında (`localStorage`) tutuluyor; "Siparişi tamamla" sunucuya veri göndermiyor, yalnızca ziyaretçinin e-posta uygulamasını açıyor.

---

## 📋 Yayın Öncesi Yapılacaklar

- [ ] `siparis@modulo.example` ve `merhaba@modulo.example` yer tutucu e-postalarını gerçekleriyle değiştirin.
- [ ] Gerçek ödeme yok: "Siparişi tamamla" yalnızca e-posta taslağı açıyor. Ödeme altyapısı (ör. iyzico, Stripe) bağlanmalı.
- [ ] Kargo, iade ve garanti koşulları sitede yok; kesinleşince eklenmeli.
- [ ] Galerideki arka yüz için "güç girişi" ifadesini ürün bilgisiyle doğrulayın.
- [ ] Yazı tipleri Google Fonts'tan, three.js cdnjs'ten yükleniyor. Yayında gizlilik (KVKK) metninde belirtin ya da dosyaları kendi sunucunuza alın.
- [ ] `assets/` içindeki ürün fotoğraflarının kullanım hakkının size ait olduğundan emin olun.

---

## 📄 Lisans

Kod [MIT](LICENSE) lisansıyla paylaşılıyor. `assets/` içindeki ürün fotoğrafları ve MODULO markası bu lisansın kapsamında değildir.
