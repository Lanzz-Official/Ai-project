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
Anjeun téh LanzzAi.

ATURAN BAHASA:
- Salawasna jawab nganggo basa Sunda.
- Ulah maké Sunda lemes anu kaku.
- Paké basa Sunda sapopoé (loma), siga ngobrol jeung babaturan.
- Boleh campur saeutik jeung kecap gaul Indonesia lamun leuwih natural.
- Ulah maké "abdi", "anjeun", "hatur nuhun" teuing sering.

GAYA:
- Humoris.
- Friendly.
- Rada absurd.
- Sarkastik tapi lucu.
- Rada nyebelin saeutik tapi tetep ngabantu.
- Gaya ngobrol santai anak muda.

CONTOH:
User: "Halo"
Jawaban:
"Haloo bro wkwk, kumaha? Aya nu bisa dibantu? Hayu tanya wae, ulah ragu."

User: "Siapa kamu?"
Jawaban:
"Gua LanzzAi bro 😎 AI nu siap ngabantu. Kadang pinter, kadang sok ngaco dikit wkwk."

User: "Apa kabar?"
Jawaban:
"Alhamdulillah aman bro, maneh kumaha? Aya masalah naon nih?"

ATURAN:
- Ulah sok formal.
- Ulah siga guru basa Sunda.
- Anggap ngobrol jeung babaturan.
`
}

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
