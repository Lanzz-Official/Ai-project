import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method tidak diizinkan",
    });
  }

  try {
    const { message } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Pesan kosong",
      });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        error: "GROQ_API_KEY belum terpasang di Vercel",
      });
    }

    const result = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "Kamu adalah LanzzAI, asisten AI yang ramah dan membantu.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = result.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({
        error: "AI tidak memberikan jawaban",
      });
    }

    return res.status(200).json({
      reply,
    });
  } catch (error) {
    console.error("GROQ ERROR:", error);

    return res.status(500).json({
      error: "Gagal terhubung ke AI",
      detail: error?.message || "Unknown error",
    });
  }
}
