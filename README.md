# Quand les notes s'effacent

Roman musical interactif en sept jours. Revenez à Kerlann, écoutez Élise, jouez le piano et gardez ce qui reste.

## Lancer le jeu

Le jeu est entièrement statique : aucun build, aucune dépendance.

- En ligne : <https://casifox.github.io/quand-les-notes-seffacent/>
- En local, depuis la racine du projet :

```
python -m http.server 8000
```

Puis ouvrir `http://localhost:8000/`.

## Contrôles

- **Espace** ou **Entrée** : avancer le dialogue (Espace ou Entrée dans le moteur, `assets/js/game/engine.js`).
- **Échap** : ouvrir ou fermer le menu.
- **M** : couper ou rétablir le son.
- **Piano** : cliquer les touches blanches et noires, puis utiliser les boutons Écouter, Indice, Réinitialiser, Valider et Continuer.

## Sauvegarde

- Trois emplacements de carnet, stockés dans le navigateur (`localStorage`, préfixe `qlnse.save.v1.`).
- Les réglages sont stockés sous `qlnse.settings.v1`.
- Aucun compte, aucun serveur, aucune donnée personnelle transmise.

## Structure

- `index.html` : interface et écrans.
- `assets/js/main.js` : menus, dialogues, carnets, réglages.
- `assets/js/core/` : audio, ambiance, notes, stockage, utilitaires.
- `assets/js/game/` : moteur narratif et piano.
- `assets/js/story/` : prologue, journées 1 à 7, épilogues.
- `assets/js/data/` : souvenirs, musiques, énigmes, fins.
- `assets/css/` et `assets/art/` : styles et illustrations SVG.

## Publication

Le site est publié sur GitHub Pages depuis la branche `main`, à la racine du dépôt. Le fichier `.nojekyll` désactive le traitement Jekyll.
