# LanzzAi HP Ready — Vercel

Upload these files to the GitHub repo. Vercel supports Flask/Python serverless deployment.

## Deploy
1. Import the GitHub repo into Vercel.
2. Deploy with the default settings; no Render build/start command is needed.
3. Vercel Project Settings → Environment Variables.
4. Add `AI_API_KEY` = your OpenAI API key.
5. Optional: add `AI_MODEL` if you want another model available to your API account.
6. Redeploy.

Never put the API key in HTML or GitHub.

Chat history uses localStorage, so there is no heavy database and the UI stays lightweight on phones.
