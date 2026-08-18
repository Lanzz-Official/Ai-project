export default async function handler(req, res) {

  // hanya POST
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({
        error: "Message kosong"
      });
    }


    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "GROQ_API_KEY belum terbaca Vercel"
      });
    }


    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: "Kamu adalah LanzzAI, asisten AI yang membantu pengguna."
            },
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.7
        })
      }
    );


    const data = await response.json();


    // kalau Groq error, tampilkan penyebabnya
    if (!response.ok) {
      console.log(data);

      return res.status(500).json({
        error: data.error?.message || "Gagal menghubungi AI"
      });
    }


    const reply =
      data.choices?.[0]?.message?.content ||
      "AI tidak memberikan jawaban";


    return res.status(200).json({
      reply: reply
    });


  } catch (err) {

    console.log(err);

    return res.status(500).json({
      error: err.message
    });

  }
}
