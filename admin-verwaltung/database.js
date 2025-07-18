const sqlite3 = require('sqlite3').verbose();

// Der Pfad zur Datenbankdatei. SQLite speichert die gesamte DB in dieser einen Datei.
const DBSOURCE = "admin_db.sqlite";

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Die Datenbank kann nicht geöffnet werden
      console.error(err.message);
      throw err;
    } else {
        console.log('Erfolgreich mit der SQLite-Datenbank verbunden.');
        // Erstelle die Tabelle, falls sie noch nicht existiert
        db.run(`CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                // Tabelle konnte nicht erstellt werden
                console.error("Fehler beim Erstellen der Tabelle:", err.message);
            } else {
                console.log("Tabelle 'admins' ist bereit.");
            }
        });
    }
});

module.exports = db;