import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Check if required environment variables are present
    if (!process.env.OPENROUTER_API_KEY) {
      console.log("OpenRouter API key not found, returning fallback response");
      return NextResponse.json({
        title: "Emergency Report - Manual Entry Required",
        reportType: "Other",
        description: "Image analysis service is not configured. Please provide details manually."
      });
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
      // Extract base64 data from data URL
      const parts = image.split(',');
      if (parts.length !== 2) {
        throw new Error("Invalid data URL format");
      }
      base64Data = parts[1];
    } else {
      // Assume it's raw base64 if no data URL prefix
      base64Data = image;
    }

    // Validate base64 data
    if (!base64Data || base64Data.length < 100) {
      throw new Error("Invalid or too small image data");
    }

    console.log("Sending image analysis request to OpenRouter...");

    const prompt = `You are an emergency response AI analyzing an incident image. 

Analyze this image and provide a JSON response with exactly these fields:
{
  "title": "Brief descriptive title of the incident (max 50 characters)",
  "reportType": "Must be one of: Theft, Fire Outbreak, Medical Emergency, Natural Disaster, Violence, Other",
  "description": "Detailed description of what you observe in the image (2-3 sentences)"
}

Rules:
- Be specific and factual
- Choose the most appropriate reportType from the exact options provided
- If unclear, use "Other" as reportType
- Respond ONLY with valid JSON, no additional text
- Do not include markdown formatting or code blocks`;

    const requestBody = {
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
      max_tokens: 500,
      temperature: 0.1
    };

    console.log("Making request to OpenRouter API...");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "CivicSafe",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    console.log("OpenRouter response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API Error:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("OpenRouter response data:", JSON.stringify(data, null, 2));
    
    if (!data.choices?.[0]?.message?.content) {
      console.error("Invalid response structure:", data);
      throw new Error("Invalid response format from API");
    }

    const content = data.choices[0].message.content.trim();
    console.log("AI response content:", content);
    
    // Valid report types
    const validTypes = ["Theft", "Fire Outbreak", "Medical Emergency", "Natural Disaster", "Violence", "Other"];
    
    try {
      // Clean the content - remove any markdown formatting
      let cleanContent = content;
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/```json\s*/, '').replace(/```\s*$/, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/```\s*/, '').replace(/```\s*$/, '');
      }
      
      console.log("Cleaned content for JSON parsing:", cleanContent);
      
      const jsonResponse = JSON.parse(cleanContent);
      console.log("Parsed JSON response:", jsonResponse);
      
      if (jsonResponse.title && jsonResponse.reportType && jsonResponse.description) {
        // Validate and clean the report type
        const reportType = validTypes.find(type => 
          type.toLowerCase() === jsonResponse.reportType.toLowerCase()
        ) || "Other";
        
        const result = {
          title: String(jsonResponse.title).substring(0, 100), // Limit title length
          reportType: reportType,
          description: String(jsonResponse.description).substring(0, 500) // Limit description length
        };
        
        console.log("Returning successful result:", result);
        return NextResponse.json(result);
      } else {
        console.log("Missing required fields in JSON response");
        throw new Error("Missing required fields in response");
      }
    } catch (jsonError) {
      console.log("JSON parsing failed, attempting text extraction:", jsonError);
      
      // Fallback: Try to extract information from text
      const lines = content.split('\n').map(line => line.trim()).filter(line => line);
      let title = "";
      let reportType = "Other";
      let description = "";

      // Try to extract structured information
      for (const line of lines) {
        const lowerLine = line.toLowerCase();
        
        if (lowerLine.includes('title') && line.includes(':')) {
          const match = line.match(/title["\s]*:\s*["']?([^"',\n]+)["']?/i);
          if (match) title = match[1].trim();
        } else if (lowerLine.includes('reporttype') && line.includes(':')) {
          const match = line.match(/reporttype["\s]*:\s*["']?([^"',\n]+)["']?/i);
          if (match) {
            const extractedType = match[1].trim();
            reportType = validTypes.find(type => 
              type.toLowerCase() === extractedType.toLowerCase()
            ) || "Other";
          }
        } else if (lowerLine.includes('description') && line.includes(':')) {
          const match = line.match(/description["\s]*:\s*["']?([^"'\n]+)["']?/i);
          if (match) description = match[1].trim();
        }
      }

      // If we still don't have good data, generate basic fallback
      if (!title || !description) {
        title = title || "Incident Report";
        description = description || "Emergency situation detected in uploaded image. Please provide additional details.";
      }

      const result = {
        title: title.substring(0, 100),
        reportType: reportType,
        description: description.substring(0, 500)
      };
      
      console.log("Returning fallback result:", result);
      return NextResponse.json(result);
    }

  } catch (error) {
    console.error("Image analysis error:", error);
    
    // Return a meaningful fallback response instead of an error
    const fallbackResult = {
      title: "Emergency Report - " + new Date().toLocaleDateString(),
      reportType: "Other",
      description: "Unable to analyze image automatically. Please provide incident details manually."
    };
    
    console.log("Returning error fallback result:", fallbackResult);
    return NextResponse.json(fallbackResult);
  }
}