/**
 * Downloads the Wikimedia Commons photos used across the site (city pages,
 * university cards, and the IGI process pilot page) and saves them locally
 * under public/images/, so the site serves them from our own domain instead
 * of hotlinking to upload.wikimedia.org.
 *
 * WHY THIS EXISTS:
 * We previously embedded these photos as <img src="https://commons.wikimedia.org/..."> ,
 * hotlinked directly from the production site. Investigation (2026-08-27) showed
 * Wikimedia's image servers reliably return HTTP 503 for this kind of cross-origin
 * <img>-tag embed (confirmed via network inspection across many different files and
 * widths), even though the exact same URL loads fine when opened directly in a
 * browser tab. The practical result: visitors never saw the photos, only broken-image
 * icons. Self-hosting removes the dependency on that unreliable behavior entirely.
 *
 * Run this once (and re-run it if photos are added or changed) BEFORE `npm run build`:
 *   node scripts/fetch-wikimedia-photos.js
 *
 * It uses Special:FilePath?width=N, which lets MediaWiki pick a valid, pre-generated
 * thumbnail size near N (arbitrary/unbucketed widths are rejected by Wikimedia's
 * thumbnail servers), and follows the redirect to download the actual image bytes.
 */

const fs = require('fs');
const path = require('path');

const PHOTOS = [
  // City hero photos — src/components/CityDetailContent.tsx
  { file: 'Romanian Athenaeum - Ateneul Român.JPG', width: 1200, out: 'public/images/cities/bucharest.jpg' },
  { file: 'Saint Michael Church in Cluj-Napoca.jpg', width: 1200, out: 'public/images/cities/cluj-napoca.jpg' },
  { file: 'Timisoara - Piata Unirii.jpg', width: 1200, out: 'public/images/cities/timisoara.jpg' },
  { file: 'Palace of Culture, Iasi.JPG', width: 1200, out: 'public/images/cities/iasi.jpg' },
  { file: 'Brasov, Piata Sfatului.jpg', width: 1200, out: 'public/images/cities/brasov.jpg' },
  { file: 'Constanta Casino.JPG', width: 1200, out: 'public/images/cities/constanta.jpg' },

  // Immigration pilot photo — src/components/IgiProcessContent.tsx
  { file: 'Carrefour Grand Arena, Berceni, Bucuresti (4657140692).jpg', width: 1200, out: 'public/images/immigration/igi-process-carrefour.jpg' },

  // University campus photos — src/lib/universities.ts
  { file: '8 Bulevardul Eroii Sanitari, Bucharest (01).jpg', width: 800, out: 'public/images/universities/carol-davila.jpg' },
  { file: 'UMF Iași.jpg', width: 800, out: 'public/images/universities/umf-iasi.jpg' },
  { file: 'Universitatea Bucuresti, Piata Universitatii (1).JPG', width: 800, out: 'public/images/universities/bucharest.jpg' },
  { file: 'Politehnica University of Bucharest.jpg', width: 800, out: 'public/images/universities/politehnica.jpg' },
  { file: 'Cladirea ASE Bucuresti.jpg', width: 800, out: 'public/images/universities/ase.jpg' },

  // dre-p36: "make every page feel alive" pass — one topical hero photo per major
  // section hub plus the strongest-matched sub-page in each section. Every filename
  // below was verified to exist on Commons via search during research (title +
  // Commons URL recorded in claude/seo-images-text-audit-dre-p36-2026-09-03.md in
  // the project); this script's own HTTP check below is the final verification that
  // it actually resolves. If a download fails, DO NOT swap in a guessed replacement
  // filename — leave it out and flag it instead (the <img> block fails gracefully
  // via onError, so a missing photo just means that one block quietly disappears).
  { file: 'Lipscani Street, Bucharest.jpg', width: 1200, out: 'public/images/needs/needs-hub.jpg' },
  { file: 'Gate of the BCR Headquarters Building (Bucharest, Romania).jpg', width: 1200, out: 'public/images/needs/banking.jpg' },
  { file: 'HC arrivals.jpg', width: 1200, out: 'public/images/immigration/hub.jpg' },
  { file: 'New Romanian Passport.jpg', width: 1200, out: 'public/images/immigration/citizenship.jpg' },
  { file: 'Skyscrapers in Bucharest.jpg', width: 1200, out: 'public/images/work/hub.jpg' },
  { file: 'Ministerul Muncii si Protectiei Sociale.jpg', width: 1200, out: 'public/images/work/work-permit.jpg' },
  { file: 'Bucharest Business District (cropped).jpg', width: 1200, out: 'public/images/company/hub.jpg' },
  { file: 'CEC Palace (11321332233).jpg', width: 1200, out: 'public/images/company/bank-account.jpg' },
  { file: 'Cluj-Napoca University of Babes-Bolyai.JPG', width: 1200, out: 'public/images/study/preparatory-year.jpg' },
  { file: 'Palace of the Parliament-balcony-20040801.JPG', width: 1200, out: 'public/images/romania/hub.jpg' },
  { file: 'Bran Castle - Castelul Bran.JPG', width: 1200, out: 'public/images/romania/tourism.jpg' },
  { file: 'Henri Coanda Otopeni airport entrance.jpg', width: 1200, out: 'public/images/start-here/planning-to-come.jpg' },
];

async function downloadOne({ file, width, out }) {
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
  const destPath = path.join(process.cwd(), out);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });

  const res = await fetch(url, {
    redirect: 'follow',
    headers: {
      // A normal browser-like UA; MediaWiki does not require this, but it's good hotlinking etiquette.
      'User-Agent': 'DORVIA-EUROP-site-build/1.0 (https://dorvia.vercel.app; contact via site)'
    }
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} for "${file}" (${url})`);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 2000) {
    throw new Error(`Suspiciously small response (${buf.length} bytes) for "${file}" — refusing to save, check the URL/file name.`);
  }

  fs.writeFileSync(destPath, buf);
  console.log(`OK  ${out}  (${(buf.length / 1024).toFixed(0)} KB)  <- ${file}`);
}

async function main() {
  console.log(`Downloading ${PHOTOS.length} Wikimedia Commons photos to self-host under public/images/ ...\n`);
  let failures = 0;

  for (const photo of PHOTOS) {
    try {
      await downloadOne(photo);
    } catch (err) {
      failures++;
      console.error(`FAIL ${photo.out}  <- ${photo.file}\n     ${err.message}`);
    }
  }

  console.log('');
  if (failures > 0) {
    console.error(`${failures} of ${PHOTOS.length} photo(s) failed to download. Fix the issue above and re-run this script before building — a missing file just means that photo block won't render (it fails gracefully), but it should still be investigated.`);
    process.exit(1);
  }

  console.log('All photos downloaded successfully.');
}

main();
