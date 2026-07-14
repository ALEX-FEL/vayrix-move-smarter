# Vayrix — Move Smarter

## Présentation

Vayrix est une application web mobile-first dédiée à l’expérience de course urbaine, avec un parcours de réservation, une estimation de prix, un mode sécurité, un suivi de trajet et une logique de trajet partagé. Le projet est actuellement conçu comme une maquette fonctionnelle et une base de travail pour une application de mobilité plus complète.

## Stack technique

Le projet est principalement basé sur :

- TypeScript
- React 19
- TanStack Router
- TanStack Start (SSR)
- React Query
- Vite
- Tailwind CSS
- Radix UI et composants UI personnalisés
- Lucide React pour les icônes
- Cloudflare / Wrangler pour le déploiement

## Structure du projet

```text
src/
  components/       # Composants UI réutilisables et shell de l’application
  hooks/            # Hooks personnalisés
  lib/              # Utilitaires, gestion d’erreurs et helpers
  mocks/            # Données mockées pour simuler l’API
  models/           # Types TypeScript du domaine
  providers/        # Contextes globaux et état applicatif
  routes/           # Pages et vues routées de l’application
  services/         # Couche de services métier et logique d’accès aux données
  router.tsx        # Configuration du router
  server.ts         # Point d’entrée SSR / wrapper serveur
```

## Architecture

L’architecture suit une logique simple et modulaire :

1. Les écrans sont définis dans le dossier routes.
2. Les vues sont rendues via TanStack Router avec une structure de routes déclarative.
3. Les fournisseurs de contexte centralisent l’état global, notamment pour la réservation de trajet et la sécurité.
4. Les services encapsulent la logique de données, même si l’application utilise actuellement des mocks.
5. Les modèles TypeScript servent de contrat clair entre les composants, les providers et les services.

Cette approche permet de séparer :

- l’affichage UI,
- la logique métier,
- l’état applicatif,
- et les données simulées.

## Fonctionnalités principales

- Recherche de point de départ et de destination
- Estimation de prix et sélection de véhicule
- Négociation de prix
- Mode sécurité
- Historique de trajets
- Trajets partagés
- Interface mobile stylée avec un design premium

## Démarrage

### Prérequis

- Node.js
- Bun ou npm

### Installation

```bash
npm install
# ou
bun install
```

### Lancer l’application en développement

```bash
npm run dev
# ou
bun run dev
```

### Construire pour la production

```bash
npm run build
```

## Scripts utiles

- npm run dev : démarre le serveur de développement
- npm run build : génère la version de production
- npm run preview : prévisualise le build
- npm run lint : exécute ESLint
- npm run format : formate le code avec Prettier

## Notes de conception

Le projet utilise actuellement des services mockés pour simuler les appels backend. Les signatures des services sont déjà structurées pour permettre une migration future vers une vraie API sans réécrire toute l’interface.
