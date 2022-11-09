const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema({
    name: String
});

const TournamentModel = mongoose.model("tournament", tournamentSchema, "tournaments");

module.exports = TournamentModel;