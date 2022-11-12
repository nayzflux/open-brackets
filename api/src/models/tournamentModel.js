const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema({
    name: String,
    is_private: { type: Boolean, default: true },
    owner: { type: mongoose.Types.ObjectId, ref: "user" },
    admins: [{ type: mongoose.Types.ObjectId, ref: "user" }],
});

const TournamentModel = mongoose.model("tournament", tournamentSchema, "tournaments");

module.exports = TournamentModel;