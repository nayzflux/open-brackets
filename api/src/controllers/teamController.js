const mongoose = require("mongoose");
const TeamModel = require("../models/teamModel");
const TournamentModel = require("../models/tournamentModel");

/**
 * Créer une équipe
 */
module.exports.create = async (req, res) => {
    const { tournament } = req;
    const { name, players } = req.body;

    const team = await (await TeamModel.create({ name, players, tournament: tournament._id })).populate("tournament");
    return res.status(201).json(team);
}

/**
 * Supprimer une équipe
 */
module.exports.delete = async (req, res) => {
    const { teamId } = req.params;

    console.log(teamId);

    if (!mongoose.Types.ObjectId.isValid(teamId)) return res.status(400).json({ message: "L'ID de l'équipe est invalide" });
    const team = await TeamModel.findById(teamId);
    if (!team) return res.status(404).json({ message: "L'équipe n'existe pas" });

    await team.delete();
    return res.status(200).json(team);
}

/**
 * Récupérer une équipe
 */
module.exports.get = async (req, res) => {
    const { teamId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(teamId)) return res.status(400).json({ message: "L'ID de l'équipe est invalide" });
    const team = await TeamModel.findById(teamId);
    if (!team) return res.status(404).json({ message: "L'équipe n'existe pas" });

    return res.status(200).json(team);
}

/**
 * Récupérer les équipes
 */
module.exports.getAll = async (req, res) => {
    const { tournament } = req;

    const teams = await TeamModel.find({ tournament: tournament._id }).populate("tournament");
    return res.status(200).json(teams);
}