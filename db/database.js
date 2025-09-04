import mongoose from "mongoose";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();
const { Schema } = mongoose;
const chatSchema = new Schema({
  name : String,
  speaker : String, 
  text : String
});
const sessionSchema = new Schema({
  sessionId: { type: String, default: () => uuidv4() },
  wpm: String,
  res_length: String,
  clarityIdx: String,
  vocabRichness: String,
  engagement_score: String,
  confidence_score: String,
  investor_alignment: String,
  createdAt: { type: Date, default: Date.now },
  chats: [chatSchema],
});

const userSchema = new Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  sessions: [sessionSchema], // ek user ke multiple sessions
});

const User = mongoose.model("User", userSchema);

async function main() {
  await mongoose.connect(
    process.env.MONGO_URI
  );
  console.log("MongoDB connected!");
  return { User };
}

export { main, User };
