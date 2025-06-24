/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log("🔄 Starting transcription API request");

  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;

    console.log("📁 Audio file received:");
    console.log("  - Name:", audioFile?.name);
    console.log("  - Type:", audioFile?.type);
    console.log("  - Size:", audioFile?.size, "bytes");

    if (!audioFile) {
      console.error("❌ No audio file provided in request");
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      console.error("❌ ElevenLabs API key not configured");
      return NextResponse.json(
        { error: "ElevenLabs API key not configured" },
        { status: 500 }
      );
    }

    console.log("🔑 ElevenLabs API key found");

    // Create form data for ElevenLabs API
    const elevenLabsFormData = new FormData();
    elevenLabsFormData.append("file", audioFile);
    elevenLabsFormData.append("model_id", "scribe_v1");
    elevenLabsFormData.append("language_code", "fr"); // French language
    elevenLabsFormData.append("tag_audio_events", "false"); // Don't tag events like laughter
    elevenLabsFormData.append("diarize", "false"); // Don't annotate speakers

    console.log("📤 Sending request to ElevenLabs API:");
    console.log("  - Endpoint: https://api.elevenlabs.io/v1/speech-to-text");
    console.log("  - Model: scribe_v1");
    console.log("  - Language: fr");

    // Call ElevenLabs Speech to Text API
    const response = await fetch(
      "https://api.elevenlabs.io/v1/speech-to-text",
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
        },
        body: elevenLabsFormData,
      }
    );

    console.log("📥 ElevenLabs API response:");
    console.log("  - Status:", response.status);
    console.log("  - Status Text:", response.statusText);
    console.log("  - Headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ ElevenLabs API error:");
      console.error("  - Status:", response.status);
      console.error("  - Error text:", errorText);

      return NextResponse.json(
        { error: `Failed to transcribe audio: ${response.statusText}` },
        { status: response.status }
      );
    }

    const transcriptionData = await response.json();
    console.log("✅ ElevenLabs API success:");
    console.log(
      "  - Full response:",
      JSON.stringify(transcriptionData, null, 2)
    );
    console.log("  - Text field:", transcriptionData.text);
    console.log(
      "  - Text length:",
      transcriptionData.text?.length || 0,
      "characters"
    );

    const finalResponse = {
      success: true,
      transcript: transcriptionData.text || "",
    };

    console.log("📤 Sending final response to client:", finalResponse);

    return NextResponse.json(finalResponse);
  } catch (error: any) {
    console.error("💥 Server error during transcription:");
    console.error("  - Error message:", error.message);
    console.error("  - Error stack:", error.stack);

    return NextResponse.json(
      { error: error.message || "Failed to transcribe audio" },
      { status: 500 }
    );
  }
}
