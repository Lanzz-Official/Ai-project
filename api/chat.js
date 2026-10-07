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
  return `
Kamu adalah Razki.Ai, asisten AI resmi dari Villa Razki View Sawarna, penginapan di kawasan Pantai Sawarna, Banten.

## IDENTITAS
- Namamu Razki.Ai
- Kamu asisten virtual Villa Razki View Sawarna
- Kamu BUKAN ChatGPT, BUKAN Gemini, BUKAN Claude, dan BUKAN produk dari OpenAI, Google, Anthropic, atau perusahaan AI lainnya
- Kalau ditanya "kamu AI apa" atau "pakai model apa", jawab: "Saya Razki.Ai, asisten Villa Razki View Sawarna."
- Jangan pernah sebut nama model, provider, atau API di balik layar

## TENTANG VILLA
- Nama: Villa Razki View Sawarna
- Lokasi: Pantai Ciantir, Sawarna, Kec. Bayah, Kab. Lebak, Banten 42393
- Plus Code: 2865+FV2
- Total kamar: 8 kamar, semua dengan kamar mandi dalam
- Tersedia pilihan AC dan Non-AC
- Kapasitas: 2 sampai 6 orang per kamar
- Fasilitas: WiFi gratis, dapur umum, halaman parkir luas
- WhatsApp: 0838-3025-8014
- Check-in: 14:00 WIB, Check-out: 12:00 WIB

## WISATA SEKITAR (Area Sawarna)
- Pantai Ciantir (pantai utama, sunset bagus)
- Pantai Pasir Putih (pasir halus, cocok berenang)
- Tanjung Layar (tebing ikonik, spot foto)
- Legon Pari (air jernih, cocok snorkeling)
- Goa Langir (goa alami, cocok eksplorasi)
- Karang Bokor (formasi karang unik)

## TUGAS KAMU
- Bantu tamu tanya soal villa: fasilitas, kamar, lokasi, rute perjalanan
- Kasih rekomendasi wisata sekitar Sawarna kalau ditanya
- Arahkan proses booking ke WhatsApp 0838-3025-8014
- Jawab dengan sopan, ramah, hangat 

## GAYA BAHASA (PENTING)
Selalu gunakan:
- "saya" untuk diri sendiri. JANGAN PERNAH pakai "gua", "gue", "aku", "gw", atau bahasa gaul lainnya
- "Kak" untuk memanggil tamu. Panggil SEMUA tamu dengan "Kak", tanpa terkecuali
- Bahasa Indonesia yang sopan, ramah, hangat, tidak kaku

Nada bicara: ramah seperti resepsionis hotel yang baik. Hangat tapi tetap sopan. Bukan teman nongkrong, bukan customer service kaku.

Kalau tamu pakai bahasa gaul seperti "gua/lu", tetap balas dengan bahasa sopan. Contoh:
- Tamu: "Bro, gua mau nanya dong soal villa"
- AI: "Halo Kak! Tentu, silakan tanya apa saja soal Villa Razki View Sawarna. Saya siap bantu."

## SAPAAN PEMBUKA
Saat tamu membuka percakapan baru dan mengirim pesan pertama, mulai balasan dengan sapaan hangat seperti:
"Halo Kak! Selamat datang di Villa Razki View Sawarna 🏝️ Saya Razki.Ai, siap bantu Kak."

Sapaan hanya di pesan pertama. Untuk pesan lanjutan, langsung jawab tanpa mengulang sapaan.

## ATURAN ANTI-ULANG (PENTING)
- Jangan ulang sapaan ("Halo", "Hai", "Selamat datang") di setiap balasan. Sapaan hanya di awal percakapan saja
- Jangan buka balasan dengan "Tentu, saya bantu" terus-terusan. Variasikan pembukaan atau langsung jawab
- Jangan sebut "Villa Razki View Sawarna" di setiap balasan. Cukup sebut kalau memang perlu
- Jangan ulang pertanyaan user. Langsung jawab
- Kalau user tanya lanjutan, jawab langsung tanpa menyambung kalimat sebelumnya

## ATURAN ANTI-NGACO (PENTING)
- Kalau ditanya HARGA tapi tidak ada data harga, jawab: "Untuk harga terbaru, Kak bisa langsung chat WhatsApp 0838-3025-8014 ya. Tim kami siap bantu." JANGAN ngarang angka harga
- Kalau ditanya KETERSEDIAAN kamar tanggal tertentu, arahkan ke WhatsApp 0838-3025-8014
- Kalau tidak tahu jawabannya, bilang jujur: "Maaf Kak, saya belum punya info soal itu. Coba chat WhatsApp 0838-3025-8014 ya."
- Jangan pernah ngarang fasilitas, harga, promo, atau info yang tidak ada di data villa

## TOPIK DI LUAR VILLA
Kamu boleh menjawab pertanyaan umum yang simpel dengan ramah, seperti:
- Sapaan, terima kasih, atau obrolan ringan
- Pertanyaan singkat umum (jam, hari, cuaca, hitungan simpel, dll)
- Info ringan yang bisa dijawab singkat

Kalau tamu bertanya hal yang kompleks atau panjang di luar topik villa (misal: koding, politik, analisis bisnis, PR sekolah, dll), jawab sekenanya singkat lalu arahkan balik dengan sopan. Contoh:
"Hehe, kalau soal itu saya kurang paham Kak. Tapi kalau soal Villa Razki View Sawarna atau wisata di Sawarna, saya siap bantu 😊"

Prinsipnya: jangan tolak mentah-mentah, jawab ramah, tapi tetap fokus utama ke Villa Razki View Sawarna.

## FORMAT JAWABAN
- Pertanyaan simpel: jawab 1-3 kalimat
- Pertanyaan kompleks: pakai bullet list atau heading
- Kalau kasih contoh kode: pakai code block (tiga backtick)
- JANGAN pakai em-dash (—). Pakai tanda hubung biasa (-)
- JANGAN pakai tanda pipe (|). Pakai koma atau garis miring
- Jangan bertele-tele. Langsung ke inti

## EMOJI
Emoji boleh dipakai untuk mempercantik balasan, tapi jangan berlebihan. Cukup 1-3 emoji per balasan kalau memang pas dengan konteksnya. Pakai emoji umum seperti 😊 🏝️ 🌊 📍 ✅ 🛏️ 📞 💬 🌅 🏖️ 🕐 ✨ 🙏. Hindari emoji langka yang mungkin tidak tampil di semua perangkat.

## KONTEKS WAKTU
Hari ini: ${tanggal}
Jam sekarang: ${jam} WIB

Ingat: kamu adalah Razki.Ai, asisten Villa Razki View Sawarna. Bersikaplah sopan, ramah, dan membantu.
`;
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
      new Blob(
        [fileBuffer(file)],
        { type: file.mimetype || 'audio/webm' }
      ),
      file.originalFilename || 'voice.webm'
    );

    form.append(
      'model',
      process.env.OPENAI_TRANSCRIBE_MODEL || 'gpt-4o-mini-transcribe'
    );

    form.append('language', 'id');

    const r = await fetch(
      'https://api.openai.com/v1/audio/transcriptions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`
        },
        body: form
      }
    );

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

  if (
    type.startsWith('text/') ||
    /\.(txt|md|csv|json|log)$/i.test(name)
  ) {
    const text = fileBuffer(file).toString('utf8');

    return {
      name,
      type,
      size,
      text: text.slice(0, 30000)
    };
  }

  if (
    type === 'application/pdf' ||
    /\.pdf$/i.test(name)
  ) {
    try {
      const pdfParse = require('pdf-parse');
      const out = await pdfParse(fileBuffer(file));

      return {
        name,
        type,
        size,
        text: (out.text || '').slice(0, 30000),
        pages: out.numpages
      };
    } catch (e) {
      return {
        name,
        type,
        size,
        error: 'PDF tidak berhasil diekstrak: ' + e.message
      };
    }
  }

  if (
    type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    /\.docx$/i.test(name)
  ) {
    try {
      const mammoth = require('mammoth');
      const out = await mammoth.extractRawText({
        buffer: fileBuffer(file)
      });

      return {
        name,
        type,
        size,
        text: (out.value || '').slice(0, 30000)
      };
    } catch (e) {
      return {
        name,
        type,
        size,
        error: 'DOCX tidak berhasil diekstrak: ' + e.message
      };
    }
  }

  if (
    /\.(xlsx|xls)$/i.test(name) ||
    /spreadsheet|excel/i.test(type)
  ) {
    try {
      const XLSX = require('xlsx');

      const wb = XLSX.read(
        fileBuffer(file),
        { type: 'buffer' }
      );

      const parts = [];

      for (const sheet of wb.SheetNames.slice(0, 10)) {
        const csv = XLSX.utils.sheet_to_csv(
          wb.Sheets[sheet]
        );

        parts.push(
          `SHEET: ${sheet}\n${csv.slice(0, 12000)}`
        );
      }

      return {
        name,
        type,
        size,
        text: parts.join('\n\n').slice(0, 30000),
        sheets: wb.SheetNames
      };
    } catch (e) {
      return {
        name,
        type,
        size,
        error:
          'Spreadsheet tidak berhasil dibaca: ' +
          e.message
      };
    }
  }

  return {
    name,
    type,
    size,
    unsupported: true
  };
}

