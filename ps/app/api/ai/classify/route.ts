import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// Define type for OpenRouter model
interface OpenRouterModel {
  id: string;
  name: string;
  description: string;
}

const VALID_MODELS: string[] = [
  "anthropic/claude-3-haiku",
  "google/palm-2-chat-bison",
  "meta-llama/llama-3-70b-instruct",
  "openchat/openchat-7b",
  "gpt-3.5-turbo"
];

const VALID_DEPARTMENTS: string[] = [
  "Fire",
  "Medical",
  "Police",
  "Traffic",
  "Crime",
  "Disaster",
  "Other"
];

export async function POST(req: NextRequest) {
  try {
    // Check if required environment variables are present
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { 
          department: "Other",
          error: "Classification service not configured"
        },
        { status: 503 }
      );
    }

    const { description } = await req.json();

    if (!description) {
      return NextResponse.json(
        { error: "Missing description" },
        { status: 400 }
      );
    }

    // Get available models with proper typing
    const modelsResponse = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
      }
    });
    
    if (!modelsResponse.ok) {
      throw new Error("Failed to fetch available models");
    }
    
    const modelsData: { data: OpenRouterModel[] } = await modelsResponse.json();
    const availableModels: string[] = modelsData.data.map(
      (model: OpenRouterModel) => model.id
    );

    // Add explicit type to parameter
    const model = VALID_MODELS.find((m: string) => availableModels.includes(m)) || 
                 availableModels.find((m: string) => m.includes('gpt')) || 
                 availableModels[0];

    if (!model) {
      throw new Error("No compatible models available");
    }

    // Make classification request
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": `${process.env.NEXT_PUBLIC_SITE_URL || ""}`,
        "X-Title": `${process.env.NEXT_PUBLIC_SITE_NAME || "CivicSafe"}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [{
          role: "user",
          content: `Classify this emergency report for Bangladesh's 999 service. Strictly respond ONLY with one of these department names: ${VALID_DEPARTMENTS.join(", ")}. Description: ${description}`
        }],
        temperature: 0.1,
        max_tokens: 20
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    // Validate response structure
    const department = data.choices?.[0]?.message?.content?.trim();
    
    if (!department) {
      throw new Error("Invalid response structure from AI model");
    }

    // Sanitize and validate department
    const cleanDepartment = department.replace(/[^a-zA-Z]/g, '');
    const matchedDepartment = VALID_DEPARTMENTS.find(dept => 
      dept.toLowerCase() === cleanDepartment.toLowerCase()
    ) || 'Other';

    return NextResponse.json({ 
      department: matchedDepartment 
    });

  } catch (error) {
    console.error("Classification error:", error);
    return NextResponse.json(
      { 
        department: "Other",
        error: "Classification failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}