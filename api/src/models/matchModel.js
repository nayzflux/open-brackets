const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
    // ID du match
    current: Number,
    // ID du match à suivre
    next: Number,
    // Round du match
    round: Number,
    // Tournoi dans lequel se trouve le match
    tournament: { type: mongoose.Types.ObjectId, ref: "tournament" },
    // Liste des équipes qui s'affrontent dans le match
    teams: [{ type: mongoose.Types.ObjectId, ref: "team" }],
    // Score des équipes
    scores: [Number],
    // Gagnant du match
    winner: { type: mongoose.Types.ObjectId, ref: "team" },
    // Perdant du match
    loser: { type: mongoose.Types.ObjectId, ref: "team" }
});

const MatchModel = mongoose.model("match", matchSchema, "matches");

module.exports = MatchModel;