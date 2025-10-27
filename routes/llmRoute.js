import express from "express" ;
import texToAi from "../controllers/llm/submit_text_to_chat.js"; 
import analyse from "../controllers/llm/analyse.js";
import startChat from "../controllers/llm/startChat.js";
const llmRouter = express.Router() ; 

// Route Taking directly text
llmRouter.post("/submit_text_to_chat", texToAi);

// Start chat 
llmRouter.get("/start_chat", startChat);

// Analysing speech with ai 
llmRouter.post("/analyse", analyse);

export default llmRouter ; 

