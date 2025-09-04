import { Client } from "@gradio/client";

export default async function analyse(req, res) {
    try {
        console.log("Request Body:", req.body); // 👈 ye print karega
        const client = await Client.connect("yj134/analysis");

        const result = await client.predict(
            "/analyze_from_text",
            { json_text: JSON.stringify(req.body.conversation) },
            "/analyze_from_text"
        );

        res.send(result.data);
    } catch (error) {
        console.error("Error in analyse function:", error);
        res.status(500).send({ error: error.message });
    }
}

// async function callAnalyseAPI() {
//   try {
//     const response = await fetch("http://localhost:3000/analyse", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         conversation: [
//           {
//             role: "user",
//             content: "hello ji this is you Bhatia presenting you mocktang"
//           },
//           {
//             role: "System",
//             content: "Thanks for joining us today! We're excited to hear about your startup. What are you building?"
//           },
//           {
//             role: "user",
//             content: "hii"
//           }
//         ]
//       }),
//     });

//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }

//     const data = await response.json();
//     console.log("Analyse API response:", data);
//   } catch (err) {
//     console.error("Error calling analyse API:", err);
//   }
// }