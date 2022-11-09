const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
    name: String,
    seed: Number,
    players: [String],
    tournament: { type: mongoose.Types.ObjectId, ref: "tournament" }
});

const TeamModel = mongoose.model("team", teamSchema, "teams");

module.exports = TeamModel;