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

    const matches = await MatchModel.find({ tournament: tournament.id }).populate("teams tournament");
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

    /**
     * Créer l'arbres du tournoi
     * Par: NayZ
     * Aide: https://gist.github.com/sterlingwes/4199115
     */
    const teams = await TeamModel.find({ tournament: tournamentId }).populate("tournament");
    const teamsSize = teams.length;

    const matches = [];

    const knownBrackets = [2, 4, 8, 16, 32, 64];

    const closest = knownBrackets.find(b => b >= teamsSize);
    const roundNumber = knownBrackets.indexOf(closest) + 1;
    const byes = closest - teamsSize;

    var refCount = 1;
    var nextRefCount = refCount + (closest / 2);

    // Créer les matchs initiaux
    var i1 = 0;
    while (i1 <= closest) {
        console.log(i1);

        if (i1 + 4 <= teams.length - 1) {
            console.log("4 players = 2 matches");
            matches.push({ ref: refCount, team1: teams[i1].name, team2: teams[i1 + 1].name, round: 1, from: null, next: nextRefCount });
            matches.push({ ref: refCount + 1, team1: teams[i1 + 2].name, team2: teams[i1 + 3].name, round: 1, from: null, next: nextRefCount });
            nextRefCount++;
            refCount += 2;
        } else {
            if (i1 + 3 <= teams.length - 1) {
                console.log("3 players = 1 matches & 1 next round match");
                //2 equipes en match + 1 équipes qualifié
                matches.push({ ref: refCount, team1: teams[i1].name, team2: teams[i1 + 1].name, round: 1, from: null, next: nextRefCount });
                matches.push({ ref: (refCount + (closest / 2) - 1), team1: teams[i1 + 2].name, team2: null, round: 2, from: [refCount], next: nextRefCount + (closest / 2) });
                nextRefCount++;
                refCount += 1;
            } else {
                if (i1 + 2 <= teams.length - 1) {
                    console.log("2 players = 1 next round match");
                    //2 équipes qualifié
                    matches.push({ ref: (refCount + (closest / 2) - 1), team1: teams[i1].name, team2: teams[i1 + 1].name, round: 2, from: null, next: nextRefCount + (closest / 2) });
                    nextRefCount++;
                    refCount += 0;
                }
            }
        }

        i1 += 3;
    }

    console.log("Round 1\n");

    matches.filter(m => m.round == 1).forEach(m => console.log("       " + m.team1 + " VS " + m.team2 + "\n"));

    console.log("Round 2\n");

    matches.filter(m => m.round == 2).forEach(m => console.log("       " + m.team1 + " VS " + m.team2 + "\n"));

    for (const match of matches) {
        const { ref, next, round } = match;

        if (matches.find(m => m.ref == next)) break;

        matches.push({ ref: next, round: round + 1, team1: null, team2: null, from: [ref], next: (next + (closest / 2) - 1) });
    }

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