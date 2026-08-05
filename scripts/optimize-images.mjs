import sharp from 'sharp'
const jobs = [
  ['public/binnouh-hero-arch.png', 'public/binnouh-hero-arch.webp', 1600, 'webp'],
  ['public/icon11.png',            'public/icon11.webp',            420,  'webp'],
  ['public/icons.png',             'public/icons.webp',             512,  'webp'],
  ['public/icons.png',             'public/favicon-512.png',        512,  'png'],
  ['public/icons.png',             'public/apple-touch-icon.png',   180,  'png'],
  ['public/hero-banner.png',       'public/hero-banner.webp',       1600, 'webp'],
]
for (const [src, out, w, fmt] of jobs) {
  const img = sharp(src).resize({ width: w, withoutEnlargement: true })
  await (fmt === 'webp' ? img.webp({ quality: 82 }) : img.png({ compressionLevel: 9, palette: true })).toFile(out)
  const meta = await sharp(out).metadata()
  console.log(out, (meta.size/1024).toFixed(0)+'KB', meta.width+'x'+meta.height)
}
