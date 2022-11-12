module.exports.canCreateTournament = async (req, res, next) => {
    const sender = res.locals.sender;

    const allowedRoles = ["Administrateur", "Utilisateur"];

    if (!allowedRoles.includes(sender.role)) {
        return res.status(403).json({ message: "Accès non autorisé" });
    }

    return next();
}

module.exports.canCreateTournamentTeam = async (req, res, next) => {
    const sender = res.locals.sender;
    const { tournament } = req;

    // Bypass
    if (sender.role == "Administrateur") return next();

    // Si l'utilisateur est le propriétaire ou admin du tournoi
    if (tournament?.owner?._id?.toString() !== sender._id.toString() && !tournament?.admins?.map(a => a?._id.toString()).includes(sender._id.toString())) return res.status(403).json({ message: "Accès non autorisé" });

    return next();
}

module.exports.canDeleteTournamentTeam = async (req, res, next) => {
    const sender = res.locals.sender;
    const { tournament } = req;

    // Bypass
    if (sender.role == "Administrateur") return next();

    // Si l'utilisateur est le propriétaire ou admin du tournoi
    if (tournament?.owner?._id?.toString() !== sender._id.toString() && !tournament?.admins?.map(a => a?._id.toString()).includes(sender._id.toString())) return res.status(403).json({ message: "Accès non autorisé" });

    return next();
}

module.exports.canGetTournamentTeams = async (req, res, next) => {
    const sender = res.locals.sender;
    const { tournament } = req;

    // Si le tournoi n'est pas privée
    if (!tournament.is_private) return next();

    // Bypass
    if (sender.role == "Administrateur") return next();

    // Si l'utilisateur est le propriétaire ou admin du tournoi
    if (tournament?.owner?._id?.toString() !== sender._id.toString() && !tournament?.admins?.map(a => a?._id.toString()).includes(sender._id.toString())) return res.status(403).json({ message: "Accès non autorisé" });

    return next();
}

module.exports.canGetTournamentTeam = async (req, res, next) => {
    const sender = res.locals.sender;
    const { tournament } = req;

    // Si le tournoi n'est pas privée
    if (!tournament.is_private) return next();

    // Bypass
    if (sender.role == "Administrateur") return next();

    // Si l'utilisateur est le propriétaire ou admin du tournoi
    if (tournament?.owner?._id?.toString() !== sender._id.toString() && !tournament?.admins?.map(a => a?._id.toString()).includes(sender._id.toString())) return res.status(403).json({ message: "Accès non autorisé" });

    return next();
}