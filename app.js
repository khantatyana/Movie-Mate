require("dotenv").config();

const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const mongooseConnection = require("./config/mongoConnection");
const configRoutes = require("./routes");
const usersData = require("./data/users");

const PORT = process.env.PORT || 4200;

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
  }),
});

const app = express();

const dbConnection = mongooseConnection();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
// app.use(express.static("client/build"));
// app.use(express.static("client/public"));
app.use(async (req, res, next) => {
  try {
    const authToken = req.headers.authorization.replace("Bearer ", "");
    const firebaseUser = await admin.auth().verifyIdToken(authToken);
    // Make sure we have local user for the firebase authenticated user
    req.user = await usersData.getOrCreate(
      firebaseUser.uid,
      firebaseUser.name,
      firebaseUser.email
    );
  } catch (err) {
    return res.status(403).json({ error: "Forbidden: " + err });
  }

  next();
});

configRoutes(app);

app.listen(PORT, () =>
  console.log(`Server listening for requests on port ${PORT}`)
);
