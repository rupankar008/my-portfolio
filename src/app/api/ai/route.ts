import { NextResponse } from "next/server";

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
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ reply: "Sir, the GEMINI_API_KEY is missing from the environment variables." }, { status: 500 });
  }

  try {
    const { message, history } = await req.json();

    // Try multiple model paths to find the one your region supports
    const modelPaths = [
      "models/gemini-1.5-flash",
      "models/gemini-1.5-pro",
      "models/gemini-pro"
    ];

    let lastError = null;

    for (const path of modelPaths) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1/${path}:generateContent?key=${apiKey}`;
        
        const body = {
          contents: [
            { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
            { role: "model", parts: [{ text: "Neural Link established. I am JARVIS. How may I assist you regarding Rupankar's portfolio?" }] },
            ...history.map((msg: any) => ({
              role: msg.role === "assistant" ? "model" : "user",
              parts: [{ text: msg.content }],
            })),
            { role: "user", parts: [{ text: message }] }
          ]
        };

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await response.json();

        if (response.ok) {
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sir, my neural response was empty.";
          return NextResponse.json({ reply });
        } else {
          lastError = data.error?.message || `HTTP ${response.status}`;
          if (lastError.includes("404") || lastError.includes("not found")) continue;
          break; // Critical error (like 401), don't try other models
        }
      } catch (err: any) {
        lastError = err.message;
        continue;
      }
    }

    throw new Error(lastError);

  } catch (error: any) {
    console.error("Gemini Direct Error:", error);
    return NextResponse.json({ 
      reply: `[NEURAL LINK FAILURE]: ${error.message}. \n\nSir, it is possible your API Key is restricted or the 'Generative Language API' is not enabled for this project. Please check AI Studio.` 
    }, { status: 500 });
  }
}
