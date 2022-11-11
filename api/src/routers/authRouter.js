const Router = require("express").Router();

const authController = require("../controllers/authController");
const autMiddleware = require("../middlewares/authMiddleware");

Router.post("/register", authController.register); // Créer un compte
Router.post("/login", authController.login); // Se connecter
Router.post("/logout", authController.logout); // Se déconnecter

module.exports = Router;