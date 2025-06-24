/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reviewData, setReviewData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const conversationId = searchParams.get("conversationId");
  const agentType = searchParams.get("agentType");

  useEffect(() => {
    const fetchData = async () => {
      if (!conversationId || !agentType) {
        setError("Paramètres manquants");
        setLoading(false);
        return;
      }

      try {
        // Fetch transcript
        const transcriptResponse = await fetch("/api/get-transcript", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversationId, agentType }),
        });

        if (!transcriptResponse.ok) {
          throw new Error("Impossible de récupérer la transcription");
        }

        const transcriptData = await transcriptResponse.json();

        // Generate review
        const reviewResponse = await fetch("/api/generate-review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transcript: transcriptData.conversationData.transcript,
            agentType,
          }),
        });

        if (!reviewResponse.ok) {
          throw new Error("Impossible de générer l'analyse");
        }

        const reviewResult = await reviewResponse.json();
        setReviewData(reviewResult.review);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [conversationId, agentType]);

  const getAgentInfo = () => {
    switch (agentType) {
      case "presse":
        return {
          title: "Conférence de Presse",
          name: "Christophe Dubois",
          icon: "lucide:newspaper",
        };
      case "assemblee":
        return {
          title: "Assemblée Générale",
          name: "Christophe Leclerc",
          icon: "lucide:users",
        };
      case "investisseurs":
        return {
          title: "Réunion Investisseurs",
          name: "Christophe Martin",
          icon: "lucide:trending-up",
        };
      default:
        return {
          title: "Entraînement",
          name: "Assistant",
          icon: "lucide:user",
        };
    }
  };

  const agentInfo = getAgentInfo();

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-400";
    if (score >= 6) return "text-amber-400";
    return "text-red-400";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 8) return <CheckCircle className="w-6 h-6 text-green-400" />;
    if (score >= 6) return <TrendingUp className="w-6 h-6 text-amber-400" />;
    return <AlertCircle className="w-6 h-6 text-red-400" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#12182A] to-[#242E44] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-300 mx-auto mb-4"></div>
          <p className="text-white/70">Génération de votre analyse...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#12182A] to-[#242E44] text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Erreur</h2>
          <p className="text-white/70 mb-4">{error}</p>
          <Button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-amber-200 to-yellow-500 hover:from-amber-300 hover:to-yellow-600 text-[#12182A] font-medium"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#12182A] to-[#242E44] text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-[#12182A]/80">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/")}
              className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div className="text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">
                Analyse de votre performance
              </h1>
              <p className="text-sm text-white/70">{agentInfo.title}</p>
            </div>

            <div className="flex items-center gap-2">
              <Image
                src="/logo.jpeg"
                alt="Avec Eloquence"
                width={40}
                height={40}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {reviewData && (
          <div className="space-y-8">
            {/* Score card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-b from-[#1c2437] to-[#12182A] border border-white/10 rounded-xl shadow-lg">
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center mb-4">
                    {getScoreIcon(reviewData.score)}
                  </div>
                  <CardTitle className="text-4xl font-bold">
                    <span className={getScoreColor(reviewData.score)}>
                      {reviewData.score}/10
                    </span>
                  </CardTitle>
                  <p className="text-white/70">Note globale</p>
                </CardHeader>
              </Card>
            </motion.div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="bg-gradient-to-b from-[#1c2437] to-[#12182A] border border-white/10 rounded-xl shadow-lg">
                <CardHeader className="border-b border-white/10">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Icon
                      icon="lucide:file-text"
                      className="w-5 h-5 text-amber-300"
                    />
                    Résumé de l'exercice
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-white/80 leading-relaxed">
                    {reviewData.summary}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Strengths and Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="bg-gradient-to-b from-[#1c2437] to-[#12182A] border border-white/10 rounded-xl shadow-lg h-full">
                  <CardHeader className="border-b border-white/10">
                    <CardTitle className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      Points forts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-3">
                      {reviewData.strengths.map(
                        (strength: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-white/80">{strength}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="bg-gradient-to-b from-[#1c2437] to-[#12182A] border border-white/10 rounded-xl shadow-lg h-full">
                  <CardHeader className="border-b border-white/10">
                    <CardTitle className="flex items-center gap-2 text-amber-400">
                      <TrendingUp className="w-5 h-5" />
                      Points à améliorer
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-3">
                      {reviewData.weaknesses.map(
                        (weakness: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-white/80">{weakness}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Advice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-gradient-to-b from-[#1c2437] to-[#12182A] border border-white/10 rounded-xl shadow-lg">
                <CardHeader className="border-b border-white/10">
                  <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">
                    <Icon
                      icon="lucide:lightbulb"
                      className="w-5 h-5 text-amber-300"
                    />
                    Conseils personnalisés
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-4">
                    {reviewData.advice.map((tip: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[#12182A] text-sm font-semibold flex-shrink-0 bg-gradient-to-r from-amber-200 to-yellow-500">
                          {index + 1}
                        </div>
                        <span className="text-white/80">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Detailed Analysis */}
            {reviewData.detailedAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card className="bg-gradient-to-b from-[#1c2437] to-[#12182A] border border-white/10 rounded-xl shadow-lg">
                  <CardHeader className="border-b border-white/10">
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Icon
                        icon="lucide:search"
                        className="w-5 h-5 text-amber-300"
                      />
                      Analyse détaillée d'éloquence
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="prose prose-sm max-w-none text-white/90 leading-relaxed">
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => (
                            <h1 className="text-xl font-bold text-amber-300 mb-4 mt-6 first:mt-0">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-lg font-semibold text-amber-200 mb-3 mt-5 first:mt-0">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-base font-medium text-white mb-2 mt-4">
                              {children}
                            </h3>
                          ),
                          p: ({ children }) => (
                            <p className="text-white/85 mb-3 leading-relaxed">
                              {children}
                            </p>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc ml-5 mb-4 text-white/85">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal ml-5 mb-4 text-white/85">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="mb-1 text-white/85">{children}</li>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold text-amber-200">
                              {children}
                            </strong>
                          ),
                          em: ({ children }) => (
                            <em className="italic text-white/90">{children}</em>
                          ),
                        }}
                      >
                        {reviewData.detailedAnalysis}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                onClick={() => router.push("/")}
                className="px-8 py-3 bg-gradient-to-r from-amber-200 to-yellow-500 hover:from-amber-300 hover:to-yellow-600 text-[#12182A] font-medium"
              >
                Nouvel entraînement
              </Button>
            </motion.div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center text-white/50">
            <p>&copy; 2025 Avec Éloquence. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#12182A] to-[#242E44] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-300 mx-auto mb-4"></div>
        <p className="text-white/70">Chargement...</p>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResultsContent />
    </Suspense>
  );
}
