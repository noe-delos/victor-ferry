# Guide de Démarrage Rapide - Avec Éloquence

## 🚀 Installation et Configuration

### 1. Installation des dépendances

```bash
pnpm install
```

### 2. Configuration des variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec le contenu suivant :

```env
# ElevenLabs Configuration
ELEVENLABS_API_KEY=sk_your_elevenlabs_api_key_here

# Agent IDs - Remplacez par vos vrais IDs d'agents ElevenLabs
NEXT_PUBLIC_PRESS_AGENT_ID=agent_id_for_press_conference
NEXT_PUBLIC_ASSEMBLY_AGENT_ID=agent_id_for_general_assembly
NEXT_PUBLIC_INVESTORS_AGENT_ID=agent_id_for_investors_meeting

# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your_openai_api_key_here

# Voice ID (optionnel)
NEXT_PUBLIC_AGENT_VOICE_ID=default_voice_id_if_needed
```

### 3. Ajout des assets

Ajoutez les fichiers suivants :

**Vidéos :** Placez dans `public/videos/`

- `press-1.mp4`, `press-2.mp4`, `press-3.mp4`
- `assembly-1.mp4`, `assembly-2.mp4`, `assembly-3.mp4`
- `investors-1.mp4`, `investors-2.mp4`, `investors-3.mp4`

**Avatars :** Placez dans `public/avatars/`

- `presse.jpg`
- `assemblee.jpg`
- `investisseurs.jpg`

### 4. Lancement de l'application

```bash
pnpm dev
```

L'application sera accessible sur `http://localhost:3000`

## 📋 Checklist de Déploiement

- [ ] Variables d'environnement configurées
- [ ] Agents ElevenLabs créés avec les prompts fournis
- [ ] Vidéos et avatars ajoutés
- [ ] Tests de conversation effectués
- [ ] Analyses IA validées

## 🎯 Fonctionnalités Principales

### Interface Utilisateur

- **Page d'accueil** : Sélection entre 3 types d'agents
- **Page de conversation** : Interface vidéo avec timer 15 minutes
- **Page de résultats** : Analyse détaillée avec scoring et conseils

### Agents Disponibles

1. **Conférence de Presse** - Sophie Dubois (Journaliste)
2. **Assemblée Générale** - Marc Leclerc (Président)
3. **Réunion Investisseurs** - Claire Martin (Directrice Financière)

### Fonctionnalités Techniques

- Intégration ElevenLabs pour conversations vocales
- Transition fluide entre vidéos durant la conversation
- Analyse automatique via OpenAI GPT-4
- Responsive design avec Tailwind CSS
- Animations avec Framer Motion

## 🔧 Dépendances Principales

- **Next.js 15** - Framework React
- **@11labs/react** - SDK ElevenLabs
- **OpenAI** - Analyse et génération de reviews
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **TypeScript** - Typage statique

## 📱 Interface Mobile

L'application est entièrement responsive et optimisée pour :

- Desktop (expérience principale)
- Tablette
- Mobile (interface adaptée)

## 🎨 Personnalisation

### Couleurs

- Couleur principale : `#A02235` (rouge bordeaux Avec Éloquence)
- Utilisée pour les boutons, titres et éléments de marque

### Branding

- Logo : Récupéré depuis LinkedIn (URL dans le code)
- Motto : "L'oral, ça s'apprend... et ça se travaille !"

## 🚨 Points d'Attention

1. **Permissions Caméra/Micro** : L'app demande l'accès dès le lancement
2. **Durée Limitée** : Les conversations s'arrêtent automatiquement à 15 minutes
3. **Qualité Vidéo** : Assurez-vous que les vidéos sont optimisées (format MP4, H.264)
4. **API Limits** : Surveillez les quotas ElevenLabs et OpenAI

## 📊 Métriques et Analyse

L'application génère automatiquement :

- **Score sur 10** basé sur la performance
- **Points forts** identifiés par l'IA
- **Points d'amélioration** avec suggestions
- **Conseils personnalisés** pour progresser
- **Analyse détaillée** en format markdown

## 🔄 Workflow Utilisateur

1. **Accueil** → Choix de l'agent
2. **Préparation** → Activation caméra/micro
3. **Conversation** → 15 minutes max avec l'agent
4. **Fin** → Proposition d'analyse
5. **Résultats** → Consultation du rapport détaillé

## 🛠️ Support et Maintenance

- Consultez `AGENT_SETUP.md` pour la configuration détaillée des agents
- Les logs de conversation sont automatiquement sauvegardés via ElevenLabs
- Les analyses sont générées à la demande et ne sont pas stockées localement
