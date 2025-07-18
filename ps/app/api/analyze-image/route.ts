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

    const prompt = `Analyze this emergency situation image and respond in this exact format without any asterisks or bullet points:
TITLE: Write a clear, brief title
TYPE: Choose one (Theft, Fire Outbreak, Medical Emergency, Natural Disaster, Violence, or Other)
DESCRIPTION: Write a clear, concise description

Do not include any additional text or formatting beyond what is specified above.`;

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
        max_tokens: 1000
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

    const text = data.choices[0].message.content;

    // Improved parsing with multi-line support
    const titleMatch = text.match(/TITLE:\s*([\s\S]+?)\s*TYPE:/);
    const typeMatch = text.match(/TYPE:\s*([\s\S]+?)\s*DESCRIPTION:/);
    const descMatch = text.match(/DESCRIPTION:\s*([\s\S]+)/);

    const title = titleMatch?.[1]?.trim() || "Emergency Report";
    const reportType = typeMatch?.[1]?.trim() || "Other";
    const description = descMatch?.[1]?.trim() || "Emergency situation detected";

    // Validate report type
    const validTypes = ["Theft", "Fire Outbreak", "Medical Emergency", "Natural Disaster", "Violence", "Other"];
    if (!validTypes.includes(reportType)) {
      return NextResponse.json({
        title,
        reportType: "Other",
        description,
        warning: "The reported type was not valid and was set to 'Other'"
      });
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