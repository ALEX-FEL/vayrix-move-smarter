
# Plan — Application passager VAYRIX complète (mock)

Objectif : rendre l'app entièrement navigable et démontrable sans backend, avec une architecture prête à recevoir de vraies API plus tard. Aucun Firebase / Supabase / API réelle. Toutes les notifications passent par toast / sheet / modal.

## 1. Architecture code (nouveau)

```text
src/
  mocks/            données brutes (fixtures JSON-like TS)
    drivers.ts, rides.ts, places.ts, payments.ts,
    shared-rides.ts, user.ts, emergency-contacts.ts
  models/           types métier (Driver, Ride, Place, Payment, ...)
  services/         couche "API" mock (async + latence + erreurs simulées)
    ride.service.ts, driver.service.ts, payment.service.ts,
    shared.service.ts, safety.service.ts, user.service.ts, history.service.ts
  repositories/     agrège services + cache/local state (index unique)
  hooks/            useRideFlow, useSafety, useSOS, useDriverTracking,
                    useSharedRides, usePayment, useHistory, useProfile
  providers/        RideProvider, SafetyProvider, UserProvider (React context)
  lib/
    async.ts        delay(), maybeFail() pour simuler latence/erreurs
    query-states.ts helpers loading/success/empty/error
```

Chaque service renvoie des `Promise<T>` avec `delay(400–1200ms)` et un `maybeFail()` optionnel — remplaçable 1-pour-1 par `fetch()`.

## 2. Écrans à créer / compléter

Nouveaux fichiers de routes (TanStack, plats) :
- `booking.pickup.tsx` — étape 1 départ
- `booking.destination.tsx` — étape 2 destination
- `booking.estimate.tsx` — étape 3 distance/durée/prix + choix véhicule (Moto / Classic / Premium)
- `booking.negotiate.tsx` — étape négociation (accepter / proposer prix) avec états accepté/refusé/contre-proposition
- `shared.tsx` — recherche courses compatibles
- `shared.$rideId.tsx` — détail + demande (en attente / accepté / refusé)
- `sos.tsx` — écran plein bouton SOS + confirmations
- `rating.tsx` — étoiles + commentaire (après completed)
- `profile.edit.tsx` — édition photo/nom/tel/email/langue
- `profile.emergency.tsx` — CRUD contacts d'urgence

Routes existantes à enrichir :
- `home.tsx` : ajouter boutons "Partager une course" + toggle "Mode sécurité" + accès profil + historique récent (3 dernières)
- `booking.tsx` : devient un simple redirecteur vers `booking.pickup`
- `driver-found.tsx` : consomme `driver.service.getMatchedDriver()` avec loading/empty
- `tracking.tsx` : ETA simulé qui décroît, bouton appel (toast "Appel simulé"), bouton SOS flottant, badge "Sécurité active" si activée, alertes IA (toast selon niveau risque bas/moyen/élevé)
- `payment.tsx` : choix Espèces / Mobile Money, simulate success/failure (bottom sheet reçu)
- `completed.tsx` : résumé (distance/durée/prix/économie) + CTA vers rating
- `history.tsx` : onglets Classiques / Partagées / Paiements + recherche + état vide

## 3. Notifications (jamais de page dédiée)

- `sonner` toast pour succès/erreurs courtes (paiement, appel, SOS déclenché, alerte IA)
- Bottom sheet (composant `<Sheet>`) pour : reçu paiement, confirmation SOS, détails négociation
- Modal (`<Dialog>`) pour confirmations destructives (annuler course, désactiver sécurité pendant course)
- Alerte contextuelle inline (bandeau coloré) pour état sécurité en course

## 4. États systématiques

Chaque écran data-driven affiche via un helper `<QueryView>` :
- loading : skeleton
- success : contenu
- empty : illustration + message
- error : message + bouton retry

## 5. Flux Mode Sécurité + SOS

- `SafetyProvider` (context) : `active`, `riskLevel`, `startMonitoring()`, `stop()`, `triggerSOS()`
- Pendant `tracking`, si actif : simule évolution risque toutes ~8s (low → med → high aléatoire pondéré), déclenche toast + change couleur bandeau
- SOS : bottom sheet listant simulations (Partage GPS envoyé ✓, Admin alertée ✓, Contacts prévenus ✓) avec délais échelonnés

## 6. Partage de course

Service `shared.service.ts` retourne 3-5 courses compatibles mock. Flow : liste → détail → demande → écran d'attente animé → résultat accepté/refusé (mock aléatoire pondéré) → si accepté, retour vers tracking classique avec badge "Course partagée".

## 7. Design / contraintes UI

- Conserve dark theme #0A0E27 / cards #141B3D / gradient #3B6BFF→#7B5CFF
- Cards radius 16px, buttons h-12, gradient CTA sur action principale, pas d'emoji
- Réutilise `AppShell`, `PhoneFrame`, `MapBg` existants

## 8. Livraison

Un seul batch d'implémentation : création de `mocks/`, `models/`, `services/`, `providers/`, hooks, puis toutes les nouvelles routes, puis mise à jour des routes existantes. Vérification TypeScript à la fin, plus une passe Playwright rapide sur `/home → /booking/* → /tracking → /completed → /rating → /history`.

Aucun changement d'infrastructure (pas de nouveau package non-mock ; `sonner` déjà présent).
