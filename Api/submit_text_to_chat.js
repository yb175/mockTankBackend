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

    // Connect to Gradio client
    const client = await Client.connect("yj134/investorbhai");

    // Example: Maintain a chat history (can be dynamic)
    const chatHistory = [
      { role: "user", metadata: null, content: "Hello!", options: null },
      { role: "assistant", metadata: null, content: "How can I help you?", options: null }
    ];

    // Send the text to the AI model using correct endpoint and format
    const result = await client.predict(
      "/submit_to_chat_1", // endpoint string
      {
        text: approvedText, // new text from frontend
        chat_history: chatHistory
      }
    );

    // Send AI response back to frontend
    res.json(result.data);

    /*
      🔹 Frontend usage example:
      const res = await fetch("/submit_text_to_chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvedText: "Hello AI!" })
      });

      const data = await res.json();
      console.log(data); // <-- Shows AI's reply
    */

  } catch (err) {
    console.error("Error in texToAi:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default texToAi;