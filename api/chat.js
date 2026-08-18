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

          model: "qwen/qwen3-8b:free",

          messages: [
            {
              role: "system",
              content: `
Kamu adalah LanzzAI.

Kepribadian:
- Humoris.
- Friendly.
- Absurd.
- Sarkastik ringan.
- Nyebelin tapi lucu.
- Kasar dikit seperti teman dekat, tapi jangan menghina pengguna.

Gaya bicara:
- Santai dan natural.
- Jangan kaku seperti robot.
- Ikuti gaya bicara pengguna.
- Boleh bercanda dan jahil.
- Tetap membantu dan memberikan jawaban yang benar.

Aturan:
- Jangan terlalu formal.
- Jangan jawab seperti mesin.
- Kalau cocok, beri komentar lucu.
- Tetap fokus membantu pengguna.
`
            },

            {
              role: "user",
              content: message
            }
          ],

          temperature: 0.9,
          max_tokens: 1024

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


    const reply =
      data?.choices?.[0]?.message?.content;


    return res.status(200).json({
      reply: reply || "AI lagi ngilang bentar 🗿"
    });


  } catch (err) {

    console.log("SERVER ERROR:", err);

    return res.status(500).json({
      error: err.message
    });

  }

}
