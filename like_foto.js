const express = require("express");
const app = express();
const admin = require("firebase-admin");

app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const { fotoId, userId } = req.body;

    if (!fotoId || !userId) {
      res.status(400).send("fotoId / userId invalid");
    }

    const likedRef = admin.database().ref("liked_foto");

    const snapshot = await likedRef.once("value");

    const likedList = snapshot.val();

    const nextId = Object.keys(likedList || {}).length + 1;

    const tanggalLike = new Date().toISOString();

    newLikedRef = likedRef.child(nextId.toString);

    await newLikedRef.set({
      id: nextId,
      fotoId: fotoId,
      userId: userId,
      tanggalLike: tanggalLike,
    });

    res.status(201).json({
      id: nextId,
      fotoId: fotoId,
      userId: userId,
      tanggalLike: tanggalLike,
    });
  } catch (error) {
    res.status(500).json({ error: "terjadi kesalahan saat mengirim like ke api" });
  }
});

app.get("/", async (req, res) => {
  try {
    const likedRef = admin.database().ref("liked_foto");
    const snapshot = await likedRef.once("value");

    const likedList = snapshot.val();

    const likedArray = Object.keys(likedList || {}).map((key) => ({
      fotoId: key,
      ...likedList[key],
    }));

    res.status(200).json(likedArray);
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan saat memuat data Likedfoto" });
  }
});

app.delete("/:fotoId", async (req, res) => {
  try {
    const fotoId = req.params.fotoId;
    const { userId } = req.body;

    if (!fotoId || !userId) {
      res.status(400).send("fotoId / invalid");
      return;
    }

    const likedRef = admin.database().ref("liked_foto").child(fotoId);

    const snapshot = await likedRef.once("value");
    const likedData = snapshot.val();

    if (!likedData || likedData.userId !== userId) {
      res.status(404).send("Like tidak ditemukan atau bukan milik pengguna");
      return;
    }

    await likedRef.remove();

    res.status(200).json({ message: "Unlike Berhasil" });
  } catch (error) {
    res.status(500).json({ error: "terjadi kesalahan saat menghapus like foto" });
  }
});

module.exports = app;
