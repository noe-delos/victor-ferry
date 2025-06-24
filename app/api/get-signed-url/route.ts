import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("🔄 Starting get-signed-url API request");

  try {
    // Récupérer le type d'agent de la requête
    const data = await request.json();
    const { agentType, transcript } = data;

    console.log("📋 Request data:");
    console.log("  - agentType:", agentType);
    console.log("  - transcript provided:", !!transcript);
    console.log("  - transcript length:", transcript?.length || 0);

    // Sélectionner l'agent ID approprié en fonction du type d'agent
    let agentId: string | undefined;

    switch (agentType) {
      case "declaration":
        agentId = process.env.DECLARATION_AGENT_ID;
        break;
      case "questions-reponses":
        // Use the same declaration agent for questions phase
        agentId = process.env.DECLARATION_AGENT_ID;
        break;
      case "comite":
        agentId = process.env.COMITE_AGENT_ID;
        break;
      case "investisseurs":
        agentId = process.env.INVESTORS_AGENT_ID;
        break;
      default:
        console.warn(
          `⚠️ Unknown agentType: ${agentType}, using declaration agent as fallback`
        );
        agentId = process.env.DECLARATION_AGENT_ID;
    }

    console.log("🤖 Selected agent ID:", agentId);
    console.log("🤖 Agent type:", agentType);

    if (!agentId) {
      console.error("❌ No agent ID found for agentType:", agentType);
      console.error(
        "❌ Missing environment variables. Please add to your .env file:"
      );
      console.error("❌ ELEVENLABS_API_KEY=your_api_key");
      console.error("❌ DECLARATION_AGENT_ID=your_declaration_agent_id");
      console.error("❌ COMITE_AGENT_ID=your_comite_agent_id");
      console.error("❌ INVESTORS_AGENT_ID=your_investors_agent_id");

      // List the specific missing variable
      const missingVar = (() => {
        switch (agentType) {
          case "declaration":
          case "questions-reponses":
            return "DECLARATION_AGENT_ID";
          case "comite":
            return "COMITE_AGENT_ID";
          case "investisseurs":
            return "INVESTORS_AGENT_ID";
          default:
            return "DECLARATION_AGENT_ID";
        }
      })();

      return NextResponse.json(
        {
          error: `Missing environment variable: ${missingVar}`,
          details: `Please add ${missingVar}=your_agent_id to your .env file`,
          agentType,
          expectedVariable: missingVar,
        },
        { status: 400 }
      );
    }

    // Clé API ElevenLabs depuis les variables d'environnement
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      console.log("⚠️ No API key provided, using direct agent ID");
      // Utilisation directe sans authentification si aucune clé API n'est fournie
      return NextResponse.json({
        directUse: true,
        agentId,
        transcript, // Pass transcript back to client for dynamic variables
      });
    }

    console.log("🔑 API key found, getting signed URL from ElevenLabs");

    // Construire l'URL simple sans paramètres de transcript
    const url = `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`;

    console.log("📤 Requesting signed URL from:", url);

    // Obtenir l'URL signée depuis ElevenLabs
    const response = await fetch(url, {
      headers: {
        "xi-api-key": apiKey,
      },
    });

    console.log("📥 ElevenLabs response:");
    console.log("  - Status:", response.status);
    console.log("  - Status Text:", response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ ElevenLabs API error:");
      console.error("  - Status:", response.status);
      console.error("  - Error text:", errorText);
      throw new Error(
        `Failed to get signed URL: ${response.status} ${response.statusText}`
      );
    }

    const responseData = await response.json();
    console.log("✅ Successfully got signed URL");

    const finalResponse = {
      signedUrl: responseData.signed_url,
      transcript, // Pass transcript back to client for dynamic variables
    };

    console.log("📤 Sending response to client");
    return NextResponse.json(finalResponse);
  } catch (error) {
    console.error("💥 API error:", error);
    return NextResponse.json(
      { error: "Failed to generate signed URL" },
      { status: 500 }
    );
  }
}
