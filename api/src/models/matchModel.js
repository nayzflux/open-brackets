const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
    tier: Number,
    teams: [{ type: mongoose.Types.ObjectId, ref: "team"}],
    scores: [Number],
    tournament: { type: mongoose.Types.ObjectId, ref: "tournament"},
    winner: { type: mongoose.Types.ObjectId, ref: "team"},
    loser: { type: mongoose.Types.ObjectId, ref: "team"}
});

const MatchModel = mongoose.model("match", matchSchema, "matches");

module.exports = MatchModel;