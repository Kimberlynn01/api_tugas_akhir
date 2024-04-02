const express = require("express");
const app = express();
const admin = require("firebase-admin");

app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const { namaAlbum, deskripsi, userId } = req.body;

    if (!userId) {
      return res.status(400).send("UserId is required!");
    } else if (!namaAlbum) {
      return res.status(400).send("Nama Album is required!");
    } else if (!deskripsi) {
      return res.status(400).send("Deskripsi is required!");
    }

    const albumRef = admin.database().ref("album");

    const snapshot = await albumRef.once("value");
    const albumList = snapshot.val();

    const nextId = Object.keys(albumList || {}).length + 1;

    const tanggalUnggah = new Date().toISOString();

    newAlbumRef = albumRef.child(nextId.toString());

    await newAlbumRef.set({
      albumId: nextId,
      namaAlbum: namaAlbum,
      deskripsi: deskripsi,
      tanggalUnggah: tanggalUnggah,
      userId: userId,
    });

    res.status(201).json({
      albumId: nextId,
      namaAlbum: namaAlbum,
      deskripsi: deskripsi,
      tanggalUnggah: tanggalUnggah,
      userId: userId,
    });
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan waktu menambahkan data users" });
  }
});

app.get("/", async (req, res) => {
  try {
    const albumRef = admin.database().ref("album");
    const snapshot = await albumRef.once("value");
    const albumList = snapshot.val();

    const albumArray = Object.keys(albumList || {}).map((key) => ({
      albumId: key,
      ...albumList[key],
    }));

    res.status(200).json(albumArray);
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan saat memuat data album" });
  }
});

module.exports = app;
