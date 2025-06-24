/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Conversation } from "@/components/conversation";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { Toaster } from "sonner";
import { Inter, Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

type AgentType = "declaration" | "comite" | "investisseurs";

interface Agent {
  id: AgentType;
  title: string;
  description: string;
  icon?: string;
  image?: string;
  firstMessage: string;
  iconBgClass?: string;
}

const agents: Agent[] = [
  {
    id: "declaration",
    title: "Formation Prise de Parole",
    description:
      "Maîtrisez votre discours et répondez aux questions avec confiance",
    icon: "material-symbols:mic-rounded",
    firstMessage:
      "Bonjour, vous avez la parole pour votre présentation. Prenez votre temps.",
  },
  {
    id: "comite",
    title: "Négociation & Persuasion",
    description: "Développez vos techniques de persuasion et négociation",
    icon: "material-symbols:handshake-rounded",
    iconBgClass: "bg-blue-50",
    firstMessage: "Bonjour, présentez-nous votre position et vos arguments.",
  },
  {
    id: "investisseurs",
    title: "Débat & Argumentation",
    description: "Affûtez vos compétences argumentatives face aux objections",
    icon: "material-symbols:forum-rounded",
    firstMessage:
      "Bonjour, défendez votre point de vue et répondez aux contre-arguments.",
  },
];

export default function Home() {
  const [selectedAgent, setSelectedAgent] = useState<AgentType | null>(null);

  const handleBack = () => {
    setSelectedAgent(null);
  };

  if (selectedAgent) {
    return <Conversation agentType={selectedAgent} onBack={handleBack} />;
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 ${inter.variable} ${poppins.variable}`}
    >
      <Toaster position="top-center" />

      {/* Hero Section */}
      <div className="victor-gradient text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <header className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-4">
              <img
                src="https://media.licdn.com/dms/image/v2/D4E03AQHcwKNPXEk7aQ/profile-displayphoto-shrink_800_800/B4EZbYBxJVHcAc-/0/1747381064790?e=1756339200&v=beta&t=XMqdL3p4LcSx_bXhomKNhibaH-9RAeu_-wjW394r5oA"
                alt="Victor Ferry"
                width={60}
                height={60}
                className="rounded-full border-3 border-white shadow-lg"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white">
                    Victor Ferry
                  </h1>
                  <Icon
                    icon="material-symbols:verified-rounded"
                    className="text-white text-xl"
                  />
                </div>
                <p className="text-blue-100 text-sm">
                  Expert en Rhétorique & Communication
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Icon
                icon="material-symbols:send-rounded"
                className="text-white text-2xl"
              />
            </div>
          </header>

          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto">
            <motion.h2
              className="text-5xl md:text-6xl font-bold mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Rejoignez le canal des{" "}
              <span className={`${poppins.className} font-poppins italic`}>
                créateurs
              </span>
            </motion.h2>
            <motion.p
              className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Développez votre éloquence et maîtrisez l'art de la rhétorique
              avec des formations interactives personnalisées.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center gap-6 text-blue-100"
            >
              <div className="flex items-center gap-2">
                <Icon
                  icon="material-symbols:schedule-rounded"
                  className="text-lg"
                />
                <span className="text-sm">Sessions de 15 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon
                  icon="material-symbols:analytics-rounded"
                  className="text-lg"
                />
                <span className="text-sm">Analyse personnalisée</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <motion.h3
            className="text-4xl font-bold mb-4 victor-gradient-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Choisissez votre{" "}
            <span className={`${poppins.className} font-poppins italic`}>
              Formation
            </span>
          </motion.h3>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Trois modules complémentaires pour développer toutes les facettes de
            votre communication.
          </motion.p>
        </div>

        {/* Agent cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -5 }}
              className="h-full"
            >
              <Card
                className="h-full cursor-pointer transition-all duration-300 victor-card hover:victor-card rounded-2xl overflow-hidden"
                onClick={() => setSelectedAgent(agent.id)}
              >
                <CardHeader className="text-center pb-4 bg-gradient-to-b from-blue-50 to-white">
                  <div className="w-16 h-16 victor-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Icon icon={agent.icon!} className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                    {agent.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm leading-relaxed">
                    {agent.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-4">
                  <Button
                    className="w-full victor-gradient hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                    size="lg"
                  >
                    Commencer la formation
                    <Icon
                      icon="material-symbols:arrow-forward-rounded"
                      className="ml-2 text-lg"
                    />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Footer Section */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center justify-center gap-4 mb-6">
              <img
                src="https://media.licdn.com/dms/image/v2/D4E03AQHcwKNPXEk7aQ/profile-displayphoto-shrink_800_800/B4EZbYBxJVHcAc-/0/1747381064790?e=1756339200&v=beta&t=XMqdL3p4LcSx_bXhomKNhibaH-9RAeu_-wjW394r5oA"
                alt="Victor Ferry"
                width={48}
                height={48}
                className="rounded-full"
              />
              <div className="text-left">
                <h4 className="font-semibold text-gray-800">Victor Ferry</h4>
                <p className="text-sm text-gray-600">
                  Docteur en Philosophie, Expert en Rhétorique
                </p>
              </div>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto italic">
              "La rhétorique n'est pas l'art de manipuler, c'est l'art de
              convaincre avec éthique et élégance."
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
