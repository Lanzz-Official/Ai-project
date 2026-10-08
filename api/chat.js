const { formidable } = require('formidable');
const fs = require('fs');

function getSystemPrompt() {
  const now = new Date();
  const tanggal = now.toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const jam = now.toLocaleTimeString('id-ID', {
    timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit'
  });

  return `Kamu Razki.Ai, asisten Villa Razki View Sawarna. Ngobrol santai, ramah, natural. Pakai "saya" dan panggil tamu "Kak".

# ⚠️ ATURAN #1 (PALING PENTING - WAJIB)
Setiap balasan HANYA membahas SATU hal: pertanyaan terakhir user.
- Pertanyaan simpel (iya/tidak, angka, nama) → jawab MAKSIMAL 2 KALIMAT.
- Pertanyaan sedang → jawab MAKSIMAL 3 KALIMAT.
- Pertanyaan kompleks (butuh list) → baru boleh panjang, tapi tetap fokus.
JANGAN menambahkan info lain yang tidak ditanya.
JANGAN menyebut harga, kamar, fasilitas, atau lokasi kalau user tidak menanyakannya.
JANGAN mengulang info dari pesan sebelumnya.

# ⚠️ ATURAN SAPAAN (WAJIB)
- Sapaan umum ("Halo", "Hai", "Hi", "Selamat datang", "Selamat pagi/siang/sore/malam") HANYA di pesan PERTAMA percakapan.
- Untuk pesan LANJUTAN, JANGAN buka dengan sapaan umum. Langsung jawab.
- JANGAN ulang kata sapaan di tengah balasan juga.
- Contoh SALAH di pesan ke-2 dst: "Halo Kak, iya betul..." atau "Hai Kak, jadi..."
- Contoh BENAR: "Iya betul, Kak." atau "Betul, Kak."

PENGECUALIAN SALAM AGAMA:
- Kalau user kirim "Assalamualaikum" (di pesan pertama ATAU lanjutan), WAJIB balas dengan "Waalaikumsalam, Kak." Baru lanjut jawab pertanyaannya.
- Salam agama itu wajib dibalas, beda dengan sapaan umum yang cuma di pesan pertama.
- Kalau "Assalamualaikum" digabung dengan pertanyaan (misal: "Assalamualaikum, harganya berapa?"), balas: "Waalaikumsalam, Kak. [langsung jawab pertanyaannya]"
- JANGAN ulang "Waalaikumsalam" dua kali atau lebih dalam satu balasan.

# ⚠️ ATURAN ANTI-ULANG (WAJIB)
- JANGAN bawa-bawa kata/kalimat dari jawaban sebelumnya.
- JANGAN niru pola balasan lama. Fokus ke pertanyaan terakhir.
- Kalau sudah kasih info lokasi, jangan kasih lagi kecuali user minta ulang.
- Kalau sudah bilang harga chat WA, jangan ulang lagi di pesan berikutnya kecuali user tanya harga lagi.

# CONTOH SALAH vs BENAR

❌ SALAH:
User: "1+3?"
AI: "Penginapan kita punya 8 kamar, Kak. Untuk harga chat WA 0838-3025-8014. Oh iya, 1+3 itu 4, Kak."

✅ BENAR:
User: "1+3?"
AI: "4, Kak 😄"

---

❌ SALAH:
User: "Deket Alfamart?"
AI: "Halo Kak! Ada Alfamart di Sawarna. Villa punya 8 kamar AC/Non-AC. Untuk harga chat WA."

✅ BENAR:
User: "Deket Alfamart?"
AI: "Ada, Kak. Alfamart dan Indomaret lumayan dekat dari sini."

---

❌ SALAH:
User: "Halo"
AI: "Halo Kak! Kami punya 8 kamar..."

✅ BENAR:
User: "Halo"
AI: "Halo Kak! Ada yang bisa saya bantu? 😊"

---

❌ SALAH:
User: "Lokasinya dimana?" (pesan ke-3)
AI: "Hai Kak! Lokasinya di Sawarna. Kami punya 8 kamar. Untuk harga chat WA."

✅ BENAR:
User: "Lokasinya dimana?" (pesan ke-3)
AI: "Di Pantai Ciantir, Sawarna, Banten. Plus Code 2865+FV2. Persis depan pantai, Kak."

---

❌ SALAH:
User: "Fasilitasnya apa aja?"
AI: "Halo Kak! Ada WiFi, dapur umum, parkir. Untuk harga chat WA. Kami punya 8 kamar AC/Non-AC. Alfamart juga dekat."

✅ BENAR:
User: "Fasilitasnya apa aja?"
AI: "Ada WiFi gratis, dapur umum, dan parkir luas, Kak."

---

❌ SALAH:
User: "Assalamualaikum"
AI: "Halo Kak! Selamat datang..."

✅ BENAR:
User: "Assalamualaikum"
AI: "Waalaikumsalam, Kak! Ada yang bisa saya bantu? 😊"

---

❌ SALAH:
User: "Assalamualaikum, harga kamar berapa?"
AI: "Waalaikumsalam Kak! Assalamualaikum Kak! Kami punya 8 kamar..."

✅ BENAR:
User: "Assalamualaikum, harga kamar berapa?"
AI: "Waalaikumsalam, Kak. Untuk harga terbaru, bisa chat WhatsApp 0838-3025-8014 ya."

# ATURAN LAIN
- Jangan sebut nama model/provider. Kalau ditanya "kamu AI apa?" jawab: "Saya Razki.Ai, asisten Villa Razki View Sawarna."
- Kalau user tanya topik di luar villa (MTK, puisi, resep, dll), jawab langsung dengan benar. Gak usah dipaksa balik ke villa.
- Kalau user pakai bahasa gaul, balas santai tapi tetap sopan.
- Jangan pakai em-dash (—), pakai tanda hubung biasa (-).
- Emoji boleh 1-2 aja, jangan berlebihan.

# DATA VILLA
- Nama: Villa Razki View Sawarna
- Lokasi: Pantai Ciantir, Sawarna, Kec. Bayah, Kab. Lebak, Banten 42393. Plus Code 2865+FV2. Depan pantai.
- 8 kamar, semua KM dalam. Pilihan: AC, Non-AC, kipas. Kapasitas 2-6 orang.
- Fasilitas: WiFi gratis, dapur umum, parkir luas.
- Check-in/out: bebas jam berapa saja.
- Akses: bisa mobil, mobil besar tidak bisa.
- WA/Booking: 0838-3025-8014
- HARGA & KETERSEDIAAN: selalu arahkan ke WA 0838-3025-8014. Jangan ngarang angka.

# INFO LOKAL SAWARNA
- Alfamart & Indomaret: ADA di Sawarna, lumayan dekat villa. Buka sampai malam.
- Warung & toko kelontong: banyak tersebar di sekitar Sawarna
- Pasar tradisional: ada di Sawarna
- Minimarket buka sekitar 07.00-22.00
- Mini ATM BJB: di TIC Pantai Sawarna (tarik tunai, QRIS, EDC)
- ATM bank umum: di Kec. Bayah, sekitar 15 km dari Sawarna
- Bengkel motor: ada di Sawarna dan sekitar Bayah. Untuk bengkel mobil besar kemungkinan harus ke Bayah.
- Apotek: ada di sekitar Sawarna dan Bayah
- Klinik/Puskesmas: ada di Sawarna dan Bayah. Untuk darurat besar, rujukan ke RSUD Bayah.
- Musala/Masjid: ada di sekitar Sawarna. Villa juga nyediain tempat ibadah.
- Laundry: ada di sekitar Sawarna. Kalau butuh express, tanya tim villa via WA.
- Salon/barbershop: ada di Sawarna
- SPBU: di luar area Sawarna, isi bensin dulu sebelum masuk
- Sinyal HP: ada, tapi terbatas di beberapa spot
- Kalau user butuh info spesifik yang belum jelas (lokasi persis bengkel, apotek 24 jam, dll), arahkan ke WA 0838-3025-8014

# TRANSPORTASI
- Dari Jakarta: 6-7 jam via Serang-Pandeglang-Bayah
- Bus DAMRI Rangkasbitung-Sawarna: 07.30 & 11.30, Rp60.000
- DAMRI dari Sawarna: 05.20 & 12.00
- Elf Sawarna-Pelabuhan Ratu, ojek juga ada
- Rangkasbitung bisa diakses dari Jakarta via KRL

# WISATA SEKITAR
- Pantai Ciantir (depan villa, sunset bagus, favorit peselancar)
- Pantai Pasir Putih (air jernih, cocok berenang keluarga)
- Tanjung Layar (tebing ikonik, spot foto)
- Legon Pari (air bening, snorkeling)
- Goa Langir (goa alami)
- Karang Bokor (formasi karang, sunrise)
- Pantai Pulo Manuk, Pantai Karang Taraje
- Tiket masuk pantai: Rp5.000-15.000
- Surfing terbaik: Mei-Oktober

# KULINER
- Banyak warung seafood & masakan Sunda di Sawarna
- Menu khas: ikan bakar, seafood segar, nasi uduk, sate
- Tamu boleh bawa makanan luar atau masak di dapur umum
- Kalau user minta rekomendasi spesifik: arahkan ke WA 0838-3025-8014

# WAKTU
Hari ini: ${tanggal}
Sekarang: ${jam} WIB`;
}

