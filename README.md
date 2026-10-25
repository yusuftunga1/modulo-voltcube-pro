# MODULO VoltCube Pro: ürün satış sitesi

MODULO VoltCube Pro (100W akıllı GaN şarj istasyonu) için tek sayfalık, hareketli ürün satış sitesi.
Derleme adımı yok: düz HTML, CSS ve JavaScript.

## Çalıştırma

```bash
python3 -m http.server 4173
```

Ardından `http://localhost:4173` adresini açın. (`index.html` dosyası doğrudan da açılır; yazı tipleri ve three.js internetten yüklenir.)

## Özellikler

- Gerçek ürün fotoğrafına göre kurulmuş 3D model (three.js r128): canlı watt ekranı, ışıklı stand, kaydırmaya bağlı hareket
- Özellik şeritleri: seçilen özelliğe göre model yaklaşır, arka plan rengi değişir
- Yatay kaydırmalı gerçek ürün galerisi, teknik özellik tablosu, Standart ile Pro karşılaştırması
- Sepet (tarayıcıda saklanır), mobil menü, `prefers-reduced-motion` desteği

## Yayına almadan önce yapılacaklar

- [ ] `siparis@modulo.example` ve `merhaba@modulo.example` yer tutucu e-postalarını gerçekleriyle değiştirin.
- [ ] "Siparişi tamamla" şu an yalnızca sepet özetiyle bir e-posta taslağı açar. Gerçek ödeme altyapısı (ör. iyzico, Stripe) bağlanmalıdır.
- [ ] Kargo, iade ve garanti koşulları sitede yer almıyor; kesinleşince eklenmelidir.
- [ ] Galerideki "güç girişi" ifadesini ürün bilgisiyle doğrulayın.
- [ ] Yazı tipleri Google Fonts'tan, three.js cdnjs'ten yüklenir. Yayında KVKK/gizlilik metninde belirtin ya da dosyaları kendi sunucunuza alın.
- [ ] `assets/` içindeki ürün fotoğraflarının kullanım hakkının size ait olduğundan emin olun.

## Dosyalar

| Dosya | Açıklama |
| --- | --- |
| `index.html` | Sayfa yapısı ve metinler |
| `style.css` | Tasarım, renkler, duyarlı düzen |
| `app.js` | 3D sahne, kaydırma animasyonu, sepet, menü, galeri |
| `assets/` | Ürün fotoğrafları ve kırpmaları |
