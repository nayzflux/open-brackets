const Router = require("express").Router();

const tournamentController = require("../controllers/tournamentController");
const autMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/permissionMiddleware");

Router.post("/", autMiddleware.isAuth, roleMiddleware.canCreateTournament, tournamentController.create); // Créer un tournoi

Router.get("/:tournamentId", autMiddleware.isAuth, tournamentController.get); // Créer un tournoi

module.exports = Router;