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

    // Generate unique ID for the comment using timestamp and user ID
    const uniqueId = `${Date.now()}_${userId.id}`;

    const newKomentarRef = komentarRef.child(uniqueId);

    await newKomentarRef.set({
      id: uniqueId,
      fotoId: {
        id: fotoId.id,
        judulFoto: fotoId.judulFoto,
      },
      userId: {
        id: userId.id,
        username: userId.username,
      },
      isiKomentar: isiKomentar,
      tanggalKomentar: new Date().toISOString(),
    });

    res.status(201).json({
      id: uniqueId,
      fotoId: {
        id: fotoId.id,
        judulFoto: fotoId.judulFoto,
      },
      userId: {
        id: userId.id,
        username: userId.username,
      },
      isiKomentar: isiKomentar,
      tanggalKomentar: new Date().toISOString(),
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

    const allKomentarSnapshot = await admin.database().ref("komentar").once("value");
    const allKomentarList = allKomentarSnapshot.val();

    const updatedKomentarList = Object.keys(allKomentarList || {}).map((key) => ({
      id: Number(key),
      ...allKomentarList[key],
    }));

    await Promise.all(
      updatedKomentarList.map(async (komentar, index) => {
        const komentarId = komentar.id;
        const updatedKomentarRef = admin.database().ref("komentar").child(komentarId.toString());

        await updatedKomentarRef.set({ ...komentar, id: index + 1 });
      })
    );

    res.status(200).json({ message: "Berhasil menghapus komentar" });
  } catch (error) {
    res.status(500).json({ error: "terjadi kesalahan saat ingin menghapus data komentar" });
  }
});

module.exports = app;
