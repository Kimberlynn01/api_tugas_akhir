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

app.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { userId } = req.body;

    if (!id || !userId) {
      res.status(400).send("komentarId / userId invalid");
      return;
    }

    const komentarRef = admin.database().ref("komentar").child(id);

    const snapshot = await komentarRef.once("value");
    const komentarData = snapshot.val();

    await komentarRef.remove();

    res.status(200).json({ message: "Berhasil menghapus komentar" });
  } catch (error) {
    res.status(500).json({ error: "terjadi kesalahan saat ingin menghapus data komentar" });
  }
});



module.exports = app;
