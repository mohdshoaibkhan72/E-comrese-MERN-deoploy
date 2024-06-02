// Importing bcrypt
const bcrypt = require("bcryptjs");

// Async function for login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation for checking inputs and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Finding user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Matching password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Password is correct, create JWT token
    const accessToken = jwt.sign(
      {
        name: user.username,
        userId: user._id,
        email: user.email,
        accountType: user.accountType,
      },
      process.env.ACCESS_TOKEN_SECRET
    );

    // Respond with the token, user details, and account type
    res.status(200).json({
      accessToken,
      user: {
        name: user.username,
        email: user.email,
        accountType: user.accountType,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed", details: error.message });
  }
};
