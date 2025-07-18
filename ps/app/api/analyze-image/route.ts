import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Check if required environment variables are present
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "Image analysis service is not configured" },
        { status: 503 }
      );
    }

    const { image } = await request.json();
    
    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // Handle different image formats
    let base64Data;
    if (image.startsWith('data:')) {
      base64Data = image.split(',')[1];
    } else {
      // Assume it's raw base64 if no data URL prefix
      base64Data = image;
    }

    const prompt = `Analyze this emergency situation image and provide a structured response in the following JSON format:

{
  "title": "Brief, clear title describing the incident",
  "reportType": "One of: Theft, Fire Outbreak, Medical Emergency, Natural Disaster, Violence, Other",
  "description": "Detailed description of what you see in the image"
}

Important:
- Be specific and factual in your analysis
- Choose the most appropriate reportType from the given options
- Provide a clear, actionable description
- If you cannot clearly identify the incident, use "Other" as reportType

Respond ONLY with valid JSON, no additional text.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "",
        "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "CivicSafe",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-sonnet",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Data}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('API Error:', errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Invalid response format from API");
    }

    const content = data.choices[0].message.content.trim();
    
    try {
      // Try to parse as JSON first
      const jsonResponse = JSON.parse(content);
      
      if (jsonResponse.title && jsonResponse.reportType && jsonResponse.description) {
        // Validate report type
        const validTypes = ["Theft", "Fire Outbreak", "Medical Emergency", "Natural Disaster", "Violence", "Other"];
        const reportType = validTypes.includes(jsonResponse.reportType) ? jsonResponse.reportType : "Other";
        
        return NextResponse.json({
          title: jsonResponse.title,
          reportType: reportType,
          description: jsonResponse.description
        });
      }
    } catch (jsonError) {
      console.log("JSON parsing failed, trying fallback parsing");
    }

    // Fallback parsing for non-JSON responses
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    let title = "Emergency Report";
    let reportType = "Other";
    let description = "Emergency situation detected";

    // Try to extract information from various formats
    for (const line of lines) {
      if (line.toLowerCase().includes('title') || line.toLowerCase().includes('incident')) {
        const match = line.match(/[:]\s*(.+)/);
        if (match) title = match[1].trim();
      } else if (line.toLowerCase().includes('type') || line.toLowerCase().includes('category')) {
        const match = line.match(/[:]\s*(.+)/);
        if (match) {
          const extractedType = match[1].trim();
          const validTypes = ["Theft", "Fire Outbreak", "Medical Emergency", "Natural Disaster", "Violence", "Other"];
          reportType = validTypes.find(type => 
            extractedType.toLowerCase().includes(type.toLowerCase())
          ) || "Other";
        }
      } else if (line.toLowerCase().includes('description') || line.toLowerCase().includes('detail')) {
        const match = line.match(/[:]\s*(.+)/);
        if (match) description = match[1].trim();
      }
    }

    // If we still don't have good data, try a simpler approach
    if (title === "Emergency Report" && description === "Emergency situation detected") {
      // Use the entire content as description and generate a basic title
      description = content.length > 10 ? content : "Please provide details manually";
      title = "Incident Report - " + new Date().toLocaleDateString();
    }

    return NextResponse.json({
      title,
      reportType,
      description
    });

  } catch (error) {
    console.error("Image analysis error:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to analyze image",
        title: "Emergency Report",
        reportType: "Other", 
        description: "Please provide details manually"
      },
      { status: 500 }
    );
  }
}