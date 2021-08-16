require("dotenv").config();

const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./movie-mate-43364-firebase-adminsdk-mhl98-ee193c1f30.json");
const movielens = require("./data/movielens-api");
const mongooseConnection = require("./config/mongoConnection");
const configRoutes = require("./routes");
const usersData = require("./data/users");

const PORT = process.env.PORT || 4200;

admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  }),
});
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
const app = express();

const dbConnection = mongooseConnection();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
