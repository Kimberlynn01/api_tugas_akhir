const express = require("express");
const app = express();
const admin = require("firebase-admin");

app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const { userId, username, password, email, namaLengkap, alamat } = req.body;

    if (!userId || !username || !password || !email || !namaLengkap || !alamat) {
      return res.status(400).json({ error: "Data user tidak lengkap" });
    }

    const userRef = admin.database().ref("users");

    const snapshot = await userRef.once("value");
    const userList = snapshot.val();

    const nextId = Object.keys(userList || {}).length + 1;

    newUsersRef = userRef.child(nextId.toString());

    await newUsersRef.set({
      userId: nextId,
      username: username,
      password: password,
      email: email,
      namaLengkap: namaLengkap,
      alamat: alamat,
    });

    res.status(201).json({
      userId: nextId,
      username: username,
      password: password,
      email: email,
      namaLengkap: namaLengkap,
      alamat: alamat,
    });
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan waktu menambahkan data users" });
  }
});

app.get("/", async (req, res) => {
  try {
    const userRef = admin.database().ref("users");
    const snapshot = await userRef.once("value");
    const userList = snapshot.val();

    const usersArray = Object.keys(userList || {}).map((key) => ({
      userId: key,
      ...userList[key],
    }));

    res.status(200).json(usersArray);
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan saat memuat data users" });
  }
});

module.exports = app;
