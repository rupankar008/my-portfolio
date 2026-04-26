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
  try {
    const { message, history } = await response_json(req);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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
    console.error("Gemini Error:", error);
    const errorMessage = error?.message || "Neural recalibration required.";
    return NextResponse.json({ reply: `[DIAGNOSTIC ERROR]: ${errorMessage}. Please ensure GEMINI_API_KEY is correct in Vercel.` }, { status: 500 });
  }
}

async function response_json(req: Request) {
  return await req.json();
}
