const express = require("express");
const app = express();
const admin = require("firebase-admin");
const route = require("./router");

app.use(express.json());

const serviceAccount = require("./tugas-akhir-sekolah-firebase-adminsdk-pukna-d74a7608ef.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tugas-akhir-sekolah-default-rtdb.asia-southeast1.firebasedatabase.app/",
});

const Middleware = (req, res, next) => {
  const { auth } = req.query;

  if (auth === "123") {
    next();
  } else {
    res.status(403).json({ error: "Access Denied" });
  }
};

app.use("/api/v1", Middleware);
app.use("/api/v1", route);

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found 404" });
});

module.exports = app;
