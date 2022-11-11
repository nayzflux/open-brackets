const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    // vérifier les champs
    if (!username) return res.status(400).json({ message: "Merci d'indiquer un nom d'utilisateur" });
    if (!email) return res.status(400).json({ message: "Merci d'indiquer une adresse e-mail" });
    if (!password) return res.status(400).json({ message: "Merci d'indiquer un mot de passe" });

    if (await UserModel.exists({ username: { $eq: username } })) {
        return res.status(400).json({ message: "Le nom d'utilisateur est déjà utilisé" });
    }

    if (await UserModel.exists({ email: { $eq: email } })) {
        return res.status(400).json({ message: "L'adresse e-mail est déjà utilisée" });
    }

    const user = await UserModel.create({ username: username.toString(), email: email.toString(), password: password.toString() });

    // Mettre à jour la session
    req.session.authenticated = true;
    req.session.user = { _id: user._id };

    return res.status(201).json({ username: user.username, email: user.email });
}

module.exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!password) return res.status(400).json({ message: "Merci d'indiquer un mot de passe" });
    if (!email) return res.status(400).json({ message: "Merci d'indiquer une adresse e-mail" });

    const user = await UserModel.findOne({ email: { $eq: email } });

    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const auth = await bcrypt.compare(password, user.password);

    if (!auth) {
        res.cookie("connect.sid", "", { maxAge: 1 });
        req.session.destroy();
        return res.status(403).json({ message: "Le mot de passe ne correspond pas au compte" });
    }

    // Mettre à jour la session
    req.session.authenticated = true;
    req.session.user = { _id: user._id };

    return res.status(200).json({ logged: true });
}

module.exports.logout = async (req, res) => {
    res.cookie("connect.sid", "", { maxAge: 1 });
    req.session.destroy();
    return res.status(200).json({ message: "Déconnexion du compte effectuée avec succès" });
}