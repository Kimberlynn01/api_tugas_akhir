const express = require("express");
const app = express();
const admin = require("firebase-admin");

app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const { judulFoto, deskripsiFoto, lokasiFile, albumId, userId } = req.body;

    if (!judulFoto || !deskripsiFoto || !lokasiFile || albumId || userId) {
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
      albumId: albumId,
      userId: userId,
    });

    res.status(201).json({
      fotoId: nextId,
      judulFoto: judulFoto,
      deskripsiFoto: deskripsiFoto,
      tanggalUnggah: tanggalUnggah,
      lokasiFile: lokasiFile,
      albumId: albumId,
      userId: userId,
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
      albumId: key,
      ...fotoList[key],
    }));

    res.status(200).json(fotoArray);
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan saat memuat data foto" });
  }
});

module.exports = app;
