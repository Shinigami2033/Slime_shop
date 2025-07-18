// Anwendungs-Startpunkt
const { addAdmin, verifyPassword } = require('./adminService.js');

async function main() {
    try {
        // --- Beispiel 1: Einen neuen Admin erstellen ---
        // Hinweis: Wenn Sie das Skript erneut ausführen, wird hier ein Fehler auftreten,
        // da der 'username' UNIQUE sein muss. Das ist beabsichtigt.
        // Für einen erneuten Test können Sie die Datenbankdatei 'admin_db.sqlite' löschen.
        console.log("--- Erstelle neuen Admin 'admin123' ---");
        // In einer echten Anwendung kommen diese Daten aus einem Formular.
        await addAdmin('admin123', 'sicheresPasswort!@#');
        console.log("----------------------------------------\n");


        // --- Beispiel 2: Korrektes Passwort verifizieren ---
        console.log("--- Verifiziere Passwort für 'admin123' ---");
        const isCorrect = await verifyPassword('admin123', 'sicheresPasswort!@#');
        if (isCorrect) {
            console.log("Ergebnis: Passwort ist korrekt. Zugriff gewährt.");
        } else {
            console.log("Ergebnis: Passwort ist falsch. Zugriff verweigert.");
        }
        console.log("----------------------------------------\n");


        // --- Beispiel 3: Falsches Passwort verifizieren ---
        console.log("--- Verifiziere falsches Passwort für 'admin123' ---");
        const isIncorrect = await verifyPassword('admin123', 'falschesPasswort');
        if (isIncorrect) {
            console.log("Ergebnis: Passwort ist korrekt. Zugriff gewährt.");
        } else {
            console.log("Ergebnis: Passwort ist falsch. Zugriff verweigert.");
        }
        console.log("----------------------------------------\n");

    } catch (error) {
        console.error("Ein Fehler ist aufgetreten:", error.message);
    }
}

main();