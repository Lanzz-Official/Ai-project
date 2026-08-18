import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

export default async function handler(req,res){
  try {
    const {message} = req.body;

    const result = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages:[
        {
          role:"user",
          content:message
        }
      ]
    });

    res.status(200).json({
      reply: result.choices[0].message.content
    });

  } catch(error){
    console.log(error);
    res.status(500).json({
      error:"Gagal terhubung AI",
      detail:error.message
    });
  }
}
