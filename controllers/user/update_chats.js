import { UserModel } from "../../db/database.js";
const updateChats = async (req, res) => {
  try {
    const uid = req.params.uid;
    const sessionData = req.body.sessions; 

    const updatedUser = await UserModel.findOneAndUpdate(
      { uid },
      { $push: { sessions: sessionData } }, 
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success : false , 
        error : "User not found"
    });
    }

    res.status(200).json({
        success : true , 
        message : "Chat saved succesfully" ,
        data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
        success : false 
        ,error : "The error is " + err.message
    });
  }
}

export default updateChats ; 