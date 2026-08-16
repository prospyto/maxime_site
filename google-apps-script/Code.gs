/**
 * Ember Sushi — Réception des commandes & réservations
 *
 * INSTALLATION :
 * 1. Ouvre ta Google Sheet (celle liée à ton script déployé).
 * 2. Menu "Extensions" > "Apps Script".
 * 3. Supprime tout le code existant et colle celui-ci.
 * 4. Enregistre (icône disquette).
 * 5. Clique "Déployer" > "Gérer les déploiements" > icône crayon (modifier)
 *    sur le déploiement existant > "Nouvelle version" > "Déployer".
 *    (Important : l'URL /exec reste la même, seule une nouvelle version
 *    fait passer le nouveau code en production.)
 * 6. Vérifie le partage de la Sheet : bouton "Partager" > "Accès général"
 *    > "Tous les utilisateurs disposant du lien" > rôle "Lecteur".
 *    (Nécessaire pour que la page admin puisse lire les données.)
 */

// Ordre des colonnes attendu par la page admin pour chaque type
const SCHEMAS = {
  Reservations: ['date', 'heure', 'couverts', 'nom', 'telephone', 'demande', 'soumis_le'],
  Commandes: ['numero', 'type', 'adresse', 'articles', 'total', 'soumis_le'],
};

function doPost(e) {
  try {
    const raw = e.parameter.data;
    if (!raw) throw new Error('Champ "data" manquant');

    const body = JSON.parse(raw);
    const type = body.type;
    const payload = body.payload || {};

    if (!SCHEMAS[type]) {
      throw new Error('Type inconnu : ' + type);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(type);

    // Crée l'onglet avec les en-têtes s'il n'existe pas encore
    if (!sheet) {
      sheet = ss.insertSheet(type);
      sheet.appendRow(SCHEMAS[type]);
      sheet.setFrozenRows(1);
    }

    // Si l'onglet existe mais est vide (pas d'en-têtes), on les ajoute
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(SCHEMAS[type]);
      sheet.setFrozenRows(1);
    }

    const row = SCHEMAS[type].map(col => payload[col] ?? '');
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Utile pour tester rapidement que le déploiement répond bien
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'Ember Sushi script actif' }))
    .setMimeType(ContentService.MimeType.JSON);
}
