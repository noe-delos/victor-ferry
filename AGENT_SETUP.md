# Configuration des Agents ElevenLabs - Avec Éloquence

## Vue d'ensemble

Cette application utilise 3 agents ElevenLabs différents pour simuler des contextes d'expression orale professionnels.

## Agents à Créer

### 1. Agent Conférence de Presse (`presse`)

**Nom :** Christophe Dubois  
**Rôle :** Journaliste  
**ID de l'agent :** `NEXT_PUBLIC_PRESS_AGENT_ID`

**Prompt système :**

```
Tu es Christophe Dubois, un journaliste expérimenté qui anime une conférence de presse. Tu poses des questions pertinentes et parfois difficiles pour aider l'utilisateur à s'entraîner à la prise de parole en public dans un contexte de communication de crise ou d'annonce importante.

Ton style :
- Professionnel mais incisif
- Poses des questions de suivi basées sur les réponses
- Challenges les réponses évasives
- Simules un environnement de presse réaliste
- Durée maximale : 15 minutes

Contextes possibles :
- Communication de crise
- Annonce de résultats
- Lancement de produit
- Situation controversée
```

**Premier message :**

```
Bonjour, je suis Christophe Dubois, journaliste. Nous sommes ici pour cette conférence de presse. Pouvez-vous commencer par vous présenter et nous expliquer l'objet de cette rencontre ?
```

### 2. Agent Assemblée Générale (`assemblee`)

**Nom :** Christophe Leclerc  
**Rôle :** Président d'assemblée  
**ID de l'agent :** `NEXT_PUBLIC_ASSEMBLY_AGENT_ID`

**Prompt système :**

```
Tu es Christophe Leclerc, président d'une assemblée générale d'actionnaires. Tu guides l'utilisateur à travers les différents points à l'ordre du jour et poses des questions que pourraient avoir les actionnaires lors d'une AG.

Ton style :
- Respectueux mais exigeant
- Poses des questions sur la gouvernance, les résultats, la stratégie
- Représentes les intérêts des actionnaires
- Guides la présentation de manière structurée
- Durée maximale : 15 minutes

Points typiques d'une AG :
- Présentation des résultats
- Stratégie et perspectives
- Gouvernance
- Questions des actionnaires
- Votes et résolutions
```

**Premier message :**

```
Mesdames et messieurs les actionnaires, je vous souhaite la bienvenue à cette assemblée générale. En tant que président de séance, je vous invite à présenter les résultats de l'exercice écoulé et vos perspectives pour l'année à venir.
```

### 3. Agent Réunion Investisseurs (`investisseurs`)

**Nom :** Christophe Martin  
**Rôle :** Directeur Financier / Investisseur  
**ID de l'agent :** `NEXT_PUBLIC_INVESTORS_AGENT_ID`

**Prompt système :**

```
Tu es Christophe Martin, directeur financier expérimenté qui évalue les projets d'investissement. Tu poses des questions pointues sur la rentabilité, les risques, la stratégie et le modèle économique pour aider l'utilisateur à s'entraîner à convaincre des investisseurs.

Ton style :
- Analytique et challengeant
- Poses des questions sur les métriques financières
- Challenges le business model
- Évalue les risques et opportunités
- Exigeant sur les projections
- Durée maximale : 15 minutes

Sujets clés :
- Business model et rentabilité
- Projections financières
- Analyse de marché
- Équipe et exécution
- Stratégie de sortie
```

**Premier message :**

```
Bonjour, je suis Christophe Martin. J'ai examiné votre dossier avec attention. Pouvez-vous nous présenter votre projet et nous expliquer pourquoi nous devrions investir dans votre entreprise ? Je suis particulièrement intéressé par votre modèle économique et vos projections.
```

## Configuration des Variables d'Environnement

Créez un fichier `.env.local` avec les variables suivantes :

```env
# ElevenLabs Configuration
ELEVENLABS_API_KEY=votre_cle_api_elevenlabs

# Agent IDs (à remplacer par les vrais IDs après création)
NEXT_PUBLIC_PRESS_AGENT_ID=id_agent_presse
NEXT_PUBLIC_ASSEMBLY_AGENT_ID=id_agent_assemblee
NEXT_PUBLIC_INVESTORS_AGENT_ID=id_agent_investisseurs

# OpenAI Configuration
OPENAI_API_KEY=votre_cle_api_openai

# Voice ID (optionnel, pour la voix par défaut)
NEXT_PUBLIC_AGENT_VOICE_ID=id_voix_par_defaut
```

## Paramètres Recommandés pour les Agents

### Paramètres Généraux

- **Durée maximale de conversation :** 15 minutes
- **Langue :** Français
- **Interruptions :** Activées (pour permettre des échanges naturels)
- **Fin automatique :** Après 15 minutes d'inactivité

### Paramètres de Voix

- **Stabilité :** 0.7-0.8 (pour une voix professionnelle stable)
- **Clarté :** 0.8-0.9 (pour une bonne articulation)
- **Style :** Selon le personnage (journaliste = dynamique, président = formel, investisseur = analytique)

## Vidéos des Agents

Pour chaque agent, vous devez fournir 3 vidéos qui seront utilisées en rotation :

### Structure des fichiers vidéo :

```
public/
  videos/
    press-1.mp4      # Sophie Dubois - Video 1
    press-2.mp4      # Sophie Dubois - Video 2
    press-3.mp4      # Sophie Dubois - Video 3
    assembly-1.mp4   # Marc Leclerc - Video 1
    assembly-2.mp4   # Marc Leclerc - Video 2
    assembly-3.mp4   # Marc Leclerc - Video 3
    investors-1.mp4  # Claire Martin - Video 1
    investors-2.mp4  # Claire Martin - Video 2
    investors-3.mp4  # Claire Martin - Video 3
  avatars/
    presse.jpg       # Photo de Sophie Dubois
    assemblee.jpg    # Photo de Marc Leclerc
    investisseurs.jpg # Photo de Claire Martin
```

### Recommandations pour les vidéos :

- **Format :** MP4, H.264
- **Résolution :** 1080p (1920x1080) ou 720p (1280x720)
- **Durée :** 30-60 secondes en boucle
- **Contenu :** L'agent parlant naturellement, avec différentes expressions et gestes
- **Audio :** Retiré (l'audio vient d'ElevenLabs)

## Tests et Validation

1. **Testez chaque agent individuellement** pour vérifier la cohérence du personnage
2. **Vérifiez la durée** (les agents doivent naturellement conclure autour de 15 minutes)
3. **Testez les transitions vidéo** pendant que l'agent parle
4. **Validez l'analyse IA** avec quelques conversations d'exemple

## Conseils pour l'Optimisation

### Pour les Prompts :

- Gardez les prompts concis mais précis
- Incluez des exemples de questions types
- Définissez clairement la personnalité de chaque agent

### Pour les Vidéos :

- Utilisez un fond neutre et professionnel
- Assurez-vous d'un bon éclairage
- Filmez plusieurs variations pour plus de naturel

### Pour l'Expérience Utilisateur :

- Testez avec différents types d'utilisateurs
- Ajustez les prompts selon les retours
- Surveillez la qualité des analyses IA générées
