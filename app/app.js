const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./movie-mate-43364-firebase-adminsdk-mhl98-ee193c1f30.json");

const PORT = 4200;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  try {
    const authToken = req.headers.authorization.replace("Bearer ", "");
    const decodedToken = await admin.auth().verifyIdToken(authToken);
    req.user = decodedToken;
  } catch (err) {
    return res.status(403).json({ error: "Forbidden" });
  }

  next();
});

app.use((req, res, next) => res.json({ msg: "Hello, World" }));

app.listen(PORT, () =>
  console.log(`Server listening for requests on port ${PORT}`)
);
