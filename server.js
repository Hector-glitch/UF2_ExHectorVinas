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

  // Verificar si el camp correu electrònic ja és un VARCHAR(30)
  if (alumne.ALUMN_E_MAIL.length === 30 && alumne.ALUMN_E_MAIL.type === 'VARCHAR(30)') {
    console.log('El camp correu electrònic ja és un VARCHAR(30)');
    return;
  }

  // Modificar la columna correu electrònic a VARCHAR(30)
  await connection.execute('ALTER TABLE alumnes MODIFY COLUMN ALUMN_E_MAIL VARCHAR(30)');

  console.log('El camp correu electrònic s\'ha modificat correctament a VARCHAR(30)');
}


//Exercici 2

async function getCodiDepartament(nomDepartament, connection) {
  const [rows] = await connection.execute('SELECT DEPT_CODI FROM departaments WHERE nom = NOM_DEPT', [nomDepartament]);
  if (rows.length === 0) {
    throw new Error(`No s'ha trobat cap departament amb el nom "${nomDepartament}"`);
  }
  return rows[0].DEPT_CODI;
}

// Mètode per obtenir les assignatures que imparteixen els professors del departament de Informàtica i Matemàtica Aplicada
async function getAssignaturesInformaticaIMatematicaAplicada(connection) {
  const codiDepartament = await getCodiDepartament('Informàtica i Matemàtica Aplicada', connection);

  const [rows] = await connection.execute(`
    SELECT DISTINCT assignatures.codi, assignatures.nom
    FROM assignatures
    JOIN professors_assignatures ON assignatures.codi = professors_assignatures.codi_assignatura
    JOIN professors ON professors_assignatures.id_professor = professors.id
    WHERE professors.codi_departament = ?
  `, [codiDepartament]);

  return rows;
}

// Mètode per llistar les assignatures que imparteixen els professors del departament de Informàtica i Matemàtica Aplicada
app.get('/api/llistaAssiginfo', async (req, res) => {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    const assignatures = await getAssignaturesInformaticaIMatematicaAplicada(connection);
    await connection.end();

    res.json(assignatures);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});
