const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../model/UserModel');

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword)

    // Create the user
    const user = await UserModel.create({ email, password: hashedPassword });

    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("route login hit with email:", email);


    const user = await UserModel.findOne({ email });
    console.log("Plain-text password from body:", password);
    if (user)
      console.log("user found:", user.email);

    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password for comparison:", hashedPassword);

    console.log("Password match result:", isMatch);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.logout= async(req, res) => {
  res.json({message: "Logged out successfully"});
}
