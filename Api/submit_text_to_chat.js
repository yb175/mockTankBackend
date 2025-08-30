import { Client } from "@gradio/client";

const texToAi = async (req, res) => {
  try {
    const { approvedText } = req.body; // ✅ Text will come from frontend request body

    const client = await Client.connect("yj134/investorbhai");
    const result = await client.predict("/submit_text_to_chat_1", { 		
      approved_text: approvedText, 
      chat_history: [],
    });

    // ✅ Send the AI response back to the frontend
    res.json(result.data);

    /*
      🔹 How the frontend will receive this:
      1. The frontend makes a POST request to this API with approvedText.
      2. This function sends the text to the AI model and gets the response.
      3. The response is returned as JSON (result.data).
      4. On the frontend, you can use fetch/axios like:

         const res = await fetch("/submit_text_to_chat", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ approvedText: "Hello AI!" })
         });

         const data = await res.json();
         console.log(data); // <-- This will show the AI's reply
    */
  } catch (err) {
    console.error("Error in texToAi:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default texToAi;