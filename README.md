# Application intranet de Groupomania

Ce projet de réseau social interne à Groupomania a pour but de répondre aux besoins communs du personnel de l'entreprise en leur proposant un moyen de se connaître dans un cadre plus informel.

## Spécifications techniques

Au niveau des technologies utilisées, seule l'utilisation d'un framework front-end Javascript est exigée.

Pour ce qui est de l'identité graphique:

- La police d'écriture "Lato" est requise.

- Une palette chromatique en accord avec l'identité visuelle de la marque.

- Des visuels du logo de la marque sont également fournis.

## Spécifications fonctionnelles

- Mettre en place un système de session où les données de connexion sont sécurisées. l'utilisateur peut se connecter / déconnecter. La session persiste jusqu'à déconnection.

- La page d'accueil doit afficher les posts de façon antéchronologique.

- Un utilisateur doit pouvoir créer, modifier, supprimer ses posts qui doivent pouvoir contenir du texte et une image.

- Les posts doivent pouvoir être "likés", une seule fois par utilisateur.

- Un compte d'admin doit être mis en place. Il poura assurer la modération des posts.

## Installer le projet

### [Installer Node.js](https://nodejs.org/fr/)

Pour executer ce projet vous devez avoir Node.js installé sur votre machine. (Voir [Node.js](https://nodejs.org/fr/))

### `git clone https://github.com/Charles-Forgeard/OC-DW-P7.git`

Clonez ce repo git sur votre machine. Pour ce faire, exécutez cette commande dans un terminal.

### `.env.example -> .env`

Renommer le fichier '/back/.env.example' en '/back/.env'.

Pour cette version d'exemple, une clé de cryptage des emails en base de données y est configurée. **Elle doit être changée lors de la mise en production** (pour obtenir une nouvelle clé ouvrez votre terminal dans le dossier '/back' et executez la commande: `npm run newKey`)

Cette version permet de se loguer avec le compte administrateur.
Ce compte devra être recréé une fois la clé de cryptage reconfigurée avant mise en production.

### `npm run install` puis `npm run dev` dans dossier **/back**

Installez et démarrez le serveur servant l'api et le socket en local, executez cette commande dans un terminal dans le dossier **'/back'**.

### `npm run install` puis `npm run dev` dans dossier **/front**

Installez et démarrez le serveur servant l'app react, executez cette commande dans un terminal dans le dossier **'/front'**.

### `Allez à` [http://localhost:3001/](http://localhost:3001/)

Ouvrez votre navigateur Web et allez à cette adresse.

### `Créer un compte utilisateur` ou `utiliser le compte admin`

- **Pour créer un compte utilisateur**

Utilisez l'interface utilisateur côté client (sur votre navigateur web)
Si l'option de création de compte n'est pas disponible, assurez vous que le fichier **back/.env contient la variable ACCESS_CONTROL_BY_ADMIN initialisée à false**

- **Pour utiliser le compte admin**

**N'utilisez pas ces identifiants administrateur en production ou si vous exposez le site en dehors d'un environnement local!**

Pour faciliter le test de ce projet, voici les identifiants administrateurs préconfigurés:
ID: admin.reseau.social@groupomania.com
Password: Motdepassàchanger!§\\\*1

**A minima, changer le mot de passe administrateur à l'aide de l'interface adminstrateur**
Vous pouvez y accéder en cliquant sur l'icône utilisateur en haut à droite de la page une fois logué.
Mais dans ce cas, la clé pour décrypter les email de la base de données est exposée dans ce repo.

## Auteur(s)

**[Charles-Forgeard](https://github.com/Charles-Forgeard)**

## License

Ce projet et libre et peut-être utilisé par tout à chacun: GNU GLP-3.0 License
0 comments on commit bcf48ea
Please sign in to comment.
Footer
© 2022 GitHub, Inc.
Footer navigation
Terms
Privacy
