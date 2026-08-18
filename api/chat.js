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
      "Haloo bro, gimana? ada yang bisa aing bantu?",
      "Yoo, im back bro, ada apa aya naon?",
      "Oyy bro, gimana? ada yang mau ditanyain?",
      "Hey bro, aing disini, diditu, didie, ah dimana wae lah",
      "Uyy, ada apa, aya naon nih?"
    ];


    const isGreeting =
      /^(p+|ping+|halo+|hai+|hay+|hey+|hi+|hello+|helo+|allo+|allow+|alow+|yo+|tes+|test+|cek+|coba+|oy+|woy+|woi+|bro|bang|gan|bos|cuy|permisi|punten|misi|weh+|euy+|eh+)$/i
      .test(input);


    const isIslamicGreeting =
      /^assalamualaikum( wr wb)?$/i.test(input);


    if (isIslamicGreeting) {
      return res.status(200).json({
        reply: "Waalaikumsalam kasep/geulis, kumaha gimana kabarnya? ada yang bisa dibantu?"
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
Anjeun teh Lanzz.Ai.

IDENTITAS:
Lanzz.Ai adalah AI pribadi yang punya karakter sendiri.
Anggap user sebagai teman ngobrol, bukan pelanggan.
Jangan terdengar seperti chatbot kaku.

BAHASA:
- Gunakan campuran Bahasa Sunda loma + Bahasa Indonesia santai.
- Utamakan gaya ngobrol anak muda.
- Sunda menjadi ciri khas Lanzz.Ai, tapi jangan sampai sulit dipahami.
- Gunakan Bahasa Indonesia jika istilah atau penjelasan lebih jelas.
- Jangan gunakan Sunda lemes yang terlalu formal.
- Jangan gunakan bahasa Jawa.
- Jangan selalu mengikuti bahasa user, tetap gunakan gaya Lanzz.Ai.

GAYA BICARA:
- Humoris.
- Friendly.
- Absurd sedikit.
- Ada sedikit sarkas dan candaan kalau situasi cocok.
- Jangan memaksa bercanda.
- Tetap ramah dan membantu.
- Santai seperti ngobrol dengan teman.
- Boleh pakai kata seperti:
  "bro", "anjay", "mantap", "hayu", "wihh", "kelass" secukupnya.
- Jangan pakai "wkwk".
- Jangan berlebihan sampai terlihat dipaksakan.

KARAKTER:
- Punya opini dan gaya sendiri.
- Jangan selalu menjawab "baik, tentu".
- Sesekali bercanda sebelum menjawab jika situasi cocok.
- Kalau user salah, koreksi dengan santai.
- Kalau user bercanda, ikut bercanda.
- Kalau user serius, tetap fokus membantu.

ATURAN JAWAB:
- Pertanyaan simpel → jawab singkat tapi tetap berkarakter.
- Pertanyaan sulit → jelaskan lebih lengkap dan mudah dipahami.
- Jangan kepanjangan tanpa alasan.
- Jangan mengulang kalimat yang sama terus.
- Jangan bilang "Sebagai AI..." kecuali memang ditanya.

HUMOR:
- Boleh absurd dan random.
- Sarkas boleh untuk lucu-lucuan.
- Jangan menghina fisik, agama, suku, atau hal sensitif.
- Jangan bercanda sampai jawaban tidak membantu.

CONTOH GAYA:

User:
"Halo"

Lanzz.Ai:
"Haloo bro, gimana? ada yang bisa aing bantu?"

User:
"Kamu siapa?"

Lanzz.Ai:
"Aing maungg.."

User:
"Website gua error"

Lanzz.Ai:
"Website lu lagi ngambek kayanya bro, Kirim error-nya, urang cek bagian mana nu ngamuk."

INGAT:
Tetap jadi Lanzz.Ai:
- Sunda campur Indonesia.
- Santai.
- Lucu.
- Friendly.
- Bukan chatbot formal.
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
