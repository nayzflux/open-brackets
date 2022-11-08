const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const tournaments = [];
const teams = [];

/**
 * Créer un tournoi
 */
app.post("/api/v1/tournaments", (req, res) => {
    const { name } = req.body;

    const t = {
        id: "to_" + (Math.random() + 1).toString(36).substring(7),
        name: name
    }

    tournaments.push(t);

    console.log("Creating tournaments " + name + "...");

    return res.status(201).json(t);
});

/**
 * Créer une équipe dans un tournoi
 */
app.post("/api/v1/tournaments/:tournamentId/teams", (req, res) => {
    const { tournamentId } = req.params;
    const { name, players } = req.body;

    const tournament = tournaments.find(t => t.id === tournamentId);

    if (!tournament) return res.status(404).json({ message: "Not found" });

    const t = {
        id: "te_" + (Math.random() + 1).toString(36).substring(7),
        tournamentId: tournament.id,
        name: name,
        players: players
    }

    teams.push(t);

    console.log("Creating teams " + name + " in tournament " + tournament.name + "...");

    return res.status(201).json(t);
});

/**
 * Obtenir un tournoi
 */
app.get("/api/v1/tournaments/:tournamentId", (req, res) => {
    const { tournamentId } = req.params;

    const tournament = tournaments.find(t => t.id === tournamentId);

    if (!tournament) return res.status(404).json({ message: "Not found" });

    return res.status(200).json(tournament);
});

app.listen(8080, () => console.log("Server started on port : 8080"));
