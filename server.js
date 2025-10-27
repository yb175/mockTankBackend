import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { main } from "./db/database.js";
import llmRouter from "./routes/llmRoute.js";
import userRouter from "./routes/userRoute.js";


dotenv.config();
const app = express();

// Enable CORS and JSON parsing
app.use(cors()); 
app.use(express.json({ limit: "50mb" }));

app.use('/llm',llmRouter) ; 
app.use('/users',userRouter) ; 


const PORT = process.env.PORT || 3000;
main()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server running on port", PORT);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });




//   async function updateChats(uid) {
//   try {
//     const response = await fetch(`http://localhost:3000/update_chats/${uid}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         sessions: {
//           wpm: "0.17",
//           res_length: "10.00",
//           clarityIdx: "69.8",
//           vocabRichness: "0.900",
//           engagement_score: "0",
//           confidence_score: "0",
//           investor_alignment: "0",
//           createdAt: new Date().toISOString(), // 👈 ISO format bhejna best hai
//         },
//       }),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to update chats");
//     }

//     const data = await response.json();
//     console.log("Updated user:", data);
//   } catch (error) {
//     console.error("Error updating chats:", error);
//   }
// }