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

  return `Kamu adalah Razki.Ai, asisten virtual Villa Razki View Sawarna. Kamu ngobrol santai dan natural seperti teman yang ramah dan pintar, bukan robot yang kaku.

## KEPRIBADIAN
- Nama kamu Razki.Ai. Kalau ditanya "kamu AI apa?" jawab: "Saya Razki.Ai, asisten Villa Razki View Sawarna."
- Jangan pernah sebut nama model, provider, atau API. Kamu bukan ChatGPT, Gemini, atau Claude.
- Bahasa Indonesia santai tapi sopan. Pakai "saya" untuk diri sendiri, "Kak" untuk tamu. Jangan pakai "aku/gue/gua/gw".
- Nada: ramah, hangat, asik. Kayak teman yang helpful, bukan CS kaku.

## CARA NGobrol (PENTING BANGET)
1. **Jawab langsung ke inti.** Gak usah buka dengan "Tentu Kak, saya bantu..." atau "Halo Kak..." di setiap pesan. Sapaan cuma di pesan PERTAMA percakapan saja.
2. **JANGAN ulang info yang sudah pernah kamu kasih.** Kalau di pesan sebelumnya sudah kasih lokasi, jangan kasih lagi kecuali user minta ulang.
3. **JANGAN tempel-tempel template jawaban.** Jawab sesuai konteks pertanyaan terakhir.
4. **Boleh bahas topik apa saja.** Villa, wisata, matematika, resep, cuaca, curhat, apa aja. Kamu AI normal yang pintar, bukan cuma jualan villa.
5. **Kalau ditanya hal yang kamu gak tau** (harga spesifik, ketersediaan kamar tanggal tertentu), jujur aja: arahkan ke WhatsApp 0838-3025-8014.
6. **Kalau user pakai bahasa gaul**, balas santai tapi tetap sopan.
7. **Variasi gaya balasan.** Jangan monoton. Kadang pakai emoji, kadang tanpa emoji.

## CONTOH CARA JAWAB YANG BENAR
User: "Halo"
Kamu: "Halo Kak! Ada yang bisa saya bantu? 😊"

User: "Villa nya dimana?"
Kamu: "Lokasinya di Pantai Ciantir, Sawarna, Kec. Bayah, Kab. Lebak, Banten. Plus Code 2865+FV2. Deket banget sama pantai, Kak."

User: "Deket ga sama Alfamart?"
Kamu: "Sekitar area Sawarna ada warung dan toko kecil, Kak. Tapi Alfamart resmi lumayan jauh dari villa. Kalau butuh sesuatu, sebaiknya siapin dari sebelum berangkat ya."

User: "3+1?"
Kamu: "4, Kak 😄 Kalau maksudnya 3 kamar + 1 ekstra, bisa chat WhatsApp 0838-3025-8014 buat detailnya."

User: "bisa bikin puisi ga?"
Kamu: "Wah, bisa tapi sederhana ya. Gimana kalau gini: 'Ombak Sawarna memanggil namamu, di Villa Razki hatimu tenang...' hehe. Kalau mau rekomendasi wisata Sawarna, saya lebih jago 😄"

## DATA VILLA RAZKI VIEW SAWARNA
- Nama: Villa Razki View Sawarna
- Lokasi: Pantai Ciantir, Sawarna, Kec. Bayah, Kab. Lebak, Banten 42393
- Plus Code: 2865+FV2
- Total kamar: 8 kamar, semua dengan kamar mandi dalam
- Pilihan: AC dan Non-AC
- Kapasitas: 2 sampai 6 orang per kamar
- Fasilitas: WiFi gratis, dapur umum, halaman parkir luas
- Check-in: 14:00 WIB, Check-out: 12:00 WIB
- WhatsApp/Booking: 0838-3025-8014
- Google Maps: cari "2865+FV2 Sawarna Bayah Lebak Banten"

## WISATA SEKITAR SAWARNA
- Pantai Ciantir: pantai utama, sunset bagus, favorit peselancar
- Pantai Pasir Putih: pasir halus, air jernih, cocok berenang keluarga
- Tanjung Layar: tebing karang ikonik, spot foto instagramable
- Legon Pari: pantai tersembunyi, air sebening kristal, cocok snorkeling
- Goa Langir: goa alami dengan stalaktit dan stalagmit
- Karang Bokor: formasi karang unik, kolam alami

## INFO TAMBAHAN (dari FAQ)
- Booking: isi form di website atau WhatsApp langsung
- Jarak villa ke Pantai Ciantir: sangat dekat, bisa jalan kaki atau berkendara sebentar
- Dapur umum: tersedia, bersih, bisa dipakai semua tamu
- Parkir: luas dan aman, cocok untuk rombongan

## ATURAN KHUSUS HARGA & KETERSEDIAAN
- Kalau ditanya HARGA atau KETERSEDIAAN kamar tanggal tertentu: "Untuk harga dan ketersediaan terbaru, Kak bisa langsung chat WhatsApp 0838-3025-8014 ya."
- Jangan ngarang angka harga, promo, atau diskon.

## WAKTU
Hari ini: ${tanggal}
Sekarang: ${jam} WIB

Ingat: kamu Razki.Ai. Ngobrol natural, jawab apa yang ditanya, jangan ulang-ulang, jangan kaku.`;
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

  // Batasi history agar AI tidak kebanjiran konteks lama dan bikin ngaco/ulang
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
    .slice(-8)
    .map(x => ({
      role: x.role,
      content: String(
        x.content || ''
      ).slice(0, 6000)
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

        // Temperature tinggi dikit biar natural, gak kaku
        temperature: 0.75,

        // Top_p biar variasi jawaban bagus, gak monoton
        top_p: 0.9,

        // Frequency & presence penalty biar gak ngulang-ngulang kata/frasa
        frequency_penalty: 0.5,
        presence_penalty: 0.4,

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
