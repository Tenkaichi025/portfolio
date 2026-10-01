# RAPPORT — Portfolio Wilfried Miezan

## Objectif du projet
Portfolio professionnel de Junior Wilfried Miezan, développeur web basé à Abidjan : présenter ses projets, sa méthode et convertir les visiteurs en prises de contact (WhatsApp en priorité). Positionnement : développeur web qui utilise l'IA comme outil de productivité, pas « vibecoder ».

## Stack & Technologies
- HTML5 statique, JavaScript natif (aucun framework)
- Tailwind CSS 3.4.17 (CSS précompilé, pas de CDN)
- Icônes SVG Lucide intégrées (MIT), polices Google Fonts (Space Grotesk, Inter, JetBrains Mono)

## Architecture & Structure clé
```
index.html          HTML de la page (une seule page)
js/config.js        Contenus modifiables : WA_NUMBER, PRODUCT (démo), STACK, PROJECTS
js/main.js          Logique : menu mobile, carrousel 3D, timeline, simulateur WhatsApp, formulaire
src/input.css       Source CSS (directives Tailwind + styles perso)
css/style.css       CSS généré (ne pas éditer à la main)
tailwind.config.js  Thème (couleurs ink/lime/wa/violet, polices)
favicon.svg, favicon-32.png, apple-touch-icon.png   Favicon « WM »
```

## Fonctionnalités développées & Restantes
**Faites :** Hero, carrousel 3D des projets (données `PROJECTS`), démo interactive de boutique WhatsApp (commande pré-remplie), À propos + timeline animée « Ma philosophie », Méthode (4 étapes), Stack en bandeau défilant, Contact (WhatsApp, téléphone, e-mail, formulaire → WhatsApp), menu mobile, responsive 320 → 1440 px, favicon.

**Restantes :**
- Remplacer les 2 projets d'exemple de `PROJECTS` par les vrais projets (+ captures dans `img/`)
- Confirmer ou retirer les stats Hero non vérifiées (« dès 72h », « Lighthouse visé 90+ »)
- Image Open Graph (1200×630), URL canonique, sitemap.xml, robots.txt, page 404
- Déploiement (Vercel/Netlify) puis mesure Lighthouse réelle

## Dernières modifications importantes
- Repositionnement éditorial (suppression de « Vibecoder », IA présentée comme outil)
- Séparation du fichier unique en HTML / CSS / JS + build Tailwind
- Projet client #2 supprimé ; boutique WhatsApp présentée comme exemple/démo
- Passe responsive complète (menu mobile, cibles tactiles ≥ 40 px, espacements mobiles)
- Coordonnées réelles (WhatsApp, téléphone, e-mail) et favicon

## Problèmes rencontrés & Solutions
- CDN Tailwind bloqué sur le réseau local → CSS compilé et servi en local
- `npm` injoignable (ECONNRESET vers registry.npmjs.org) → build via l'exécutable Tailwind autonome
- La couleur `violet` personnalisée écrasait la palette Tailwind → `{ ...colors.violet, DEFAULT }`
- Effets `:hover` « bloqués » au toucher → limités à `@media (hover: hover)`

## Dépendances & Commandes clés
```
npm install        # une fois (devDependency : tailwindcss 3.4.17)
npm run build      # régénère css/style.css (minifié)
npm run dev        # régénération automatique pendant le développement
```
Sans npm : `tailwindcss-windows-x64.exe -i src/input.css -o css/style.css --minify` (v3.4.17).
À relancer après tout ajout de classe Tailwind dans `index.html` ou `js/`.

## Variables d'environnement
Aucune (site statique). Les coordonnées de contact publiques sont dans `js/config.js` et `index.html`.

## État actuel & Prochaines étapes
Site fonctionnel et responsive, prêt à recevoir les vrais projets. Prochaines étapes : contenu réel de `PROJECTS`, image Open Graph, déploiement, mesure Lighthouse.
