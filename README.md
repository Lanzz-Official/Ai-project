# LanzzAi Ultra — HP Ready

Upgrade UI/UX dari LanzzAi HP Ready. Semua icon dibuat sebagai SVG badge lokal, tanpa emoji dan tanpa CDN.

Fitur:
- Premium glass UI dan animated gradient
- Badge icon SVG konsisten
- Responsive mobile/desktop
- Chat history + search
- Local database via localStorage
- Export backup
- Quick prompt cards
- Streaming AI melalui `/api/chat`
- Settings modal
- Compact mode
- Reduced-motion support
- File picker UI dasar
- Toast notifications
- API key tetap di backend

Deploy:
1. Upload semua file ke GitHub.
2. Render -> New Web Service -> pilih repository.
3. Build: `pip install -r requirements.txt`
4. Start: `python server.py`
5. Environment:
   `AI_API_KEY`, `AI_MODEL`, `AI_UPSTREAM`
6. Deploy dan buka URL.

Catatan: file picker saat ini baru UI; pemrosesan/upload file ke model dapat ditambahkan di backend berikutnya.
