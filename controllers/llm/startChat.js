import { Client } from "@gradio/client";

export default async function startChat(req, res) {
  try {
    const client = await Client.connect("yj134/investorbhai");

    const result = await client.predict("/start_chat_handler", {});

    res.status(200).json({
      success: true,
      message: "Chat started successfully",
      data: result.data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || "Failed to start chat",
    });
  }
}