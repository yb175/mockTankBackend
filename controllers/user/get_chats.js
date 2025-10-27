import { UserModel } from "../../db/database.js";
const  fetchChats = async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await UserModel.findOne({ uid: uid}) ;  

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ success : false ,error: "Internal Server Error" });
  }
}

export default fetchChats ; 