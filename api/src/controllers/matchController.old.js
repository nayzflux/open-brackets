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
    while (i1 < closest) {
        console.log(i1);

        if (i1 >= closest - byes - 1) {
            
        } else {
            matches.push({ ref: refCount, team1: teams[i1].name, team2: teams[i1 + 1].name, round: 1, from: null, next: nextRefCount });
        }

        refCount++;
        i1 += 2;
        if ((refCount - 1) % 2 == 0) {
            nextRefCount++;
        }
    }

    // Créer les prochains tours
    var i3 = 1;
    while (i3 < roundNumber) {
        const matchNumber = (closest / (2 ** (i3 + 1)));
        var i4 = 0;
        while (i4 < matchNumber) {
            const fromRefCount = matches.filter(m => m.next == refCount).map(m => m.ref);

            if (i3 + 1 === roundNumber) nextRefCount = null;

            matches.push({ ref: refCount, team1: null, team2: null, round: (i3 + 1), from: fromRefCount, next: nextRefCount });
            refCount++;
            i4++;
            if ((refCount - 1) % 2 == 0) {
                nextRefCount++;
            }
        }
        i3++;
    }

    console.log(matches);

    var i2 = 0;
    i1 = i1 - byes - 1;
    while (i2 < byes) {
        // Trouver les matchs ou il manques des participants
        const matchEmpty = matches.filter(m => m.from?.length < 2);
        console.log(matchEmpty, i1);
        for (const match of matchEmpty) {
            if (match.from?.length == 1) {
                match.team1 = teams[i1].name;
                i1++;
            }

            if (match.from?.length == 0) {
                match.team1 = teams[i1].name;
                match.team2 = teams[i1 + 1].name;
                i1+=2;
            }
        }
        i2++;
    }

    return res.status(200).json({ matches });
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