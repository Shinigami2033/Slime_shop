const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Wir müssen den relativen Pfad vom `server` Verzeichnis aus angeben
const { verifyPassword } = require('../admin-verwaltung/adminService.js');
const db = require('../admin-verwaltung/database.js');

/**
 * Passport muss Benutzer serialisieren und deserialisieren können,
 * um die Login-Sitzungen über mehrere Anfragen hinweg aufrechtzuerhalten.
 */
passport.serializeUser((user, done) => {
  // Speichere nur die User-ID in der Session
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Hole den vollständigen Benutzer anhand der ID aus der Datenbank
  db.get('SELECT id, username FROM admins WHERE id = ?', [id], (err, row) => {
    done(err, row);
  });
});

/**
 * Definiere die "lokale" Strategie: Nimm Benutzername und Passwort und überprüfe sie.
 */
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await verifyPassword(username, password);
    // Wenn kein User zurückgegeben wird, war der Login ungültig
    if (!user) {
      return done(null, false, { message: 'Ungültiger Benutzername oder Passwort.' });
    }
    // Andernfalls war der Login erfolgreich
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

module.exports = passport;