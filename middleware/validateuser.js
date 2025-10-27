import validator from "validator";
import { User } from "../db/database";
import jwt from "jsonwebtoken"
export default async function validateUser(req, res, next) {
  try {
    const { uid } = req.body;
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const { _id } = user;
    
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
