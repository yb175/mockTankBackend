import { Client } from "@gradio/client";

async function predict(inputAudio) {
  const audioClient = await Client.connect("yj134/investorbhai");

  // Step 1: Convert audio to text
  const transcription = await audioClient.predict("/convert_audio_to_text", { 
    file: inputAudio, 
  });


  // Step 2: Send text to chat
  const result = await audioClient.predict("/submit_text_to_chat", { 		
    approved_text: transcription.data, 		
    chat_history: [], 
  });

  return result.data;
}

export default predict;

						
