import { UserModel } from "../../db/database.js";

const getSpecificSession = async (req, res) => {
  try {
    const { uid, sessionId } = req.params;

    // Validate inputs
    if (!uid || !sessionId) {
      return res.status(400).json({
        success: false,
        error: "UID and sessionId are required",
      });
    }

    // Find user
    const user = await UserModel.findOne({ uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Find session by ID
    const session = user.sessions.find((s) => s.sessionId === sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found",
      });
    }

    // Success response
    res.status(200).json({
      success: true,
      message: "Session fetched successfully",
      data: session,
    });
  } catch (err) {
    console.error("Error fetching session:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Internal Server Error",
    });
  }
};

export default getSpecificSession;
