# TrainingApp_front

Projet de session pour le cours IFT785 – Approches orientées objets

## Context

L'application permet de gérer des entraînements dans divers disciplines comme le sport ou les jeux vidéo.
Elle est conçue pour être extensible et modulaire, facilitant l'ajout de nouvelles fonctionnalités à l'avenir.

## Features
 - Gestion des disciplines
 - Gestion des entraînements
 - Gestion des exercices
 - Gestion des sessions d'entraînement
 - Gestion des session d'exercices
 - Retour de données statistiques sur les entraînements et des exercices

 ## Design pattern implémentés
- Factory : Récupère dynamiquement un objet Training ou Exercice pour choisir la stratégie de statistiques à appliquer.
- Strategy : Permet de choisir la stratégie de statistiques à appliquer sur un entraînement ou un exercice.
- Decorator : Permet de retourner des exercices/trainings avec leurs statistiques sans changer la structure de base.
- Repository : Permet de gérer la persistante des données.
- Command : (Implémenté dans l'application front) Permet de gérer le lancement et l'arret des entrainements.
- Adapter : (Implémenté dans l'application front) Permet la communication entre les données de l'api et ApexChart.
- Dependancy Injection : Permet de gérer les dépendances entre les classes et d'injecter des objets dans les classes qui en ont besoin.


## Installation

### Frontend
1. Cloner le dépôt :
   ```sh
   git clone https://github.com/AlexLomas37/TrainingApp_front.git
   ```
2. Installer les dépendances :
   ```sh
   npm install
   ```
3. Démarrer le serveur de développement :
   ```sh
   npm run dev
   ```
4. Accéder au site web via `http://localhost:3000`

### Backend
1. Cloner le dépot : 
```sh
git clone https://github.com/AlexLomas37/TrainingApp_back.git
```
2. Ouvrir le projet dans IntelleJ IDEA
3. Configurer le JDK 17
4. Configurer la base de données H2
5. Lancer le projet ou alors générer un fichier war et le déployer sur un serveur d'application comme Tomcat. 
6. Accéder à l'API via `http://localhost:8090`

## Utilisation
- Accédez à l'application via [http://localhost:3000](http://localhost:3000).
- Naviguez entre l'accueil, la gestion des disciplines et les détails des entraînements.
- Utilisez les boutons pour ajouter, modifier ou supprimer des éléments.

## Tests
- Exécuter les tests end-to-end :
   ```sh
   npx cypress open
   ``` 
## Technologies
 - Node.js
 - Vue.js
 - Apexchart
 - Cypress
 - Typescript

## Date de remise
 17 avril 2025

## Auteur
Alexandre Lomaszewicz

