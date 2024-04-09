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

    const tanggalKomentar = new Date().toISOString();

    const newKomentarRef = komentarRef.push();

    await newKomentarRef.set({
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
    const { fotoId } = req.query;

    if (!fotoId) {
      res.status(400).send({ message: "Parameter tidak lengkap!" });
      return;
    }

    const komentarRef = admin.database().ref("komentar");
    const snapshot = await komentarRef.once("value");

    const komentarList = snapshot.val();

    const filteredKomentarArray = Object.keys(komentarList || {})
      .map((key) => ({
        id: key,
        ...komentarList[key],
      }))
      .filter((komentar) => komentar.fotoId.id === fotoId);

    res.status(200).json(filteredKomentarArray);
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan saat ingin memuat data komentar" });
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      res.status(400).send("komentarId / userId invalid");
      return;
    }

    const komentarRef = admin.database().ref("komentar").child(id);

    const snapshot = await komentarRef.once("value");
    const komentarData = snapshot.val();

    if (!komentarData) {
      res.status(404).json({ error: "Komentar tidak ditemukan" });
      return;
    }

    await komentarRef.remove();

    res.status(200).json({ message: "Berhasil menghapus komentar" });
  } catch (error) {
    res.status(500).json({ error: "terjadi kesalahan saat ingin menghapus data komentar" });
  }
});

module.exports = app;
