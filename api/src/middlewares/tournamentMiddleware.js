const mongoose = require("mongoose");
const TournamentModel = require("../models/tournamentModel");

module.exports.setTournament = async (req, res, next) => {
    const { tournamentId } = req.params;

    // Vérifier si le tournoi existe
    if (!mongoose.Types.ObjectId.isValid(tournamentId)) return res.status(400).json({ message: "L'ID du tournoi est invalide" });
    const tournament = await TournamentModel.findById(tournamentId).populate("owner admins", "-password");
    if (!tournament) return res.status(404).json({ message: "Le tournoi n'existe pas" });

    req.tournament = tournament;

    return next();
}