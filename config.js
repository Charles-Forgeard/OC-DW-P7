require('dotenv').config()

exports.DEBUG = '*';

//CF .env.example file
exports.env = process.env.NODE_ENV;

exports.app = {
    host: 'localhost',
    port: 3000
}

//Domaine du site faisant appel à l'API. Tout autre domaine est rejeté par l'API.
exports.siteDomain = 'http://localhost:4200';

//CF .env.example file
exports.crypt = {
    emailInDB: process.env.CRYPT_EMAIL,
    passwordInDB: true
}

//process.env.CRYPT_EMAIL

//Filtres emails utilisateurs en base de donnée

//Clé de l'API abstract => https://www.abstractapi.com/
exports.abstractAPIKey = process.env.ABSTRACTAPI_KEY;
//Liste de domaines d'email temporaires à interdire lors de l'enregistrement utilisateur.
exports.forbidenEmailDomains = ["vpsrec","boxomail","cool.fr","jetable.fr","courriel.fr","moncourrier.fr","monemail.fr","@monmail.fr","hide.biz","mymail.infos","trashmail"];

//Conditions de verrouillage du compte utilisateur

//Nombre de login(s) autorisés par minutes
exports.loginLimitation = 60;
//Nombre de tentatives de connections autorisées avant verrouillage du compte utilisateur, 0 = pas de limitation du nombre de tentatives.
exports.longinsFailedLimitation = 3;
//Temps de verrouillage de l'accès au compte utilisateur après "longinsFailedLimitation" échec(s) de login(s)
exports.userLockedTimeout = 1 * 60 * 1000;

//Authentification pour l'accès aux images des sauces
exports.authAccessImg = false;

//Gestion de la journalisation des logs

//Durée de conservation des logs avant suppression (5.9 mois par défaut => maximum autorisé par RGPD: 6mois) en ms.
//Attention, une valeur trop basse rendra la journalisation des logs instables (tests faits jusqu'à 10*1000 minimum).
exports.logsMaxTime = 5.9 * 30 * 24 * 60 * 60 * 1000;
//Interval de temps entre chaque vérification de l'âge des logs
exports.logsCheckInterval = 24 * 60 * 60 * 1000;

exports.accessControlByAdmin = process.env.ACCESS_CONTROL_BY_ADMIN === 'true' ? true : false;

exports.elasticEmailApiKey = process.env.ELASTIC_EMAIL_API_KEY

exports.adminEmail = process.env.ADMIN_EMAIL
