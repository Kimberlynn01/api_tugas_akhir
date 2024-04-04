const express = require("express");
const app = express();
const admin = require("firebase-admin");

app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const { fotoId, userId } = req.body;

    if (!fotoId || userId) {
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
  } catch (error) {}
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
    res.status(500).json({ error: "Terjadi kesalahan saat memuat data like foto" });
  }
});
