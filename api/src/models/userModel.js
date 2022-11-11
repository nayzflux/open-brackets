const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

// play function before save into display: 'block',
userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const UserModel = mongoose.model("user", userSchema, "users");

module.exports = UserModel;