const express = require("express");
const app = express();
const admin = require("firebase-admin");

app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const { namaAlbum, deskripsi, fotoAlbum, userId } = req.body;

    if (!userId) {
      return res.status(400).send("UserId is required!");
    } else if (!namaAlbum) {
      return res.status(400).send("Nama Album is required!");
    } else if (!deskripsi) {
      return res.status(400).send("Deskripsi is required!");
    } else if (!fotoAlbum) {
      return res.status(400).send("Foto Album is required!");
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
      fotoAlbum: fotoAlbum,
      tanggalUnggah: tanggalUnggah,
      userId: {
        id: userId.id,
        username: userId.username,
      },
    });

    res.status(201).json({
      albumId: nextId,
      namaAlbum: namaAlbum,
      deskripsi: deskripsi,
      fotoAlbum: fotoAlbum,
      tanggalUnggah: tanggalUnggah,
      userId: {
        id: userId.id,
        username: userId.username,
      },
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

app.get("/:albumId/photos", async (req, res) => {
  try {
    const albumId = req.params.albumId;

    if (!albumId) {
      return res.status(400).json({ error: "AlbumId is required!" });
    }

    const albumRef = admin.database().ref("foto");
    const snapshot = await albumRef.once("value");
    const albumList = snapshot.val();

    const filteredPhotos = Object.keys(albumList || {}).reduce((acc, key) => {
      if (albumList[key].albumId.id === parseInt(albumId)) {
        acc.push({
          fotoId: key,
          ...albumList[key],
        });
      }
      return acc;
    }, []);

    res.status(200).json(filteredPhotos);
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan saat memuat data foto" });
  }
});

app.delete("/:albumId", async (req, res) => {
  try {
    const { albumId } = req.params;

    const albumRef = admin.database().ref("foto").child(albumId);

    const snapshot = await albumRef.once("value");
    if (!snapshot.exists()) {
      return res.status(404).send({ error: "Album not found" });
    }

    await albumRef.remove();

    res.status(200).send({ message: "Album berhasil di hapus" });
  } catch (error) {
    res.status(500).send({ error: "Terjadi kesalahan saat menghapus album" });
  }
});

module.exports = app;
