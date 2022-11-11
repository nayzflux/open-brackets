const Router = require("express").Router();

const tournamentController = require("../controllers/tournamentController");

Router.post("/api/v1/tournaments", tournamentController.create); // Créer un tournoi

Router.get("/api/v1/tournaments/:tournamentId", tournamentController.get); // Créer un tournoi

module.exports = Router;