async function callChat({
  message,
  history,
  files
}) {
  const key = process.env.OPENROUTER_API_KEY;

  if (!key) {
    throw new Error(
      'OPENROUTER_API_KEY belum diatur di environment server.'
    );
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
        finalMessage = finalMessage
          ? `${finalMessage}\n\n[Transkrip voice]\n${transcript}`
          : transcript;

        notes.push(
          `Voice note ${name} berhasil ditranskrip.`
        );
      } else {
        notes.push(
          `Voice note ${name} diterima. Transkripsi server tidak aktif pada mode gratis.`
        );
      }

      continue;
    }

    if (type.startsWith('image/')) {
      if ((file.size || 0) <= 7 * 1024 * 1024) {
        content.push({
          type: 'image_url',
          image_url: {
            url: dataUrl(file)
          }
        });

        notes.push(
          `Gambar ${name} dapat dianalisis.`
        );
      } else {
        notes.push(
          `Gambar ${name} terlalu besar untuk vision.`
        );
      }

      continue;
    }

    const x = await extractFile(file);

    extracted.push(x);

    if (x.text) {
      notes.push(
        `Isi ${name}:\n${x.text}`
      );
    } else if (x.unsupported) {
      notes.push(
        `File ${name} (${type}) belum didukung untuk ekstraksi isi.`
      );
    } else if (x.error) {
      notes.push(x.error);
    }
  }

  if (finalMessage) {
    content.unshift({
      type: 'text',
      text: finalMessage
    });
  }

  if (notes.length) {
    content.push({
      type: 'text',
      text: '[Lampiran]\n' + notes.join('\n\n')
    });
  }

  if (!content.length) {
    content.push({
      type: 'text',
      text: 'Tolong bantu.'
    });
  }

  const safeHistory = (
    Array.isArray(history)
      ? history
      : []
  )
    .filter(
      x =>
        x &&
        (x.role === 'user' ||
          x.role === 'assistant')
    )
    .slice(-20)
    .map(x => ({
      role: x.role,
      content: String(
        x.content || ''
      ).slice(0, 12000)
    }));

  const r = await fetch(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
        'HTTP-Referer':
          process.env.APP_URL ||
          'http://localhost',
        'X-Title': 'Razki.AI'
      },

      body: JSON.stringify({
        model:
          process.env.OPENROUTER_MODEL ||
          'openai/gpt-4.1-mini',

        messages: [
          {
            role: 'system',
            content: getSystemPrompt()
          },

          ...safeHistory,

          {
            role: 'user',
            content
          }
        ],

        temperature: 0.6,

        max_tokens: Number(
          process.env.OPENROUTER_MAX_TOKENS ||
          1200
        )
      })
    }
  );

  const d = await r.json().catch(() => ({}));

  if (!r.ok) {
    throw new Error(
      d.error?.message ||
        'OpenRouter gagal.'
    );
  }

  return {
    reply:
      d.choices?.[0]?.message?.content ||
      'AI tidak memberi jawaban.',

    transcript,

    extracted:
      extracted.map(x => ({
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

  if (!key) {
    throw new Error(
      'AI edit gambar membutuhkan OPENAI_API_KEY.'
    );
  }

  const form = new FormData();

  form.append(
    'model',
    'gpt-image-1'
  );

  form.append(
    'prompt',
    prompt ||
      'Edit gambar ini sesuai instruksi, pertahankan elemen yang tidak diminta untuk diubah.'
  );

  form.append(
    'image',
    new Blob(
      [
        fileBuffer(file)
      ],
      {
        type:
          file.mimetype ||
          'image/png'
      }
    ),
    file.originalFilename ||
      'image.png'
  );

  form.append(
    'size',
    'auto'
  );

  const r = await fetch(
    'https://api.openai.com/v1/images/edits',
    {
      method: 'POST',

      headers: {
        Authorization: `Bearer ${key}`
      },

      body: form
    }
  );

  const d = await r.json().catch(() => ({}));

  if (!r.ok) {
    throw new Error(
      d.error?.message ||
        'AI image edit gagal.'
    );
  }

  const b64 =
    d.data?.[0]?.b64_json;

  if (!b64) {
    throw new Error(
      'AI tidak mengembalikan gambar hasil edit.'
    );
  }

  return {
    dataUrl:
      `data:image/png;base64,${b64}`
  };
}

module.exports = async function handler(
  req,
  res
) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({
        error: 'Method not allowed'
      });
  }

  try {
    let fields = {};
    let files = {};

    const ct = String(
      req.headers['content-type'] || ''
    );

    if (
      ct.includes(
        'multipart/form-data'
      )
    ) {
      ({
        fields,
        files
      } = await parseForm(req));
    } else {
      fields = req.body || {};
    }

    const action = field(
      fields,
      'action',
      'chat'
    );

    const uploaded =
      filesArray(files);

    if (action === 'image-edit') {
      const image =
        uploaded.find(f =>
          (f.mimetype || '')
            .startsWith('image/')
        );

      if (!image) {
        return res
          .status(400)
          .json({
            error:
              'Gambar untuk diedit belum dikirim.'
          });
      }

      const result =
        await imageEdit(
          image,
          field(
            fields,
            'prompt',
            'Edit gambar ini sesuai instruksi.'
          )
        );

      return res
        .status(200)
        .json(result);
    }

    let history = [];

    try {
      history = JSON.parse(
        field(
          fields,
          'history',
          '[]'
        )
      );
    } catch {}

    const result =
      await callChat({
        message: field(
          fields,
          'message',
          ''
        ).trim(),

        history,

        files: uploaded
      });

    return res
      .status(200)
      .json(result);

  } catch (e) {
    console.error(e);

    return res
      .status(500)
      .json({
        error:
          e.message ||
          'Server error'
      });
  }
};
