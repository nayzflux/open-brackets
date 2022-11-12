// dev only
require("dotenv").config({ path: ".env" });
require("./database");

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require(`connect-mongo`);

const app = express();

const tournamentRouter = require("./routers/tournamentRouter");
const teamRouter = require("./routers/teamRouter");
const authRouter = require("./routers/authRouter");

const teamController = require("./controllers/teamController");
const matchController = require("./controllers/matchController");

/**
 * Parsing
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

/**
 * Cors
 */
app.use(cors({
    origin: ['http://localhost', 'http://localhost:80'],
    credentials: true,
    preflightContinue: false
}));

/**
 * Session
 */
app.use(session(
    {
        secret: process.env.SESSION_SECRET,
        cookie: { maxAge: 30 * 24 * 60 * 60 * 1000, expires: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: true, secure: false },
        saveUninitialized: false,
        resave: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
    }
));

/**
 * ======================================== ROUTERS ========================================
 */

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/tournaments", tournamentRouter);
app.use("/api/v1/tournaments", teamRouter);

/**
 * Créer un match
 */
app.post("/api/v1/tournaments/:tournamentId/matches", matchController.create);

/**
 * Récupérer les matches
 */
app.get("/api/v1/tournaments/:tournamentId/matches", matchController.getAll);

/**
* Générer l'abres de matches
*/
app.post("/api/v1/tournaments/:tournamentId/matches/generate-tree", matchController.generateTree);

/**
 * Supprimer les matches
 */
app.delete("/api/v1/tournaments/:tournamentId/matches", matchController.deleteAll);

/**
 * AUTH ROUTES
 */

/**
 * USER ROUTES
 */

// // ALL ROUTES
// app.get("/api/v1/users");
// app.get("/api/v1/users/:userId");
// app.put("/api/v1/users/:userId");
// app.delete("/api/v1/users/:userId");

// // PERSONAL USER
// app.get("/api/v1/users/me");
// app.put("/api/v1/users/me");
// app.delete("/api/v1/users/me");

app.listen(8080, () => console.log("Server started on port : 8080"));
