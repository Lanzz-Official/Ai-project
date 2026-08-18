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
        error: "Message kosong"
      });
    }


    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "GROQ_API_KEY tidak ditemukan"
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
          model: "llama-3.1-70b-versatile",
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


    if (!response.ok) {
      console.log(data);

      return res.status(500).json({
        error: data.error?.message || "Groq API error"
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
