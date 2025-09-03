import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import aiModel from "./Api/aiResponse.js"; // aiModel should accept Buffer
import texToAi from "./Api/submit_text_to_chat.js";
import startChat from "./Api/startChat.js";
import dotenv from "dotenv";
import { User, main } from "./db/database.js";
dotenv.config();
const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Route Taking directly text
app.post("/submit_text_to_chat", texToAi);

app.get("/start_chat", startChat);

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

    const ans = await User.findOneAndUpdate(
      { uid }, // find by uid
      { $push: { sessions: req.body.sessions } }, // push new session
      { new: true } // return updated doc
    );

    if (!ans) {
      return res.status(404).send("User not found");
    }

    res.send(ans);
  } catch (err) {
    res.status(500).send("The error is " + err.message);
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
