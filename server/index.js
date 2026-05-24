const express = require('express')
const cors = require('cors')
const path = require('path')
const { db, init } = require('./db')

const app = express()
app.use(cors())
app.use(express.json())

// ── Eventos ──────────────────────────────────────────────────────────────────

app.get('/api/eventos', async (req, res) => {
  const { rows } = await db.execute('SELECT * FROM eventos ORDER BY sort_order, id')
  res.json(rows)
})

app.post('/api/eventos', async (req, res) => {
  const { type, day, month, title, place, note, time } = req.body
  const { rows: [{ m }] } = await db.execute('SELECT COALESCE(MAX(sort_order),0) as m FROM eventos')
  const r = await db.execute({ sql: 'INSERT INTO eventos (type,day,month,title,place,note,time,sort_order) VALUES (?,?,?,?,?,?,?,?)', args: [type, day, month, title, place, note, time, Number(m) + 1] })
  const { rows: [ev] } = await db.execute({ sql: 'SELECT * FROM eventos WHERE id=?', args: [Number(r.lastInsertRowid)] })
  res.json(ev)
})

app.put('/api/eventos/:id', async (req, res) => {
  const { type, day, month, title, place, note, time } = req.body
  await db.execute({ sql: 'UPDATE eventos SET type=?,day=?,month=?,title=?,place=?,note=?,time=? WHERE id=?', args: [type, day, month, title, place, note, time, req.params.id] })
  const { rows: [ev] } = await db.execute({ sql: 'SELECT * FROM eventos WHERE id=?', args: [req.params.id] })
  res.json(ev)
})

app.delete('/api/eventos/:id', async (req, res) => {
  await db.execute({ sql: 'DELETE FROM eventos WHERE id=?', args: [req.params.id] })
  res.json({ ok: true })
})

// ── Equipos ──────────────────────────────────────────────────────────────────

app.get('/api/equipos', async (req, res) => {
  const { rows } = await db.execute('SELECT * FROM equipos ORDER BY id')
  res.json(rows)
})

app.put('/api/equipos/:id', async (req, res) => {
  const { name, place, training, extra } = req.body
  await db.execute({ sql: 'UPDATE equipos SET name=?,place=?,training=?,extra=? WHERE id=?', args: [name, place, training, extra, req.params.id] })
  const { rows: [eq] } = await db.execute({ sql: 'SELECT * FROM equipos WHERE id=?', args: [req.params.id] })
  res.json(eq)
})

// ── Valores ──────────────────────────────────────────────────────────────────

app.get('/api/valores', async (req, res) => {
  const { rows } = await db.execute('SELECT * FROM valores ORDER BY id')
  res.json(rows)
})

app.put('/api/valores/:id', async (req, res) => {
  const { title, description } = req.body
  await db.execute({ sql: 'UPDATE valores SET title=?,description=? WHERE id=?', args: [title, description, req.params.id] })
  const { rows: [v] } = await db.execute({ sql: 'SELECT * FROM valores WHERE id=?', args: [req.params.id] })
  res.json(v)
})

// ── Config ───────────────────────────────────────────────────────────────────

app.get('/api/config', async (req, res) => {
  const { rows } = await db.execute('SELECT key,value FROM config')
  res.json(Object.fromEntries(rows.map(r => [r.key, r.value])))
})

app.put('/api/config', async (req, res) => {
  await db.batch(
    Object.entries(req.body).map(([k, v]) => ({
      sql: 'INSERT INTO config (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value',
      args: [k, v],
    })),
    'write'
  )
  const { rows } = await db.execute('SELECT key,value FROM config')
  res.json(Object.fromEntries(rows.map(r => [r.key, r.value])))
})

// ── Frontend (producción) ─────────────────────────────────────────────────────

if (process.env.NODE_ENV === 'production') {
  const dist = path.join(__dirname, '../dist')
  app.use(express.static(dist))
  app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')))
}

// ── Arranque ──────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3001

init()
  .then(() => app.listen(PORT, () => console.log(`CRLP API → http://localhost:${PORT}`)))
  .catch(err => { console.error('Error arrancando DB:', err); process.exit(1) })
