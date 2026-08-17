import OpenAI from "openai";

const client = new OpenAI({
 apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req,res){

 const {message}=req.body;

 const result = await client.chat.completions.create({
  model:"gpt-5-mini",
  messages:[
   {
    role:"user",
    content:message
   }
  ]
 });

 res.json({
  reply:result.choices[0].message.content
 });

}
