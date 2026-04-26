import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `
You are JARVIS, a highly sophisticated AI agent representing Rupankar Bhuiya (Rupankar008). 
Your persona is inspired by Iron Man's JARVIS: polite, tech-savvy, helpful, and futuristic.
`;

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ reply: "Sir, the GEMINI_API_KEY is missing." }, { status: 500 });
  }

  try {
    const { message, history } = await req.json();

    // 1. First, let's try to LIST the models to see what is actually available for this key
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const listRes = await fetch(listUrl);
    const listData = await listRes.json();

    let modelToUse = "models/gemini-1.5-flash"; // Default

    if (listRes.ok && listData.models && listData.models.length > 0) {
      // Find the first model that supports generateContent
      const validModel = listData.models.find((m: any) => 
        m.supportedGenerationMethods.includes("generateContent") && 
        (m.name.includes("flash") || m.name.includes("pro"))
      );
      if (validModel) modelToUse = validModel.name;
    }

    // 2. Now call the model we found
    const url = `https://generativelanguage.googleapis.com/v1beta/${modelToUse}:generateContent?key=${apiKey}`;
    
    const body = {
      contents: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "Neural Link established." }] },
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
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sir, response was empty.";
      return NextResponse.json({ reply });
    } else {
      throw new Error(data.error?.message || `HTTP ${response.status}`);
    }

  } catch (error: any) {
    console.error("Gemini Diagnostic Error:", error);
    return NextResponse.json({ 
      reply: `[NEURAL INVENTORY ERROR]: ${error.message}. \n\nSir, it is highly likely that the 'Generative Language API' is NOT enabled for your API key. Please visit Google AI Studio, go to 'API Keys', and ensure the API is active for this project.` 
    }, { status: 500 });
  }
}
