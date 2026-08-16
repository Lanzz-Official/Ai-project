import os, requests
from flask import Flask, request, Response, jsonify, send_from_directory
app=Flask(__name__,static_folder=".",static_url_path="")
UPSTREAM=os.getenv("AI_UPSTREAM","https://api.openai.com/v1/chat/completions")
API_KEY=os.getenv("AI_API_KEY","")
MODEL=os.getenv("AI_MODEL","gpt-4o-mini")
@app.get("/")
def index(): return send_from_directory(".", "index.html")
@app.get("/health")
def health(): return jsonify(ok=True,configured=bool(API_KEY))
@app.post("/api/chat")
def chat():
    if not API_KEY:return jsonify(error="AI_API_KEY belum diset."),500
    d=request.get_json(force=True)
    payload={"model":MODEL,"messages":[{"role":"system","content":"Kamu adalah LanzzAi, asisten AI yang membantu, akurat, ramah, dan menjawab sesuai bahasa pengguna."},*d.get("messages",[])],"stream":True}
    try:
        r=requests.post(UPSTREAM,json=payload,headers={"Authorization":f"Bearer {API_KEY}","Content-Type":"application/json"},stream=True,timeout=120)
        if r.status_code>=400:return Response(r.content,status=r.status_code,content_type=r.headers.get("content-type","application/json"))
        return Response(r.iter_content(chunk_size=1024),content_type="text/event-stream")
    except requests.RequestException as e:return jsonify(error=str(e)),502
if __name__=="__main__":app.run(host="0.0.0.0",port=int(os.getenv("PORT","8080")))
