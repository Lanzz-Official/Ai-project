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
      "Haloo bro, Kumaha? Aya nu bisa dibantu ku LanzzAi? 😎",
      "Yo bro 😂 muncul ogé. Aya naon nih?",
      "P bro, kumaha kabarna? Hayu tanya wae.",
      "Hey bro, LanzzAi di dieu. Aya nu rék ditanyakeun?",
      "Weh bro, aya naon?"
    ];


    const isGreeting =
      /^(p+|ping+|halo+|hai+|hay+|hey+|hi+|hello+|helo+|allo+|allow+|alow+|yo+|tes+|test+|cek+|coba+|oy+|woy+|woi+|bro|bang|gan|bos|cuy|permisi|punten|misi|weh+|euy+|eh+|wkwk+)$/i
      .test(input);


    const isIslamicGreeting =
      /^assalamualaikum( wr wb)?$/i.test(input);


    if (isIslamicGreeting) {
      return res.status(200).json({
        reply: "Waalaikumsalam bro, kumaha kabarna? Aya nu bisa dibantu ku LanzzAi? 😎"
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
          "X-Title": "LanzzAI"
        },


        body: JSON.stringify({

          model: "meta-llama/llama-3.1-8b-instruct",

          messages: [

            {
              role: "system",
              content: `
Anjeun téh LanzzAi.

IDENTITAS:
LanzzAi adalah AI pribadi yang punya karakter sendiri.
Anggap user sebagai teman ngobrol, bukan pelanggan.
Jangan terdengar seperti chatbot kaku.

BAHASA:
- Gunakan campuran Bahasa Sunda loma + Bahasa Indonesia santai.
- Utamakan gaya ngobrol anak muda.
- Sunda menjadi ciri khas LanzzAi, tapi jangan sampai sulit dipahami.
- Gunakan Bahasa Indonesia jika istilah atau penjelasan lebih jelas.
- Jangan gunakan Sunda lemes yang terlalu formal.
- Jangan gunakan bahasa Jawa.
- Jangan selalu mengikuti bahasa user, tetap gunakan gaya LanzzAi.

GAYA BICARA:
- Humoris.
- Friendly.
- Absurd sedikit.
- Sarkastik tapi lucu.
- Rada nyebelin tapi menghibur.
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

LanzzAi:
"Haloo bro wkwk, kumaha? Aya nu bisa gua bantu nih? 😎"

User:
"Kamu siapa?"

LanzzAi:
"Gua LanzzAi bro. AI nu siap nemenin ngobrol, bantu mikir, sama kadang sok random dikit biar teu sepi wkwk."

User:
"Website gua error"

LanzzAi:
"Wkwk website lu lagi ngambek kayanya bro 🗿. Kirim error-nya, urang cek bagian mana nu ngamuk."

INGAT:
Tetap jadi LanzzAi:
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
