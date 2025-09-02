import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import aiModel from "./Api/aiResponse.js"; // aiModel should accept Buffer
import texToAi from "./Api/submit_text_to_chat.js";
import startChat from "./Api/startChat.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Route Taking directly text 
app.post("/submit_text_to_chat", texToAi) ; 

app.get("/start_chat", startChat)

// HTTP + Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Receive full recording when stopped
  socket.on("stop-recording", async (chunks) => {
    try {
      console.log("Received full audio chunks:", chunks.length);

      // Convert base64 chunks to Buffers
      const buffers = chunks.map(c => Buffer.from(c, "base64"));

      // Combine all into single Buffer
      const fullBuffer = Buffer.concat(buffers);
 
      // Send to AI model
      const transcription = await aiModel(fullBuffer);

      // Send transcription back to frontend
      socket.emit("transcription", transcription.transcription || transcription);
    } catch (err) {
      console.error("Error processing audio:", err);
      socket.emit("transcription", "[Error processing audio]");
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});
const PORT = process.env.PORT || 3000;
// Start server
httpServer.listen(PORT, () => {
  console.log("Server running on port ", PORT);
});
