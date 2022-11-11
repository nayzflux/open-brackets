const mongoose = require("mongoose");
const TeamModel = require("../models/teamModel");
const TournamentModel = require("../models/tournamentModel");
const MatchModel = require("../models/matchModel");

/**
 * Créer un match
 */
module.exports.create = async (req, res) => {
    const { tournamentId } = req.params;
    const { tier, teams } = req.body;

    // Vérifier si le tournoi existe
    if (!mongoose.Types.ObjectId.isValid(tournamentId)) return res.status(400).json({ message: "Merci de préciser un ID valide" });
    const tournament = await TournamentModel.findById(tournamentId);
    if (!tournament) return res.status(404).json({ message: "Le tournoi n'existe pas" });


    // Vérifier si les équipes existes
    for (const teamId of teams) {
        if (!mongoose.Types.ObjectId.isValid(teamId)) return res.status(400).json({ message: "Merci de préciser un ID valide" });
        const team = await TeamModel.findById(teamId);
        if (!team) return res.status(404).json({ message: "L'équipe " + teamId + " n'existe pas" });
    }

    const match = await (await MatchModel.create({ tier, teams, scores: [0, 0], winner: null, loser: null, tournament: tournament.id })).populate("teams tournament");
    return res.status(201).json(match);
}

/**
 * Récuperer les matches
 */
module.exports.getAll = async (req, res) => {
    const { tournamentId } = req.params;

    // Vérifier si le tournoi existe
    if (!mongoose.Types.ObjectId.isValid(tournamentId)) return res.status(400).json({ message: "Merci de préciser un ID valide" });
    const tournament = await TournamentModel.findById(tournamentId);
    if (!tournament) return res.status(404).json({ message: "Le tournoi n'existe pas" });

    const matches = await MatchModel.find({ tournament: { $eq: tournamentId } }).populate("teams tournament");
    return res.status(200).json(matches);
}

/**
 * Générer l'abre de match
 */
module.exports.generateTree = async (req, res) => {
    const { tournamentId } = req.params;

    // Vérifier si le tournoi existe
    if (!mongoose.Types.ObjectId.isValid(tournamentId)) return res.status(400).json({ message: "Merci de préciser un ID valide" });
    const tournament = await TournamentModel.findById(tournamentId);
    if (!tournament) return res.status(404).json({ message: "Le tournoi n'existe pas" });

    // Delete all matches
    await MatchModel.deleteMany();

    /**
     * Créer l'arbres du tournoi
     * Par: NayZ
     * Aide: https://gist.github.com/sterlingwes/4199115
     */
    const teams = await TeamModel.find({ tournament: { $eq: tournamentId } }).populate("tournament");
    const teamsSize = teams.length;

    const knownBrackets = [2, 4, 8, 16, 32, 64];

    const bracketSize = knownBrackets.find(b => b >= teamsSize);

    var ref = 0;
    var round = 0;
    var nextRef = 0;
    while (round < (knownBrackets.indexOf(bracketSize) + 1)) {
        const matchNumber = (bracketSize / (2 ** (round + 1)));
        nextRef = ref + matchNumber + 1;
        var i = 0;
        console.log("Round #" + (round + 1) + "\n");
        while (i < matchNumber) {
            console.log("    Match #" + (ref + 1) + " -> Match #" + Math.floor(nextRef) + "\n");
            await MatchModel.create({
                current: ref + 1,
                next: (round + 1) == (knownBrackets.indexOf(bracketSize) + 1) ? null : Math.floor(nextRef),
                round: round + 1,
                tournament: tournamentId,
                teams: [],
                scores: [],
                winner: null,
                loser: null
            });
            ref++;
            i++;
            nextRef += 0.5;
        }
        round++;
    }

    const matches = await MatchModel.find({ tournament: { $eq: tournamentId } }).populate("teams tournament");

    // Créer les matchs initiaux
    return res.status(200).json(matches);
}

/**
 * Supprimer tous les matches
 */
module.exports.deleteAll = async (req, res) => {
    const { tournamentId } = req.params;

    // Vérifier si le tournoi existe
    if (!mongoose.Types.ObjectId.isValid(tournamentId)) return res.status(400).json({ message: "Merci de préciser un ID valide" });
    const tournament = await TournamentModel.findById(tournamentId);
    if (!tournament) return res.status(404).json({ message: "Le tournoi n'existe pas" });

    const matches = await MatchModel.deleteMany({ tournamentId: tournamentId });
    return res.status(200).json(matches);
}