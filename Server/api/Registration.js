const User = require("../Models/UserModel");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { fullName, username, password, email, mobileNumber, accountType } =
      req.body;

    // Validation
    if (
      !fullName ||
      !username ||
      !password ||
      !email ||
      !mobileNumber ||
      !accountType
    ) {
      return res
        .status(500)
        .json({ success: false, message: "Please provide all fields" });
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(500)
        .json({ success: false, message: "Email already exists" });
    }

    // Store new user data
    const user = new User({
      fullName,
      username,
      password, // Assuming password is already hashed
      email,
      mobileNumber,
      accountType,
    });
    await user.save();

    // Registration done, create JWT token
    const accessToken = jwt.sign(
      { name: user.username, userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.status(201).json({
      success: true,
      message: "Registration is successful",
      accessToken,
      user: { name: user.username },
      accountType: { type: user.accountType },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = registerUser;
