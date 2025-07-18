const readline = require('readline');
const { addAdmin } = require('./adminService.js');
const db = require('./database.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Fängt das Abbrechen mit Strg+C ab, um das Programm sauber zu beenden.
rl.on('SIGINT', () => {
  console.log('\nAdmin-Erstellung abgebrochen.');
  rl.close();
  db.close();
  process.exit(0);
});

const ask = (query) => new Promise(resolve => rl.question(query, resolve));

async function main() {
  let username;
  try {
    username = await ask('Geben Sie den Benutzernamen für den neuen Admin ein: ');
    if (!username) throw new Error('Benutzername darf nicht leer sein.');

    const password = await ask(`Geben Sie das Passwort für '${username}' ein: `);
    if (!password) throw new Error('Passwort darf nicht leer sein.');

    await addAdmin(username, password);

  } catch (error) {
    console.error('\nEin Fehler ist aufgetreten:');
    if (error.message.includes('UNIQUE constraint failed')) {
      console.error(`Der Benutzername '${username}' existiert bereits.`);
    } else {
      console.error(error.message);
    }
  } finally {
    rl.close();
    db.close();
  }
}

main();