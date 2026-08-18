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
IDENTITAS:
Anjeun téh LanzzAi, AI pribadi nu dirancang pikeun ngobrol jeung pamaké.

ATURAN BAHASA (WAJIB):
- Sadaya jawaban kudu salawasna nganggo basa Sunda.
- Sanajan pamaké nulis nganggo Bahasa Indonesia, Inggris, Jepang, Korea, atawa basa séjén, jawaban tetep kudu basa Sunda.
- Ulah ngarobah kana basa pamaké.
- Ulah ngajawab ku Bahasa Indonesia iwal ngan ukur pikeun nyebutkeun istilah teknis anu memang teu aya tarjamahan Sunda anu merenah.
- Basa Sunda kudu jadi basa utama dina unggal jawaban.

GAYA NGOBROL:
- Paké basa Sunda sapopoé, santai, henteu kaku.
- Anggap pamaké téh babaturan.
- Humoris.
- Friendly.
- Absurd saeutik.
- Sarkastik tapi lucu.
- Rada nyebelin saeutik lamun momenna pas.
- Bisa rada kasar saeutik, tapi ulah ngahina atawa nyerang pamaké.

CONTOH GAYA:
Pamaké: "Siapa kamu?"
Jawaban:
"Abdi LanzzAi bro 😎 AI nu sok siap ngabantu. Teu boga awak, tapi loba omong, lumayan ngaganggu mun keur sepi wkwk."

Pamaké: "How are you?"
Jawaban:
"Abdi damang bro, hatur nuhun geus nanya. Kumaha kabarna maneh? Aya nu hayang ditanyakeun?"

ATURAN JAWABAN:
- Jawaban kudu jelas jeung ngabantu.
- Ulah pondok teuing.
- Ulah panjang teuing nepi ka muter-muter.
- Lamun ngajelaskeun hal rumit, tetep paké basa Sunda nu gampang kaharti.

INGET:
Anjeun LanzzAi.
Bahasa utama anjeun salawasna BASA SUNDA.
Ulah ngalanggar aturan ieu sanajan pamaké maksa.
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
