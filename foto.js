const express = require("express");
const app = express();
const admin = require("firebase-admin");

app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const { judulFoto, deskripsiFoto, lokasiFile, albumId, userId } = req.body;

    if (!judulFoto || !deskripsiFoto || !lokasiFile || !albumId || !userId) {
      console.log(req.body);
      return res.status(400).send({ error: "data foto tidak lengkap" });
    }

    const fotoRef = admin.database().ref("foto");

    const snapshot = await fotoRef.once("value");
    const fotoList = snapshot.val();

    const nextId = Object.keys(fotoList || {}).length + 1;

    const tanggalUnggah = new Date().toISOString();

    newFotoRef = fotoRef.child(nextId.toString());

    await newFotoRef.set({
      fotoId: nextId,
      judulFoto: judulFoto,
      deskripsiFoto: deskripsiFoto,
      tanggalUnggah: tanggalUnggah,
      lokasiFile: lokasiFile,
      isLiked: 0,
      albumId: {
        id: albumId.id,
        namaAlbum: albumId.namaAlbum,
      },
      userId: {
        id: userId.id,
        username: userId.username,
      },
    });

    res.status(201).json({
      fotoId: nextId,
      judulFoto: judulFoto,
      deskripsiFoto: deskripsiFoto,
      tanggalUnggah: tanggalUnggah,
      lokasiFile: lokasiFile,
      albumId: {
        id: albumId.id,
        namaAlbum: albumId.namaAlbum,
      },
      isLiked: false,
      userId: {
        id: userId.id,
        username: userId.username,
      },
    });
  } catch (error) {
    res.status(500).send({ error: "Terjadi kesalahan saat menambahkan data" });
  }
});

app.get("/", async (req, res) => {
  try {
    const fotoRef = admin.database().ref("foto");
    const snapshot = await fotoRef.once("value");

    const fotoList = snapshot.val();

    const fotoArray = Object.keys(fotoList || {}).map((key) => ({
      fotoId: key,
      ...fotoList[key],
    }));

    res.status(200).json(fotoArray);
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan saat memuat data foto" });
  }
});

app.delete("/:fotoId", async (req, res) => {
  try {
    const { fotoId } = req.params;

    const fotoRef = admin.database().ref("foto").child(fotoId);

    const snapshot = await fotoRef.once("value");
    if (!snapshot.exists()) {
      return res.status(404).send({ error: "Foto not found" });
    }

    await fotoRef.remove();

    res.status(200).send({ message: "Foto berhasil di hapus" });
  } catch (error) {
    res.status(500).send({ error: "Terjadi kesalahan saat menghapus foto" });
  }
});

module.exports = app;
