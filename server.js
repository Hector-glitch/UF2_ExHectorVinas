const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');
app.use(express.json());



port = 3080;
app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'unihectorvinas'
});

connection.connect((error) => {
  if (error) {
    console.error('Error al connectar:', error);
  } else {
    console.log('Connexio completada');
  }
});

async function modifCorreu(idAlumne) {
  // Obtenir les dades de l'alumne
  const [rows] = await connection.execute('SELECT * FROM alumnes WHERE ALUMN_DNI = ?', [idAlumne]);
  const alumne = rows[0];

  // Verificar si el camp correu electrònic ja és un VARCHAR (30)
  if (alumne.ALUMN_E_MAIL.length === 30 && alumne.ALUMN_E_MAIL.type === 'VARCHAR(30)') {
    console.log('El camp correu electrònic ja és un VARCHAR(30)');
    return;
  }

  // Modificar la columna correu electrònic a VARCHAR (30)
  await connection.execute('ALTER TABLE alumnes MODIFY COLUMN ALUMN_E_MAIL VARCHAR(30)');

  console.log('El camp correu electrònic s\'ha modificat correctament a VARCHAR(30)');
}


//Exercici 2

async function listAssigInfo() {
  // Obtenir el codi del departament a partir del seu nom
  const deptNom = 'Informàtica' & 'Matemàtica Aplicada';
  const [deptResult] = await connection.execute(
    'SELECT DEPT_CODI FROM departament WHERE DEPT_NOM = ?',
    [deptNom]
  );
  const deptCodi = deptResult.length > 0 ? deptResult[0].DEPT_CODI : -1;

  // Obtenir la informació de les assignatures impartides pels professors del departament
  const [result] = await connection.execute(`
    SELECT DISTINCT assig.ASSIG_CODI, assig.ASSIG_NOM
    FROM assignatures assig
    JOIN assignatures_professor ap ON assig.ASSIG_CODI = ap.ASSIGPROF_ASSIG_CODI
    JOIN professor prof ON ap.ASSIGPROF_PROF_DNI = prof.PROF_DNI
    WHERE prof.PROF_DEPT_CODI = ?
  `, [deptCodi]);

  // Tancar la connexió amb la base de dades
  connection.end();

  return result;
}

//Exercici 3

function afegirDepartament(nom, ubicacio, telefon, dniProfessor) {
  const data = {
    nom: nom,
    ubicacio: ubicacio,
    telefon: telefon,
    dniProfessor: dniProfessor
  };

  fetch('/api/departament', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('No puc, pelacastanyes!');
      }
      return response.json();
    })
    .then(result => {
      console.log('Nou departament afegit:', result);
      // Aquí pots afegir codi per actualitzar la vista o fer alguna acció addicional
    })
    .catch(error => {
      console.error('Error afegint departament:', error);
      // Aquí pots afegir codi per mostrar un missatge d'error a l'usuari
    });
}


