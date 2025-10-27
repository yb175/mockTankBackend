import { Client } from "@gradio/client";

/**
 * API endpoint to send text to Gradio AI model and get a response.
 *
 * Input (POST request body JSON):
 * {
 *    "approvedText": "Hello AI!"   // Text to send to the model
 * }
 *
 * Output (JSON response):
 * {
 *    ...result from Gradio model...
 * }
 */
const texToAi = async (req, res) => {
  try {
    const { approvedText } = req.body; // ✅ Get text from frontend request body

    // Connect to Gradio client (repo on HF Spaces)
    const client = await Client.connect("yj134/investorbhai");

    // Example: Maintain a chat history (can be dynamic)
    const chatHistory = [];

    // Send the text to the AI model using correct endpoint and format
    const result = await client.predict(
      "/submit_message", // ✅ latest correct endpoint from Gradio config
      {
        message: approvedText,   // ✅ match HF space schema (can also be 'text' depending on model)
        history: chatHistory     // ✅ renamed 'chat_history' -> 'history' to stay consistent with your first snippet
      }
    );

    // Send AI response back to frontend
    res.json(result.data);

  } catch (err) {
    console.error("Error in texToAi:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default texToAi;
