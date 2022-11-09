// dev only
require("dotenv").config({path: ".env"});
require("./database");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

const tournamentController = require("./controllers/tournamentController");
const teamController = require("./controllers/teamController");
const matchController = require("./controllers/matchController");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200
}));

/**
 * Créer un tournoi
 */
app.post("/api/v1/tournaments", tournamentController.create);

/**
 * Obtenir un tournoi
 */
 app.get("/api/v1/tournaments/:tournamentId", tournamentController.get);

/**
 * Créer une équipe
 */
app.post("/api/v1/tournaments/:tournamentId/teams", teamController.create);

/**
 * Récuperer les équipes
 */
app.get("/api/v1/tournaments/:tournamentId/teams", teamController.getAll);

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

app.listen(8080, () => console.log("Server started on port : 8080"));
