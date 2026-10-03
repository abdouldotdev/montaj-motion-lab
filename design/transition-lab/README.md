# Montaj — Motion Lab

Aperçu interactif : vidéo de 60,83 secondes compressée en 720p. Les effets sont calculés dans le navigateur ; ils ne sont pas incrustés dans le MP4 source.

## Collection

| Transition | Coupe | Durée à 30 ips | Type |
| --- | ---: | ---: | --- |
| Face Match | 4 s | 4 images | Proposition initiale |
| Geste continu | 9 s | 6 images | Proposition initiale |
| Main devant l’objectif | 14 s | 12 images | Proposition initiale, geste simulé |
| Découpe du personnage | 19 s | 14 images | Proposition initiale |
| Écho figé | 24 s | 10 images | Proposition initiale |
| Mot-pivot | 29 s | 12 images | Proposition initiale |
| Blink cut | 35,4667 s | 4 images | Proposition initiale, clignement réel |
| Décor en retard | 39 s | 16 images | Concept original Montaj |
| Passe-muraille | 44 s | 18 images | Concept original Montaj |
| Onde de verre | 49 s | 14 images | Concept original Montaj |
| Gravité inversée | 55 s | 18 images | Concept original Montaj |

« Concept original » désigne une proposition conçue pour ce laboratoire, sans revendiquer une invention universellement inédite. Les sept transitions de l’app (white flash, motion blur, whip pan, speed ramp, luma wipe, comic cut, glare) ne figurent pas dans cette collection.

## Réglages et matière

Neuf effets disposent d’une intensité **0–150 %**, mémorisée individuellement dans ce navigateur. À 0 %, le raccord est une coupe franche ; 100 % correspond aux valeurs de physique décrites dans les fiches. Geste continu et Blink cut gardent leur mouvement naturel, sans curseur d’intensité. Changer un réglage en pause affiche l’effet pour le comparer directement.

Les **onze durées** sont réglables et mémorisées séparément, par pas d’une image à 30 ips. Plages : Face Match 2–12 images ; Geste continu 2–15 ; Main 8–30 ; Découpe 8–36 ; Écho 6–24 ; Mot-pivot 8–36 ; Blink 2–6 ; Décor 10–36 ; Passe-muraille 10–45 ; Onde 8–30 ; Gravité 10–45. Les phases graphiques s’étirent proportionnellement autour du repère fixe. La coupe du Blink reste au vrai clignement. La vidéo, sa durée totale et la vitesse de la voix restent identiques. Les poses détourées de cet aperçu restent extraites aux timecodes initiaux ; elles ne sont pas recalculées pendant le réglage.

Passe-muraille propose deux sens au même repère de 44 secondes : **IN** fait grandir la photo détourée de B dans A ; **OUT** fait rétrécir celle de A devant B. Photo, masque et bord papier restent solidaires. OUT correspond notamment au retour au réel et à la fin d’une parenthèse.

Passe-muraille (IN et OUT) et Gravité inversée utilisent désormais le **papier déchiré blanc des références visuelles fournies**, avec découpe en noir et blanc optionnelle et fond en couleur. Réglages : bord **0–40 px** (24 px initialement, à l’échelle de la source 720p), irrégularité **0–100 %** (70 % initialement), noir et blanc activable. Le papier comporte une largeur variable, des petites encoches, du grain et des fibres suivant la normale locale du contour. L’ombre est légère. Les motifs sont déterministes et suivent la découpe, sans bruit aléatoire à chaque image. Les bords disposent d’une marge de rendu pour rester visibles même quand le sujet touche le bord de son image source.

