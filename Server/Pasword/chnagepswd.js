const bcrypt = require("bcryptjs");

const Chngepswd = async (req, res) => {
  try {
    const user = req.user;

    const { newPassword } = req.body;

    // Validation for checking if newPassword is provided
    if (!newPassword) {
      return res.status(400).json({ message: "Please provide a new password" });
    }

    // Hash the new password before updating
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    const updatedUser = await usermodel.findOneAndUpdate(
      { email: user.email },
      { $set: { password: hashedPassword } }, // Update with hashed password
      { new: true }
    );

    // Check if the user was found and the password was updated successfully
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Password updated successfully
    console.log("Password updated successfully");
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = Chngepswd;
