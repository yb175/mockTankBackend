import { UserModel } from "../../db/database.js";

const createUser = async (req, res) => {
  try {
    const { uid } = req.body;

    // Validate input
    if (!uid) {
      return res.status(400).json({
        success: false,
        error: "UID is required",
      });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ uid });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User with this UID already exists",
      });
    }

    // Create new user
    const newUser = await UserModel.create(req.body);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Internal Server Error",
    });
  }
};

export default createUser;