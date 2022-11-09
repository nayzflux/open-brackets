const mongoose = require("mongoose");
const TournamentModel = require("../models/tournamentModel");

/**
 * Créer un tournoi
 */
module.exports.create = async (req, res) => {
    const { name } = req.body;

    if (!name) return res.status(400).json({message: "Merci de préciser un nom"});

    const tournament = await TournamentModel.create({name});
    return res.status(201).json(tournament);
}

/**
 * Supprimer un tournoi
 */
 module.exports.delete = async (req, res) => {
    const { tournamentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tournamentId)) return res.status(400).json({message: "Merci de préciser un ID valide"});

    const tournament = await TournamentModel.findByIdAndRemove(tournamentId);
    return res.status(200).json(tournament);
}

/**
 * Récupérer un tournoi
 */
 module.exports.get = async (req, res) => {
    const { tournamentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tournamentId)) return res.status(400).json({message: "Merci de préciser un ID valide"});

    const tournament = await TournamentModel.findById(tournamentId);

    if (!tournament) return res.status(404).json({message: "Le tournoi n'existe pas"});
    
    return res.status(200).json(tournament);
}