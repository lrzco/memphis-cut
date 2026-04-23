# 💈 Memphis Cut — Site de Réservation Premium

Site web moderne pour le barbier **Memphis Cut** à Saint-Étienne, avec système de réservation en ligne sécurisé via Supabase.

## ✨ Stack Technique

- **React 19** + **TypeScript** + **Vite 7**
- **Tailwind CSS 4** (thème moderne épuré)
- **Framer Motion** (animations fluides)
- **Supabase** (authentification + base de données)
- **Zod** + **DOMPurify** (validation et sécurité)
- **Lucide React** (icônes)

## 🚀 Installation locale

```bash
# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Remplir VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY

# Lancer en développement
npm run dev

# Build de production
npm run build
```

## 🔐 Configuration Supabase

Voir le fichier [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) pour la configuration complète :
- Création du projet Supabase
- Schéma SQL (tables `profiles` et `reservations`)
- Politiques de sécurité RLS
- Triggers automatiques

## 📦 Déploiement sur Vercel

### Méthode 1 : Via l'interface Vercel

1. Crée un repo Git (instructions ci-dessous)
2. Va sur [vercel.com/new](https://vercel.com/new)
3. Importe ton dépôt GitHub
4. Ajoute les variables d'environnement :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Clique sur **Deploy**

### Méthode 2 : Via la CLI Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

## 🔧 Initialisation Git & GitHub

```bash
# 1. Initialiser le dépôt local
git init

# 2. Ajouter tous les fichiers
git add .

# 3. Premier commit
git commit -m "Initial commit - Memphis Cut website"

# 4. Renommer la branche en main
git branch -M main

# 5. Créer un repo sur GitHub puis lier l'origine
git remote add origin https://github.com/ton-pseudo/memphis-cut.git

# 6. Pousser sur GitHub
git push -u origin main
```

## 🎨 Fonctionnalités

- ✅ Hero immersif avec photo de la devanture
- ✅ Catalogue complet des services (15 prestations)
- ✅ Système de réservation en 4 étapes
- ✅ Authentification Supabase (inscription / connexion)
- ✅ Présentation de l'équipe (4 barbiers)
- ✅ Design responsive mobile-first
- ✅ Animations fluides Framer Motion
- ✅ Sécurité : XSS, CSRF, rate limiting
- ✅ Optimisé SEO

## 📂 Structure

```
src/
├── components/      # Composants React
│   ├── Hero.tsx
│   ├── Services.tsx
│   ├── Team.tsx
│   ├── About.tsx
│   ├── CTA.tsx
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   ├── BookingModal.tsx
│   └── AuthModal.tsx
├── lib/
│   └── supabase.ts  # Client Supabase
├── utils/
│   ├── security.ts  # XSS, CSRF, rate limit
│   └── validation.ts # Schemas Zod
├── App.tsx
└── main.tsx

public/images/       # Logos et photos
```

## 📝 Licence

© 2026 Memphis Cut. Tous droits réservés.
