const mongoose = require("mongoose");
const UserModel = require("../models/userModel");

module.exports.isAuth = async (req, res, next) => {
    const { session } = req;

    // si l'utilisateur n'est pas authentifier ou que l'utilisateur n'existe plus
    if (!session.authenticated) return res.status(401).json({ message: "Authentification requise" });
    if (!session.user || !session.user._id) return res.status(401).json({ message: "Authentification requise" });
    if (!mongoose.Types.ObjectId.isValid(session.user._id)) return res.status(401).json({ message: "Authentification requise" });

    const user = await UserModel.findById(session.user._id).select("-password");

    if (!user) return res.status(404).json({ message: "L'utilisateur auquel vous êtes connecté n'existe pas" });

    res.locals.sender = user;
    return next();
}