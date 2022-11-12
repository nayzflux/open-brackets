const Router = require("express").Router();

// Controllers
const teamController = require("../controllers/teamController");

// Middlewares
const authMiddleware = require("../middlewares/authMiddleware");
const permissionMiddleware = require("../middlewares/permissionMiddleware");
const tournamentMiddleware = require("../middlewares/tournamentMiddleware");

/**
 * Créer une équipe
 */
Router.post("/:tournamentId/teams", authMiddleware.isAuth, tournamentMiddleware.setTournament, permissionMiddleware.canCreateTournamentTeam, teamController.create);

/**
 * Supprimer une équipe
 */
Router.delete("/:tournamentId/teams/:teamId", authMiddleware.isAuth, tournamentMiddleware.setTournament, permissionMiddleware.canDeleteTournamentTeam, teamController.delete);

/**
 * Récupérer une équipe
 */
 Router.get("/:tournamentId/teams/:teamId", authMiddleware.isAuth, tournamentMiddleware.setTournament, permissionMiddleware.canGetTournamentTeam, teamController.get);

/**
 * Récuperer les équipes
 */
Router.get("/:tournamentId/teams", authMiddleware.isAuth, tournamentMiddleware.setTournament, permissionMiddleware.canGetTournamentTeams, teamController.getAll);

module.exports = Router;