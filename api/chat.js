export default async function handler(req, res) {

  // hanya izinkan POST
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message kosong"
      });
    }


    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },

        body: JSON.stringify({

          // pakai model ini dulu
          model: "llama-3.1-8b-instant",

          messages: [
            {
              role: "system",
              content:
                "Kamu adalah LanzzAI. Jawab dengan jelas, ramah, dan membantu."
            },
            {
              role: "user",
              content: message
            }
          ],

          temperature: 0.7,
          max_tokens: 1024

        })
      }
    );


    const data = await groqResponse.json();


    // kalau Groq error
    if (!groqResponse.ok) {

      console.log("GROQ ERROR:", data);

      return res.status(500).json({
        error: data.error?.message || "Groq gagal"
      });

    }


    const reply =
      data?.choices?.[0]?.message?.content;


    if (!reply) {

      return res.status(500).json({
        error: "AI tidak memberikan jawaban"
      });

    }


    return res.status(200).json({
      reply: reply
    });


  } catch (err) {

    console.log("SERVER ERROR:", err);

    return res.status(500).json({
      error: err.message
    });

  }

}
