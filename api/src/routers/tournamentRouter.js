const Router = require("express").Router();

const tournamentController = require("../controllers/tournamentController");
const autMiddleware = require("../middlewares/authMiddleware");
const permissionMiddleware = require("../middlewares/permissionMiddleware");

Router.post("/", autMiddleware.isAuth, permissionMiddleware.canCreateTournament, tournamentController.create); // Créer un tournoi

Router.get("/:tournamentId", autMiddleware.isAuth, tournamentController.get); // Récupérer un tournoi

module.exports = Router;