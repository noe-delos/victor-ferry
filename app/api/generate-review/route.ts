/* eslint-disable @typescript-eslint/no-explicit-any */

// app/api/generate-review/route.ts

import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { transcript, agentType } = await request.json();

    if (!transcript) {
      return NextResponse.json(
        { error: "Transcript is required" },
        { status: 400 }
      );
    }

    // Format transcript for better readability in the prompt
    const formattedTranscript = transcript
      .map((entry: any) => {
        const speaker = entry.role === "agent" ? "Formateur" : "Candidat";
        return `${speaker}: ${entry.message}`;
      })
      .join("\n\n");

    // Create the prompt based on agent type
    const contextMap = {
      presse: "une conférence de presse",
      assemblee: "une assemblée générale",
      investisseurs: "une réunion devant des investisseurs",
    };

    const context =
      contextMap[agentType as keyof typeof contextMap] ||
      "un exercice d'expression orale";

    const prompt = `
      Tu es Christophe Pallée, fondateur de "Avec Eloquence" et expert reconnu en éloquence et prise de parole en public. 
      Tu accompagnes depuis 3 ans dirigeants, managers et responsables publics pour développer une communication plus impactante, plus authentique et plus engageante.
      
      Voici la transcription d'un exercice d'entraînement à l'éloquence dans le contexte de ${context}.
      
      Transcription:
      ${formattedTranscript}
      
      En tant qu'expert en éloquence, analyse cet exercice selon les critères suivants :
      
      **CRITÈRES D'ANALYSE ÉLOQUENCE :**
      - **Clarté et articulation** : Prononciation, débit, pauses
      - **Structure du discours** : Introduction, développement, conclusion, transitions
      - **Argumentation** : Logique, exemples, preuves, conviction
      - **Présence scénique** : Confiance, charisme, authenticité
      - **Adaptation au contexte** : Pertinence selon la situation (presse/AG/investisseurs)
      - **Gestion des questions** : Réactivité, précision, esquive diplomatique
      - **Impact émotionnel** : Capacité à toucher, convaincre, engager
      
      **TA MISSION :**
      Fournir une analyse détaillée comme si tu coachais personnellement ce participant, avec des conseils concrets et actionnables pour développer son éloquence.
      
      Présente ta réponse au format JSON avec les champs suivants:
      {
        "score": <note sur 10 basée sur l'éloquence globale>,
        "summary": "<résumé de la performance orale en 150 mots max>",
        "strengths": ["<point fort spécifique à l'éloquence>", "<autre point fort>", ...],
        "weaknesses": ["<point d'amélioration éloquence>", "<autre point à travailler>", ...],
        "advice": ["<conseil concret d'entraînement>", "<exercice pratique>", "<technique spécifique>", ...],
        "detailedAnalysis": "<analyse complète en markdown avec sections : ## Structure du discours, ## Techniques d'éloquence, ## Présence et charisme, ## Recommandations d'entraînement>"
      }
      
      **IMPORTANT :** 
      - Sois bienveillant mais exigeant comme un vrai coach en éloquence
      - Donne des conseils pratiques et des exercices concrets  
      - Utilise le vocabulaire de l'éloquence et de la rhétorique
      - Adapte tes conseils au contexte spécifique de l'exercice
    `;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "Tu es Christophe Pallée, fondateur de 'Avec Eloquence' et expert en éloquence. Tu analyses les performances oratrices avec bienveillance et expertise, donnant des conseils concrets pour développer charisme, présence et impact. Ton approche : 'L'oral, ça s'apprend... et ça se travaille !'",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    // Parse the JSON response
    const resultText = response.choices[0].message.content;

    if (!resultText) {
      throw new Error("Empty response from OpenAI");
    }

    const result = JSON.parse(resultText);

    // Return the review data
    return NextResponse.json({
      success: true,
      review: result,
    });
  } catch (error: any) {
    console.error("Error generating review:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to generate review",
        success: false,
      },
      { status: 500 }
    );
  }
}
