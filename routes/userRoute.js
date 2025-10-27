import express from "express" ;
import fetchChats from "../controllers/user/get_chats.js"; 
import updateChats from "../controllers/user/update_chats.js";
import getSpecificSession from "../controllers/user/getSpecificSections.js";
import createUser from "../controllers/user/createUser.js";


const userRouter = express.Router() ; 

// fetch chats 
userRouter.get("/get_chats/:uid",fetchChats); 

// Updating new chat sesssion in the db 
userRouter.post("/update_chats/:uid", updateChats); 

// Get a specific session for a user
userRouter.get("/:uid/sessions/:sessionId", getSpecificSession);

// Create user 
userRouter.post("/create_user", createUser); 



export default userRouter 