Les références déterminantes sont les captures de papier déchiré partagées dans la conversation. La recherche préalable sur [Torn Paper — bords et fibres](https://aescripts.com/torn-paper/) a servi à identifier le vocabulaire ; le rendu est réalisé localement sans ce plugin. Le style kraft extrudé initial a été remplacé après réception des captures.

**Ce qui agit sur la personne :** Main devant l’objectif anime la main ; Découpe, Écho, Décor en retard et Gravité inversée déplacent ou dupliquent la silhouette ; Passe-muraille anime une photo détourée de sa silhouette ; Onde de verre déforme temporairement l’image, visage compris. Face Match et Geste continu modifient le cadrage. Blink cut utilise le clignement réel, Mot-pivot ajoute du texte.

## Cas d’usage et score IA

Chaque transition affiche des tags de cas d’usage. Les fiches détaillent les situations favorables, les situations à éviter, le ton et les prérequis visuels. Ces données viennent de `catalog.js` et sont exportables avec **Catalogue pour l’IA · JSON**. L’export contient aussi les variantes, les plages de réglages et les paramètres actuels.

Le contrat proposé est : recevoir le contexte (transcription, intention, ton, observations A/B, gestes, qualité du détourage et effets voisins) et les propositions identifiées, puis rendre un score de pertinence indépendant pour chaque proposition. Pondération éditoriale initiale : intention narrative 40 %, compatibilité visuelle 30 %, ton 20 %, rythme 10 %. Cette pondération est une proposition à calibrer, pas un résultat mesuré.

Un prérequis absent donne `ineligible` et 0 ; un contexte insuffisant donne `needs_context` et un score `null` ; une proposition évaluable donne `scored` et un score 0–100. Chaque résultat doit citer les indices du passage dans une justification courte. **Le score ne représente ni la viralité ni l’intensité de l’animation.** Le labo prépare ce catalogue et ce contrat ; aucun modèle IA n’est connecté et aucun score n’est fabriqué dans l’interface.

## Fabrication des effets

`effects.js` contient les courbes, les compositions Canvas et le shader de réfraction WebGL. `lab.js` synchronise le rendu sur les images vidéo décodées (`requestVideoFrameCallback`), la navigation, la boucle et le ralenti. La vidéo n’est jamais redessinée sur une horloge audio indépendante.

Les silhouettes et repères proviennent de **la vraie vidéo** : `prepare.swift` utilise Vision localement pour générer les masques de personne, les repères du visage et de la main. Aucun portrait généré. Le minimum d’ouverture des yeux entre 33 et 36 secondes a été vérifié sur une planche d’images autour de 35,47 s. Les plans sortants des effets de découpe sont figés sur la première image de l’effet afin de permettre un déplacement contrôlé et un scrubbing reproductible.

La main ne couvre pas l’objectif dans le rush. L’effet « Main devant l’objectif » déplace une découpe de la main réelle à 40 s ; la fiche l’indique. Le geste continu et Face Match sont des études de raccord par recadrage sur cette vidéo, pas des algorithmes de recherche entre prises indépendantes. Le détourage contient les imperfections de la segmentation, ainsi que les sous-titres déjà incrustés dans le rush.


Les premiers repères viennent de la discussion et des références [TikTok Creative Codes](https://ads.tiktok.com/business/en-US/creative-codes), [CapCut — continuité du geste](https://www.capcut.com/resource/match-on-action-cuts) et [Adobe — Morph Cut](https://helpx.adobe.com/au/premiere/desktop/add-video-effects/apply-video-transitions/morph-cut-overview.html). Les courbes et les paramètres du labo sont des choix de réalisation locaux.

Les algorithmes et leurs paramètres restent dans ce laboratoire HTML. Leur intégration au moteur de rendu Swift de l’app sera une étape distincte après sélection visuelle.

## Réutiliser le papier sur une personne, un objet ou un logo

`paper-cutout.js` exporte **PaperCutout**, sans connaissance de la vidéo, du visage, de la timeline ou du lecteur. Entrées : une image et son masque **alpha** de même cadrage. Un masque en niveaux de gris doit être converti en alpha au préalable (`alphaMatte` dans le labo). Le moteur n’effectue pas lui-même la segmentation ; dans ce prototype seulement, les masques de personnes viennent de Vision. Un autre fournisseur de masques permet les objets.

```js
import {PaperCutout} from './paper-cutout.js';
const cutout = new PaperCutout({mask: alphaMask, width: 720, height: 1280, seed: 71});
cutout.setStyle({borderWidth: 24, roughness: 0.7, shadow: 4});
cutout.draw(context, {
  image: photo,
  x: 0, y: 0, scale: 0.8, rotation: -0.03,
  anchor: [360, 280], opacity: 1,
  borderOpacity: 1, monochrome: 1
});
```

Les coordonnées, ancres et largeurs sont exprimées dans les pixels de l’image source ; la rotation est en radians. `monochrome` et les opacités vont de 0 à 1. Pour une vidéo ou un canvas dont le contenu change, fournir également `frameKey: mediaTime` (ou un compteur d’images) afin de rafraîchir la photo. Recréer le composant quand le masque change. Les distances au contour sont calculées une fois ; les changements de largeur/irrégularité recalculent seulement le papier, et les transformations réutilisent les calques. Le noir et blanc est calculé en pixels, compatible avec les navigateurs mobiles sans filtre Canvas. Ce module web et ses paramètres peuvent servir de spécification pour le moteur natif.
