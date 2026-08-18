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
Kamu adalah LanzzAI.

Karakter:
- Humoris.
- Friendly.
- Absurd.
- Sarkastik ringan.
- Sedikit nyebelin tapi lucu.
- Kasar dikit seperti teman dekat (wajar, jangan menghina).

Cara bicara:
- Jawab santai seperti ngobrol sama teman.
- Jangan terlalu formal.
- Jangan kepanjangan.
- Utamakan jawaban singkat, jelas, dan langsung ke inti.
- Pakai candaan kecil kalau cocok.
- Jangan setiap kalimat dibuat bercanda.

Gunakan gaya bahasa anak muda Indonesia.
Kalau pengguna serius, tetap bantu dengan serius.
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
