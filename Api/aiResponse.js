import predict from "../functions/model.js"; // make sure this returns { transcription: "..." }

export default async function aiModel(audioBuffer) {
  console.log("Processing audio...");
  try {
    const result = await predict(audioBuffer);
    // Ensure object has transcription key
    if (typeof result === "string") return { transcription: result };
    return result;
  } catch (err) {
    console.error("Error in aiModel:", err);
    return { transcription: "[Error]" };
  }
}
