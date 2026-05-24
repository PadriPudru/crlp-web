const { createClient } = require('@libsql/client')
const path = require('path')

// Dev: fichero local · Prod: Turso (TURSO_URL + TURSO_TOKEN en Render)
const url = process.env.TURSO_URL || `file:${path.join(__dirname, 'crlp.db')}`
const db = createClient({ url, authToken: process.env.TURSO_TOKEN })

async function init() {
  // Tablas
  await db.batch([
    `CREATE TABLE IF NOT EXISTS eventos (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       type TEXT NOT NULL, day TEXT NOT NULL, month TEXT NOT NULL,
       title TEXT NOT NULL, place TEXT NOT NULL, note TEXT NOT NULL,
       time TEXT NOT NULL, sort_order INTEGER DEFAULT 0)`,
    `CREATE TABLE IF NOT EXISTS equipos (
       id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT UNIQUE NOT NULL,
       name TEXT NOT NULL, place TEXT NOT NULL,
       training TEXT NOT NULL, extra TEXT NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS valores (
       id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT UNIQUE NOT NULL,
       title TEXT NOT NULL, description TEXT NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS config (key TEXT PRIMARY KEY, value TEXT NOT NULL)`,
  ], 'write')

  // Seed inicial solo si las tablas están vacías
  const { rows: [{ n }] } = await db.execute('SELECT COUNT(*) as n FROM eventos')
  if (Number(n) === 0) {
    await db.batch([
      { sql: 'INSERT INTO eventos (type,day,month,title,place,note,time,sort_order) VALUES (?,?,?,?,?,?,?,?)', args: ['partido','31','May','CRLP vs CR La Laguna','Campo de las Rehoyas','Jornada de Liga','12:00',0] },
      { sql: 'INSERT INTO eventos (type,day,month,title,place,note,time,sort_order) VALUES (?,?,?,?,?,?,?,?)', args: ['social','04','Jun','Rugby en el cole · CEIP Las Rehoyas','Patio del colegio','Iniciación escolar','10:00',1] },
      { sql: 'INSERT INTO eventos (type,day,month,title,place,note,time,sort_order) VALUES (?,?,?,?,?,?,?,?)', args: ['playa','14','Jun','Torneo Rugby Playa Maspalomas','Playa de Maspalomas','Organiza el CRLP','09:30',2] },
      { sql: 'INSERT INTO eventos (type,day,month,title,place,note,time,sort_order) VALUES (?,?,?,?,?,?,?,?)', args: ['partido','21','Jun','Tamaranas vs Bahía RC','Campo de las Rehoyas','Amistoso femenino','11:00',3] },
      { sql: 'INSERT INTO eventos (type,day,month,title,place,note,time,sort_order) VALUES (?,?,?,?,?,?,?,?)', args: ['social','28','Jun','Jornada de puertas abiertas','Campo de las Rehoyas','Todas las edades','18:00',4] },
    ], 'write')
  }

  const { rows: [{ n: ne }] } = await db.execute('SELECT COUNT(*) as n FROM equipos')
  if (Number(ne) === 0) {
    await db.batch([
      { sql: 'INSERT INTO equipos (slug,name,place,training,extra) VALUES (?,?,?,?,?)', args: ['masculino','Senior Masculino','Campo de las Rehoyas','mar y jue · 21:00','Liga Territorial de Canarias'] },
      { sql: 'INSERT INTO equipos (slug,name,place,training,extra) VALUES (?,?,?,?,?)', args: ['femenino','Tamaranas','Campo de las Rehoyas','mar y jue · 21:00','Rugby femenino con carácter'] },
    ], 'write')
  }

  const { rows: [{ n: nv }] } = await db.execute('SELECT COUNT(*) as n FROM valores')
  if (Number(nv) === 0) {
    await db.batch([
      { sql: 'INSERT INTO valores (slug,title,description) VALUES (?,?,?)', args: ['companerismo','Compañerismo','En el campo te dejas la piel; fuera de él, los rivales son amigos. El tercer tiempo no se negocia.'] },
      { sql: 'INSERT INTO valores (slug,title,description) VALUES (?,?,?)', args: ['energia','Energía','Cada placaje, cada ensayo, cada grito de la grada. Aquí se viene a darlo todo, da igual el resultado.'] },
      { sql: 'INSERT INTO valores (slug,title,description) VALUES (?,?,?)', args: ['cantera','Cantera','Llevamos el rugby a los colegios de Gran Canaria. Sembramos hoy los jugadores y las personas de mañana.'] },
    ], 'write')
  }

  const { rows: [{ n: nc }] } = await db.execute('SELECT COUNT(*) as n FROM config')
  if (Number(nc) === 0) {
    await db.batch([
      { sql: 'INSERT INTO config (key,value) VALUES (?,?)', args: ['hero_eyebrow','Club de Rugby Las Palmas · Desde 1987'] },
      { sql: 'INSERT INTO config (key,value) VALUES (?,?)', args: ['hero_title1','Inspirar y unir'] },
      { sql: 'INSERT INTO config (key,value) VALUES (?,?)', args: ['hero_title2','a través del rugby'] },
      { sql: 'INSERT INTO config (key,value) VALUES (?,?)', args: ['hero_subtitle','Más que un club, una manada. Rugby de verdad en Gran Canaria: partidos, rugby playa, torneos y rugby en los colegios. Todo lo que viene, aquí.'] },
      { sql: 'INSERT INTO config (key,value) VALUES (?,?)', args: ['join_title_pre','¿Te atreves con el'] },
      { sql: 'INSERT INTO config (key,value) VALUES (?,?)', args: ['join_title_highlight','oval'] },
      { sql: 'INSERT INTO config (key,value) VALUES (?,?)', args: ['join_title_post','?'] },
      { sql: 'INSERT INTO config (key,value) VALUES (?,?)', args: ['join_description','No hace falta experiencia, solo ganas. Ven a un entreno, prueba sin compromiso y descubre por qué quien entra a esta familia no se quiere ir.'] },
      { sql: 'INSERT INTO config (key,value) VALUES (?,?)', args: ['join_instagram','https://www.instagram.com/crlp.gc/'] },
    ], 'write')
  }
}

module.exports = { db, init }
