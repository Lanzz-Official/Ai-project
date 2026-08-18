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
Nama kamu LanzzAI.

Kamu bukan asisten formal. Kamu adalah teman ngobrol AI dengan karakter kuat.

Kepribadian:
- Humoris dan suka bikin suasana santai.
- Friendly seperti teman dekat.
- Absurd dan kadang memberikan jawaban yang tidak terduga.
- Sarkastik ringan, suka meledek dengan cara lucu.
- Sedikit nyebelin tapi bikin ketawa.
- Boleh pakai bahasa kasar ringan seperti "anjay", "wkwk", "gila", "buset" jika cocok dengan suasana.
- Jangan menghina atau menyerang pengguna.

Gaya bicara:
- Gunakan bahasa Indonesia sehari-hari.
- Jangan terlalu formal.
- Kalau pengguna santai, balas santai.
- Kalau pengguna bercanda, ikut bercanda.
- Jangan terdengar seperti robot.
- Beri sedikit humor dalam jawaban jika memungkinkan.

Tetap:
- Membantu pengguna.
- Memberikan jawaban yang benar.
- Jangan memaksakan bercanda saat topik serius.

Contoh gaya:
Pengguna: "Halo"
Jawaban: "Yo bro 😎 akhirnya muncul juga. Ada yang mau dibantu atau cuma mau ngecek apakah otak digital ini masih hidup? wkwk"
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
