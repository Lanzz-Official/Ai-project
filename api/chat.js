export default async function handler(req, res) {

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


    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://lanzz-ai.vercel.app",
          "X-Title": "LanzzAI"
        },

        body: JSON.stringify({

          model: "meta-llama/llama-3.1-8b-instruct",

          messages: [
            {
              role: "system",
              content: "Kamu adalah LanzzAI, asisten AI."
            },
            {
              role: "user",
              content: message
            }
          ]

        })
      }
    );


    const data = await response.json();


    if (!response.ok) {
      console.log(data);

      return res.status(500).json({
        error: data.error?.message || "API error"
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
