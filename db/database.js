import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const { Schema } = mongoose;

const sessionSchema = new Schema({
  wpm: String,
  res_length: String,
  clarityIdx: String,
  vocabRichness: String,
  engagement_score: String,
  confidence_score: String,
  investor_alignment: String,
  createdAt: { type: Date, default: Date.now },
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
