// kaynaklar/foto.jpg → assets/img/ altında web için kırpılmış görseller.
// Orijinal fotoğraf repoya girmez; sharp varsayılan olarak EXIF/konum verisini atar.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

// foto.jpg aslında HEIC; sharp okuyamadığı için Windows'un HEIF çözücüsüyle
// kaynaklar/foto-cevrilmis.png dosyasına çevrildi (README'deki adıma bakın).
const KAYNAK = 'kaynaklar/foto-cevrilmis.png';
const HEDEF = 'assets/img';
// Kaynak 2316×3088. Yüz ve omuzları ortalayan 4:5 kesit.
const KESIT = { left: 162, top: 713, width: 1900, height: 2375 };

await mkdir(HEDEF, { recursive: true });

const temel = () => sharp(KAYNAK).rotate().extract(KESIT);

await Promise.all([
  temel().resize(480, 600).webp({ quality: 80 }).toFile(`${HEDEF}/oznur-480.webp`),
  temel().resize(960, 1200).webp({ quality: 80 }).toFile(`${HEDEF}/oznur-960.webp`),
  temel().resize(960, 1200).jpeg({ quality: 82, mozjpeg: true }).toFile(`${HEDEF}/oznur-960.jpg`),
]);

console.log('Fotoğraflar üretildi →', HEDEF);
