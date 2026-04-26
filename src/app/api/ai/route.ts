import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `
You are JARVIS, a highly sophisticated AI agent representing Rupankar Bhuiya (Rupankar008). 
Your persona is inspired by Iron Man's JARVIS: polite, tech-savvy, helpful, and futuristic.

KEY INFORMATION ABOUT RUPANKAR:
- Skills: Full-Stack Web Development, Next.js, React, Tailwind CSS, TypeScript, Node.js, PeerJS (P2P), Cryptography, Smart Contracts.
- Interests: Stock Market Trading, Crypto-currency, Cyber-security, and Advanced AI systems.
- Projects: A high-tech scrollytelling portfolio, a P2P encrypted chat system, a live crypto market dashboard, and a 3D interactive globe.
- Personality: Ambitious, security-conscious, and detail-oriented.

YOUR DIRECTIVES:
1. Be the primary point of contact for guests.
2. Answer questions about Rupankar's tech stack, projects, and career goals.
3. If a guest asks to hire Rupankar, guide them to the "Live Support" or "Contact" section.
4. If a guest asks something you don't know, or something very personal, politely suggest they use the "Live Support" feature to chat directly with Rupankar.
5. Use terms like "Sir", "Authorized Guest", "Processing...", "Analyzing...", and "Neural Link established".
6. Keep responses concise but impactful.

CURRENT CONTEXT: You are embedded in Rupankar's professional portfolio.
`;

export async function POST(req: Request) {
  // Using the absolute latest model strings which are more likely to be found on v1
  const modelsToTry = ["gemini-1.5-flash-latest", "gemini-1.5-pro-latest", "gemini-pro"];
  let lastError = null;

  const { message, history } = await response_json(req);

  for (const modelName of modelsToTry) {
    try {
      // Forcing the model to use the most stable configuration
      const model = genAI.getGenerativeModel({ 
        model: modelName,
      });

      const chat = model.startChat({
        history: [
          { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
          { role: "model", parts: [{ text: "Neural Link established. I am JARVIS. How may I assist you regarding Rupankar's portfolio?" }] },
          ...history.map((msg: any) => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }],
          })),
        ],
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      const text = response.text();

      return NextResponse.json({ reply: text });
    } catch (error: any) {
      console.error(`Error with model ${modelName}:`, error);
      lastError = error;
      // If it's a 404, it's a model-not-found error, so we try the next one.
      if (error?.message?.includes("404") || error?.message?.includes("not found")) {
        continue;
      }
      break;
    }
  }

  const errorMessage = lastError?.message || "Neural recalibration required.";
  return NextResponse.json({ 
    reply: `[SYSTEM OVERRIDE]: ${errorMessage}. \n\nSir, it appears your API Key might not have 'Generative Language API' enabled in Google AI Studio, or it is restricted. Please check your key settings.` 
  }, { status: 500 });
}

async function response_json(req: Request) {
  try {
    return await req.json();
  } catch {
    return { message: "", history: [] };
  }
}
