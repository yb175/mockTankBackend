import { Client } from "@gradio/client";
export default async function startChat(req, res) {
    const client = await Client.connect("yj134/investorbhai");
    const result = await client.predict("/start_chat_handler", { 
    });
   res.send(result.data); 
}