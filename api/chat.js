import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method tidak diizinkan"
    });
  }

  try {

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Pesan kosong"
      });
    }

    const result = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "Kamu adalah LanzzAI, asisten AI yang membantu."
        },
        {
          role: "user",
          content: message
        }
      ]
    });


    return res.status(200).json({
      reply: result.choices[0].message.content
    });


  } catch(error){

    console.log(error);

    return res.status(500).json({
      error: "Gagal AI",
      detail: error.message
    });

  }
}
