require("dotenv").config();

const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const mongooseConnection = require("./config/mongoConnection");
const configRoutes = require("./routes");
const usersData = require("./data/users");
const nocache = require("nocache");
const session = require("express-session");

const PORT = process.env.PORT || 4200;

let privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (process.env.NODE_ENV === "production") {
  privateKey = privateKey.replace(/\\n/g, "\n");
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey,
  }),
});

const app = express();

const dbConnection = mongooseConnection();

app.use(nocache());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
); // session secret

app.use(express.static("client/public"));

app.get("*", (req, res, next) => {
  if (!req.path.startsWith("/api")) {
    //res.sendfile(__dirname + "/client/build/index.html");
    res.sendfile(__dirname + "/client/public/index.html");
  } else {
    next();
  }
});

app.get("/health", (req, res) => {
  res.send("Hello World!");
});

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
    console.log(
      `Failed Authenticating user for request: ${req.method} ${req.url}. Error: ${err}`
    );
    return res.status(403).json({ error: "Forbidden: " + err });
  }

  next();
});

app.use((req, res, next) => {
  console.log(
    `Incoming request: ${req.method} ${req.url} from user: ${req.user.name}`
  );
  next();
});

app.use(
  session({
    name: "AuthCookie",
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: true,
    resave: false,
  })
);

configRoutes(app);

app.listen(PORT, () =>
  console.log(`Server listening for requests on port ${PORT}`)
);
