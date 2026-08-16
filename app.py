import os, requests
from flask import Flask, request, jsonify
app=Flask(__name__)
KEY=os.getenv("AI_API_KEY","")
MODEL=os.getenv("AI_MODEL","gpt-5.6")
UPSTREAM=os.getenv("AI_UPSTREAM","https://api.openai.com/v1/responses")

@app.get("/health")
def health():
    return jsonify(ok=True,configured=bool(KEY),model=MODEL)

@app.post("/api/chat")
def chat():
    if not KEY: return jsonify(error="AI_API_KEY belum diatur di Vercel."),503
    data=request.get_json(silent=True) or {}
    raw=data.get("messages",[])
    msgs=[]
    for x in raw[-20:]:
        if isinstance(x,dict) and x.get("role") in ("user","assistant") and isinstance(x.get("content"),str) and x["content"].strip():
            msgs.append({"role":x["role"],"content":x["content"][:12000]})
    if not msgs: return jsonify(error="Pesan kosong."),400
    try:
        r=requests.post(UPSTREAM,json={"model":MODEL,"input":msgs,"max_output_tokens":1200},
            headers={"Authorization":"Bearer "+KEY,"Content-Type":"application/json"},timeout=55)
    except requests.RequestException as e:
        return jsonify(error="Koneksi AI gagal: "+str(e)),502
    if r.status_code>=400:
        try: msg=r.json().get("error",{}).get("message","Upstream AI error")
        except Exception: msg=r.text[:500] or "Upstream AI error"
        return jsonify(error=msg),r.status_code
    try:
        body=r.json(); reply=body.get("output_text","")
        if not reply:
            reply="".join(c.get("text","") for o in body.get("output",[]) for c in o.get("content",[]) if c.get("type")=="output_text")
        return jsonify(reply=reply or "Model tidak mengembalikan teks.")
    except Exception:
        return jsonify(error="Respons AI tidak dapat dibaca."),502
