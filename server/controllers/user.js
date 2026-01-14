const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ email, passwordHash, name });
    await user.save();

    res.status(201).json({
      message: "Utilisateur créé",
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Identifiants invalides" });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid)
      return res.status(401).json({ message: "Identifiants invalides" });

    // Génération du token
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: "Connexion réussie",
      user: { id: user._id, email: user.email, name: user.name },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
