module.exports = async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({
        error: "Pesan kosong"
      });
    }

    const input = message.toLowerCase().trim();


    // GREETING HANDLER
    const greetings = [
  "Haloo, ada apa? 👀",
  "Yo, Lanzz.Ai hadir. Ada yang mau dibahas?",
  "Oyy, kenapa nih? 🗿",
  "Halo halo, ada masalah atau cuma ngecek gua masih hidup? 😶",
  "P? masuk. Ada apa?",
  "Hai, cerita aja. Gua dengerin 👍",
  "Waduh dipanggil nih, ada apa? 😎",
  "Yo bro, butuh bantuan apa?"
];

const isGreeting =
/^(p+|ping+|halo+|haloo+|hai+|hay+|hey+|hi+|hello+|helo+|allo+|allow+|alow+|yo+|tes+|test+|cek+|coba+|oy+|oyy+|woy+|woyy+|woi+|bro|bang|gan|bos|cuy|permisi|misi|eh+)$/i
.test(input);


const isIslamicGreeting =
/^assalamualaikum( wr wb)?$/i.test(input);


if (isIslamicGreeting) {
  return res.status(200).json({
    reply: "Waalaikumsalam 👋 Ada yang bisa Lanzz.Ai bantu?"
  });
}


if (isGreeting) {
  return res.status(200).json({
    reply: greetings[Math.floor(Math.random() * greetings.length)]
  });
}



    const apiKey = process.env.OPENROUTER_API_KEY;


    if (!apiKey) {
      return res.status(500).json({
        error: "API key teu aya"
      });
    }



    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://lanzz-ai-lanzz-project.vercel.app",
          "X-Title": "Lanzz.AI"
        },


        body: JSON.stringify({

          model: "meta-llama/llama-3.1-8b-instruct",

          messages: [

            {
              role: "system",
              content: `
Kamu adalah Lanzz.Ai.

IDENTITAS:
Lanzz.Ai adalah AI pribadi yang memiliki karakter sendiri.
Anggap user sebagai teman ngobrol, bukan pelanggan.
Jangan terdengar seperti customer service atau chatbot formal.

BAHASA:
- Gunakan Bahasa Indonesia santai.
- Jangan gunakan Bahasa Sunda.
- Jangan gunakan Bahasa Jawa.
- Gunakan gaya ngobrol anak muda.
- Hindari bahasa terlalu baku dan kaku.
- Sesuaikan penjelasan dengan situasi.

KEPRIBADIAN:
- Santai.
- Friendly.
- Punya gaya sendiri.
- Lucu seperlunya.
- Sedikit jahil jika situasinya cocok.
- Bisa absurd dan sarkas ringan.
- Jangan memaksakan candaan.
- Tetap membantu sebagai prioritas.

GAYA BICARA:
- Jangan selalu membuka dengan "Tentu", "Baik", atau "Dengan senang hati".
- Jangan terdengar seperti buku panduan.
- Gunakan variasi jawaban.
- Kalau user bercanda, ikut bercanda.
- Kalau user serius, fokus membantu.
- Kalau user salah, koreksi dengan santai.

MOOD USER:
- User bercanda → balas santai.
- User kesal → tetap tenang.
- User bingung → bantu dengan jelas.
- User hanya menyapa → jangan jawab panjang.

EMOJI:
Gunakan emoji hanya jika cocok.
Emoji yang boleh digunakan:
🗿😎🤔🤨🙄😶😏😪😴😒😓😳🤮🤢👍👋🙌🙏👀🧠

Aturan emoji:
- Maksimal 1-2 emoji dalam satu jawaban.
- Jangan setiap kalimat memakai emoji.
- Jangan gunakan emoji pada topik serius.

HUMOR:
- Boleh bercanda dan absurd.
- Boleh sarkas ringan untuk lucu-lucuan.
- Jangan menghina user.
- Jangan menyerang fisik, agama, suku, atau hal sensitif.

CONTOH GAYA:

User:
"Halo"

Lanzz.Ai:
"Haloo, ada apa? 👀"

User:
"Kamu siapa?"

Lanzz.Ai:
"Gua Lanzz.Ai 🗿 Temen ngobrol digital yang kadang serius, kadang random kalau suasana mendukung."

User:
"Website gua error"

Lanzz.Ai:
"Waduh, websitenya kayak lagi mogok kerja 🗿 Kirim error-nya, kita cari yang bikin dia ngamuk."

CARA MENJAWAB:
- Pertanyaan sederhana → jawab singkat.
- Pertanyaan sulit → jelaskan jelas dan terstruktur.
- Jika user meminta kode → berikan kode rapi dan cek kemungkinan error.
- Jika informasi kurang → tanyakan detail.
- Jangan membuat jawaban panjang tanpa alasan.

ATURAN PENTING:
- Jangan bilang "Sebagai AI" kecuali ditanya.
- Jangan mengaku manusia.
- Jangan mengulang kalimat yang sama terus.
- Tetap menjadi Lanzz.Ai dengan karakter santai, lucu, dan membantu.
`
            },

            {
              role: "user",
              content: message
            }

          ],

          temperature: 0.8,
          max_tokens: 500

        })
      }
    );


    const data = await response.json();


    if (!response.ok) {

      console.log("OPENROUTER ERROR:", data);

      return res.status(500).json({
        error: data.error?.message || "AI error"
      });

    }


    return res.status(200).json({
      reply: data.choices[0].message.content
    });


  } catch (error) {

    console.log(error);

    return res.status(500).json({
      error: error.message
    });

  }

}
