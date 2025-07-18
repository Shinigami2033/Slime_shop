const db = require('./database.js');
const bcrypt = require('bcrypt');

// Die "Kosten" des Hashings. Ein höherer Wert ist sicherer, aber langsamer.
// 10 ist ein guter Standardwert.
const saltRounds = 10;

/**
 * Erstellt einen neuen Admin-Benutzer und speichert das gehashte Passwort.
 * @param {string} username Der Benutzername.
 * @param {string} password Das Klartext-Passwort.
 * @returns {Promise<number>} Die ID des neu erstellten Admins.
 */
async function addAdmin(username, password) {
    try {
        // Generiere einen Hash für das Passwort. bcrypt kümmert sich automatisch um das "Salting".
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const sql = 'INSERT INTO admins (username, password_hash) VALUES (?, ?)';
        const params = [username, passwordHash];

        return new Promise((resolve, reject) => {
            db.run(sql, params, function(err) {
                if (err) {
                    reject(new Error(`Fehler beim Erstellen des Admins: ${err.message}`));
                } else {
                    console.log(`Admin '${username}' erfolgreich mit ID ${this.lastID} erstellt.`);
                    resolve(this.lastID);
                }
            });
        });
    } catch (error) {
        console.error("Fehler beim Hashing des Passworts:", error);
        throw error;
    }
}

/**
 * Überprüft, ob das angegebene Passwort für einen Benutzer korrekt ist.
 * @param {string} username Der Benutzername.
 * @param {string} password Das zu überprüfende Klartext-Passwort.
 * @returns {Promise<object|null>} Das Benutzerobjekt bei Erfolg, sonst null.
 */
async function verifyPassword(username, password) {
    const sql = 'SELECT id, username, password_hash FROM admins WHERE username = ?';

    return new Promise((resolve, reject) => {
        db.get(sql, [username], async (err, row) => {
            if (err) {
                return reject(new Error(`Datenbankfehler: ${err.message}`));
            }
            if (!row) {
                return resolve(null); // Benutzer nicht gefunden
            }

            const match = await bcrypt.compare(password, row.password_hash);
            if (match) {
                resolve({ id: row.id, username: row.username }); // Erfolg
            } else {
                resolve(null); // Passwort falsch
            }
        });
    });
}

module.exports = { addAdmin, verifyPassword };