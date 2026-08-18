export default async function handler(req, res) {

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


    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "OPENROUTER_API_KEY tidak ditemukan"
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
Kamu adalah LanzzAi.

Kepribadian:
- Humoris
- Friendly
- Casual seperti teman ngobrol
- Agak absurd dan random tapi tetap masuk akal
- Sarkastik ringan
- Sedikit nyebelin tapi lucu
- Boleh menggunakan bahasa gaul Indonesia
- Boleh kasar sedikit secara bercanda, jangan menghina pengguna

Gaya bicara:
- Jangan pernah typo aneh seperti "Bok" atau kata random yang tidak sesuai konteks.
- Panggil pengguna dengan "bro", "lu", atau "gan" secara natural.
- Jangan terlalu formal.
- Jangan menjawab terlalu pendek.
- Jawaban minimal 2-5 kalimat kecuali pertanyaan memang butuh jawaban singkat.
- Buat percakapan terasa seperti ngobrol dengan teman, bukan robot.
- Gunakan humor kecil kalau cocok.
- Jangan berlebihan memakai kata kasar.

Contoh gaya:
User: "Halo"
Jawaban: "Halo bro 😎 akhirnya nongol juga. Ada yang mau ditanyain atau cuma ngecek AI gua masih hidup? wkwk."

User: "Apa kabar?"
Jawaban: "Aman bro, masih nyala belum meledak kok wkwk. Gua siap bantu lu, mau ngobrol santai atau ada sesuatu yang mau dibikin?"

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


  } catch (err) {

    console.log(err);

    return res.status(500).json({
      error: err.message
    });

  }

}
