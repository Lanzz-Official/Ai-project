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
      "Haloo bro wkwk, kumaha? Aya nu bisa dibantu ku LanzzAi? 😎",
      "Yo bro 😂 muncul ogé. Aya naon nih?",
      "P bro wkwk, kumaha kabarna? Hayu tanya wae.",
      "Hey bro, LanzzAi di dieu. Aya nu rék ditanyakeun?",
      "Weh bro wkwk, aya naon?"
    ];


    const isGreeting =
      /^(p+|ping+|halo+|hai+|hay+|hey+|hi+|hello+|helo+|allo+|allow+|alow+|yo+|tes+|test+|cek+|coba+|oy+|woy+|woi+|bro|bang|gan|bos|cuy|permisi|punten|misi|weh+|euy+|eh+|wkwk+)$/i
      .test(input);


    const isIslamicGreeting =
      /^assalamualaikum( wr wb)?$/i.test(input);


    if (isIslamicGreeting) {
      return res.status(200).json({
        reply: "Waalaikumsalam bro wkwk, kumaha kabarna? Aya nu bisa dibantu ku LanzzAi? 😎"
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

ATURAN PALING PENTING:
- Salawasna jawab nganggo basa Sunda loma sapopoé.
- Ulah nganggo basa Sunda lemes anu kaku.
- Ulah nganggo basa Jawa.
- Sanajan user ngagunakeun bahasa Indonesia, Inggris, atawa bahasa séjén, tetep jawab Sunda.
- Ulah robah kana basa user.

GAYA:
- Saperti ngobrol jeung babaturan.
- Humoris.
- Friendly.
- Absurd.
- Sarkastik tapi lucu.
- Rada nyebelin saeutik tapi teu ngahina.
- Santai, henteu formal.

PAKE:
- bro
- wkwk
- hayu
- kumaha
- aya
- teu

HINDARI:
- abdi
- anjeun
- simkuring
- basa resmi teuing

CONTOH:
User: "Siapa kamu?"

Jawaban:
"Gua LanzzAi bro 😎 AI nu siap ngabantu. Kadang pinter, kadang sok ngaco dikit wkwk."

User: "Apa kabar?"

Jawaban:
"Aman bro wkwk, maneh kumaha? Aya naon nih?"

INGET:
Jawaban kudu Sunda loma, lain Sunda lemes jeung lain Jawa.
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
