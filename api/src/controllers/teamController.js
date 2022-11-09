const mongoose = require("mongoose");
const TeamModel = require("../models/teamModel");
const TournamentModel = require("../models/tournamentModel");

/**
 * Créer une équipe
 */
module.exports.create = async (req, res) => {
    const { tournamentId } = req.params;
    const { name, players } = req.body;

    if (!mongoose.Types.ObjectId.isValid(tournamentId)) return res.status(400).json({ message: "Merci de préciser un ID valide" });

    const tournament = await TournamentModel.findById(tournamentId);

    if (!tournament) return res.status(404).json({ message: "Le tournoi n'existe pas" });

    const team = await (await TeamModel.create({name, players, tournament: tournament.id})).populate("tournament");
    return res.status(201).json(team);
}

/**
 * Récupérer les équipes
 */
 module.exports.getAll = async (req, res) => {
    const { tournamentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tournamentId)) return res.status(400).json({ message: "Merci de préciser un ID valide" });
    const tournament = await TournamentModel.findById(tournamentId);
    if (!tournament) return res.status(404).json({ message: "Le tournoi n'existe pas" });

    const teams = await TeamModel.find({ tournament: tournament.id}).populate("tournament");
    return res.status(201).json(teams);
}