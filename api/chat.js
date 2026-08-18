import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Pesan kosong"
      });
    }

    const result = await client.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        {
          role: "user",
          content: message
        }
      ]
    });

    res.status(200).json({
      reply: result.choices[0].message.content
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Gagal terhubung ke AI",
      detail: error.message
    });
  }
}
