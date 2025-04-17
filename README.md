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
- Factory : Fournit des stratégies de calcul de statistiques en fonction du type d'objet (Training ou Exercice) et du type de statistique souhaité.
- Strategy : Adapte la stratégie de calcul statistique à appliquer sur un objet (Training ou Exercice) en fonction du type de statistque souhaité.
- Decorator : Permet de retourner des exercices/trainings décorés avec leurs statistiques sans changer la structure de base.
- Command : (Implémenté dans l'application front) Permet de gérer le lancement/la mise en pause/l'arret des entrainements.
- Adapter : (Implémenté dans l'application front) Permet de convertir les données de l'api vers les diagrammes de la librairie ApexChart.
- Dependancy Injection : Permet de gérer les dépendances entre les classes et d'injecter des objets dans les classes qui en ont besoin.
- Repository : Permet de gérer la persistante des données.

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
4. Configurer la base de données
    - Créer une base de données `training_app_db` dans mysql
    - Configurer le fichier `application.properties` pour se connecter à la base de données
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/training_app_db
    spring.datasource.username=
    spring.datasource.password=
    ```
   Veuillez à remplir le nom d'utilisateur et le mot de passe de votre base de données mysql.
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

## Architecture
Le projet est structuré de manière à séparer les différentes couches de l'application :
- `components` : Contient les composants Vue.js réutilisables dans l'application.
- `views` : Contient les différentes pages de l'application, chacune correspondant à une vue spécifique.
- `store` : Gère l'état global de l'application à l'aide de Vuex.
- `assets` : Contient les fichiers statiques comme les images et les styles CSS.
- `router` : Configure les routes de l'application pour naviguer entre les différentes vues.
- `utils` : Contient des fonctions utilitaires réutilisables dans l'application.
- `tests` : Contient les tests end-to-end pour garantir la qualité du code.

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

