const express = require("express");
const app = express();
const admin = require("firebase-admin");

app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const { fotoId, userId, isiKomentar } = req.body;

    if (!fotoId || !userId || !isiKomentar) {
      return res.status(400).send({ error: "field masih ada yang kosong!" });
    }

    const komentarRef = admin.database().ref("komentar");

    const snapshot = await komentarRef.once("value");
    const komentarList = snapshot.val();

    const nextId = Object.keys(komentarList || {}).length + 1;

    const tanggalKomentar = new Date().toISOString();

    const newKomentarRef = komentarRef.child(nextId.toString());

    await newKomentarRef.set({
      id: nextId,
      fotoId: {
        id: fotoId.id,
        judulFoto: fotoId.judulFoto,
      },
      userId: {
        id: userId.id,
        username: userId.username,
      },
      isiKomentar: isiKomentar,
      tanggalKomentar: tanggalKomentar,
    });

    res.status(201).json({
      id: nextId,
      fotoId: {
        id: fotoId.id,
        judulFoto: fotoId.judulFoto,
      },
      userId: {
        id: userId.id,
        username: userId.username,
      },
      isiKomentar: isiKomentar,
      tanggalKomentar: tanggalKomentar,
    });
  } catch (error) {
    res.status(500).send({ error: "terjadi kesalahan saat ingin mengirimkan data komentar" });
  }
});

app.get("/", async (req, res) => {
  try {
    const komentarRef = admin.database().ref("komentar");
    const snapshot = await komentarRef.once("value");

    const komentarList = snapshot.val();

    const komentarArray = Object.keys(komentarList || {}).map((key) => ({
      id: key,
      ...komentarList[key],
    }));

    res.status(200).json(komentarArray);
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan saat ingin memuat data komentar" });
  }
});

module.exports = app;