function first(v) {
  return Array.isArray(v) ? v[0] : v;
}

function field(fields, name, fallback = '') {
  const v = first(fields?.[name]);
  return typeof v === 'string' ? v : fallback;
}

function filesArray(files) {
  const v = files?.files || [];
  return (Array.isArray(v) ? v : [v]).filter(Boolean);
}

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      multiples: true,
      maxFileSize: 25 * 1024 * 1024,
      keepExtensions: true
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

function fileBuffer(file) {
  return fs.readFileSync(file.filepath);
}

function dataUrl(file) {
  return `data:${file.mimetype || 'application/octet-stream'};base64,${fileBuffer(file).toString('base64')}`;
}

async function transcribe(file) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return '';

  try {
    const form = new FormData();
    form.append(
      'file',
      new Blob([fileBuffer(file)], { type: file.mimetype || 'audio/webm' }),
      file.originalFilename || 'voice.webm'
    );
    form.append('model', process.env.OPENAI_TRANSCRIBE_MODEL || 'gpt-4o-mini-transcribe');
    form.append('language', 'id');

    const r = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}` },
      body: form
    });

    const d = await r.json().catch(() => ({}));
    if (!r.ok) {
      console.error('OpenAI transcription error:', d);
      return '';
    }
    return d.text || '';
  } catch (err) {
    console.error('Transcription fallback:', err);
    return '';
  }
}

async function extractFile(file) {
  const name = file.originalFilename || 'file';
  const type = file.mimetype || '';
  const size = file.size || 0;

  if (type.startsWith('text/') || /\.(txt|md|csv|json|log)$/i.test(name)) {
    const text = fileBuffer(file).toString('utf8');
    return { name, type, size, text: text.slice(0, 30000) };
  }

  if (type === 'application/pdf' || /\.pdf$/i.test(name)) {
    try {
      const pdfParse = require('pdf-parse');
      const out = await pdfParse(fileBuffer(file));
      return { name, type, size, text: (out.text || '').slice(0, 30000), pages: out.numpages };
    } catch (e) {
      return { name, type, size, error: 'PDF tidak berhasil diekstrak: ' + e.message };
    }
  }

  if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || /\.docx$/i.test(name)) {
    try {
      const mammoth = require('mammoth');
      const out = await mammoth.extractRawText({ buffer: fileBuffer(file) });
      return { name, type, size, text: (out.value || '').slice(0, 30000) };
    } catch (e) {
      return { name, type, size, error: 'DOCX tidak berhasil diekstrak: ' + e.message };
    }
  }

  if (/\.(xlsx|xls)$/i.test(name) || /spreadsheet|excel/i.test(type)) {
    try {
      const XLSX = require('xlsx');
      const wb = XLSX.read(fileBuffer(file), { type: 'buffer' });
      const parts = [];
      for (const sheet of wb.SheetNames.slice(0, 10)) {
        const csv = XLSX.utils.sheet_to_csv(wb.Sheets[sheet]);
        parts.push(`SHEET: ${sheet}\n${csv.slice(0, 12000)}`);
      }
      return { name, type, size, text: parts.join('\n\n').slice(0, 30000), sheets: wb.SheetNames };
    } catch (e) {
      return { name, type, size, error: 'Spreadsheet tidak berhasil dibaca: ' + e.message };
    }
  }

  return { name, type, size, unsupported: true };
}

async function callChat({ message, history, files }) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    throw new Error('OPENROUTER_API_KEY belum diatur di environment server.');
  }

  let finalMessage = message || '';
  const content = [];
  const notes = [];
  let transcript = '';
  const extracted = [];

  for (const file of files) {
    const type = file.mimetype || '';
    const name = file.originalFilename || 'file';

    if (type.startsWith('audio/')) {
      transcript = await transcribe(file);
      if (transcript) {
        finalMessage = finalMessage ? `${finalMessage}\n\n[Transkrip voice]\n${transcript}` : transcript;
        notes.push(`Voice note ${name} berhasil ditranskrip.`);
      } else {
        notes.push(`Voice note ${name} diterima. Transkripsi server tidak aktif.`);
      }
      continue;
    }

    if (type.startsWith('image/')) {
      if ((file.size || 0) <= 7 * 1024 * 1024) {
        content.push({ type: 'image_url', image_url: { url: dataUrl(file) } });
        notes.push(`Gambar ${name} dapat dianalisis.`);
      } else {
        notes.push(`Gambar ${name} terlalu besar untuk vision.`);
      }
      continue;
    }

    const x = await extractFile(file);
    extracted.push(x);
    if (x.text) notes.push(`Isi ${name}:\n${x.text}`);
    else if (x.unsupported) notes.push(`File ${name} (${type}) belum didukung.`);
    else if (x.error) notes.push(x.error);
  }

  if (finalMessage) {
    content.unshift({ type: 'text', text: finalMessage });
  }

  if (notes.length) {
    content.push({ type: 'text', text: '[Lampiran]\n' + notes.join('\n\n') });
  }

  if (!content.length) {
    content.push({ type: 'text', text: 'Tolong bantu.' });
  }

  // History dipotong cuma 6 pesan terakhir
  const safeHistory = (Array.isArray(history) ? history : [])
    .filter(x => x && (x.role === 'user' || x.role === 'assistant'))
    .slice(-6)
    .map(x => ({
      role: x.role,
      content: String(x.content || '').slice(0, 2000)
    }));

  const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
      'HTTP-Referer': process.env.APP_URL || 'http://localhost',
      'X-Title': 'Razki.AI'
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || 'openai/gpt-4.1-mini',
      messages: [
        { role: 'system', content: getSystemPrompt() },
        ...safeHistory,
        { role: 'user', content }
      ],
      temperature: 0.4,
      top_p: 0.85,
      frequency_penalty: 0.7,
      presence_penalty: 0.6,
      max_tokens: 500
    })
  });

  const d = await r.json().catch(() => ({}));
  if (!r.ok) {
    throw new Error(d.error?.message || 'OpenRouter gagal.');
  }

  return {
    reply: d.choices?.[0]?.message?.content || 'AI tidak memberi jawaban.',
    transcript,
    extracted: extracted.map(x => ({
      name: x.name,
      type: x.type,
      size: x.size,
      pages: x.pages,
      sheets: x.sheets,
      error: x.error,
      chars: x.text?.length || 0
    }))
  };
}

async function imageEdit(file, prompt) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('AI edit gambar membutuhkan OPENAI_API_KEY.');

  const form = new FormData();
  form.append('model', 'gpt-image-1');
  form.append('prompt', prompt || 'Edit gambar ini sesuai instruksi.');
  form.append('image', new Blob([fileBuffer(file)], { type: file.mimetype || 'image/png' }), file.originalFilename || 'image.png');
  form.append('size', 'auto');

  const r = await fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}` },
    body: form
  });

  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error?.message || 'AI image edit gagal.');

  const b64 = d.data?.[0]?.b64_json;
  if (!b64) throw new Error('AI tidak mengembalikan gambar hasil edit.');

  return { dataUrl: `data:image/png;base64,${b64}` };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let fields = {};
    let files = {};
    const ct = String(req.headers['content-type'] || '');

    if (ct.includes('multipart/form-data')) {
      ({ fields, files } = await parseForm(req));
    } else {
      fields = req.body || {};
    }

    const action = field(fields, 'action', 'chat');
    const uploaded = filesArray(files);

    if (action === 'image-edit') {
      const image = uploaded.find(f => (f.mimetype || '').startsWith('image/'));
      if (!image) {
        return res.status(400).json({ error: 'Gambar untuk diedit belum dikirim.' });
      }
      const result = await imageEdit(image, field(fields, 'prompt', 'Edit gambar ini sesuai instruksi.'));
      return res.status(200).json(result);
    }

    let history = [];
    try {
      history = JSON.parse(field(fields, 'history', '[]'));
    } catch {}

    const result = await callChat({
      message: field(fields, 'message', '').trim(),
      history,
      files: uploaded
    });

    return res.status(200).json(result);

  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message || 'Server error' });
  }
};
