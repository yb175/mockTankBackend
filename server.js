import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import aiModel from "./Api/aiResponse.js"; // aiModel should accept Buffer
import texToAi from "./Api/submit_text_to_chat.js";
import startChat from "./Api/startChat.js";
import dotenv from "dotenv";
import { User, main } from "./db/database.js";
import analyse from "./Api/analyse.js";
dotenv.config();
const app = express();

// Enable CORS and JSON parsing
app.use(cors()); 
app.use(express.json({ limit: "50mb" }));

// Route Taking directly text
app.post("/submit_text_to_chat", texToAi);

app.get("/start_chat", startChat);

app.post("/analyse", analyse);

app.get("/get_chats/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await User.findOne({ uid: uid }); 

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/update_chats/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    const sessionData = req.body.sessions; // pura object

    const ans = await User.findOneAndUpdate(
      { uid },
      { $push: { sessions: sessionData } }, // directly object push kar
      { new: true }
    );

    if (!ans) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(ans);
  } catch (err) {
    res.status(500).send("The error is " + err.message);
  }
});
// Get a specific session for a user
app.get("/users/:uid/sessions/:sessionId", async (req, res) => {
  try {
    const { uid, sessionId } = req.params;

    // Find user
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find session by sessionId
    const session = user.sessions.find((s) => s.sessionId === sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json(session);
  } catch (err) {
    console.error("Error fetching session:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/create_user", async (req, res) => {
  try {
    const existingUser = await User.findOne({ uid: req.body.uid });
    if (existingUser) {
      return res.status(400).send("User with this UID already exists");
    }

    const newUser = await User.create(req.body);
    res.status(201).send(newUser);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

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
      const buffers = chunks.map((c) => Buffer.from(c, "base64"));

      // Combine all into single Buffer
      const fullBuffer = Buffer.concat(buffers);

      // Send to AI model
      const transcription = await aiModel(fullBuffer);

      // Send transcription back to frontend
      socket.emit(
        "transcription",
        transcription.transcription || transcription
      );
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
main()
  .then(() => {
    httpServer.listen(PORT, () => {
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