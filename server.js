const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'aduanaflow_super_secret_key_2026';

// --- Verificación Desactivada ---
// El usuario solicitó registro directo con puro usuario y contraseña.
console.log('Sistema de Verificación (Email/SMS) desactivado. Las cuentas se auto-verifican.');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '')));

// Database setup: SQLite local / PostgreSQL on Render
let db;
const isPostgres = !!process.env.DATABASE_URL;

if (isPostgres) {
  console.log('Connecting to PostgreSQL database at DATABASE_URL...');
  const { Pool } = require('pg');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  const convertSql = (sql) => {
    let index = 1;
    return sql.replace(/\?/g, () => `$${index++}`);
  };

  db = {
    get: (sql, params, callback) => {
      if (typeof params === 'function') {
        callback = params;
        params = [];
      }
      pool.query(convertSql(sql), params, (err, res) => {
        if (err) {
          console.error('PG Error in get:', err.message, '\nSQL:', sql, '\nParams:', params);
          return callback(err);
        }
        callback(null, res.rows[0] || null);
      });
    },
    all: (sql, params, callback) => {
      if (typeof params === 'function') {
        callback = params;
        params = [];
      }
      pool.query(convertSql(sql), params, (err, res) => {
        if (err) {
          console.error('PG Error in all:', err.message, '\nSQL:', sql, '\nParams:', params);
          return callback(err);
        }
        callback(null, res.rows);
      });
    },
    run: function(sql, params, callback) {
      if (typeof params === 'function') {
        callback = params;
        params = [];
      }
      pool.query(convertSql(sql), params, (err, res) => {
        if (err) {
          console.error('PG Error in run:', err.message, '\nSQL:', sql, '\nParams:', params);
          if (callback) callback(err);
          return;
        }
        const context = { changes: res.rowCount, lastID: null };
        if (callback) callback.call(context, null);
      });
    },
    serialize: (callback) => {
      callback();
    },
    prepare: (sql) => {
      const converted = convertSql(sql);
      return {
        run: function(...args) {
          let callback = null;
          let params = args;
          if (args.length > 0 && typeof args[args.length - 1] === 'function') {
            callback = args[args.length - 1];
            params = args.slice(0, -1);
          }
          pool.query(converted, params, (err) => {
            if (callback) callback(err);
          });
        },
        finalize: (callback) => {
          if (callback) callback();
        }
      };
    }
  };

  // Initialize PostgreSQL tables
  const initDb = async () => {
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS registros (
        id TEXT PRIMARY KEY,
        refNo TEXT,
        fecha TEXT,
        estado TEXT,
        operacion TEXT,
        doc TEXT,
        aduana TEXT,
        patente TEXT,
        cliente TEXT,
        importadorExportador TEXT,
        c20 INTEGER,
        c40 INTEGER,
        bultos INTEGER,
        clase TEXT,
        mercancia TEXT,
        observaciones TEXT,
        prioridad INTEGER,
        contacto TEXT,
        user_id TEXT
      )`);

      await pool.query(`CREATE TABLE IF NOT EXISTS embarques (
        id TEXT PRIMARY KEY,
        cliente TEXT,
        mercancia TEXT,
        origen TEXT,
        puertoOrigen TEXT,
        destino TEXT,
        valorFactura INTEGER,
        moneda TEXT,
        tipoOperacion TEXT,
        estado TEXT,
        semaforo TEXT,
        agenteAduanal TEXT,
        pedimento TEXT,
        documentos TEXT,
        historial TEXT,
        user_id TEXT
      )`);

      await pool.query(`CREATE TABLE IF NOT EXISTS calculos (
        id TEXT PRIMARY KEY,
        fecha TEXT,
        fraccion_codigo TEXT,
        fraccion_nombre TEXT,
        valor_factura REAL,
        flete REAL,
        seguro REAL,
        origen TEXT,
        igi REAL,
        dta REAL,
        iva REAL,
        total_impuestos REAL,
        user_id TEXT
      )`);

      await pool.query(`CREATE TABLE IF NOT EXISTS usuarios (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE,
        password_hash TEXT,
        email TEXT,
        phone TEXT UNIQUE,
        is_verified INTEGER DEFAULT 0,
        verification_code TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

      // Add columns if they do not exist
      try { await pool.query(`ALTER TABLE usuarios ADD COLUMN phone TEXT`); } catch (_) {}
      try { await pool.query(`ALTER TABLE registros ADD COLUMN user_id TEXT`); } catch (_) {}
      try { await pool.query(`ALTER TABLE embarques ADD COLUMN user_id TEXT`); } catch (_) {}
      try { await pool.query(`ALTER TABLE calculos ADD COLUMN user_id TEXT`); } catch (_) {}

      console.log('PostgreSQL database tables initialized successfully.');
      seedDataIfNeeded();
    } catch (err) {
      console.error('Error initializing PostgreSQL tables:', err.message);
    }
  };
  initDb();

} else {
  console.log('Connecting to SQLite database...');
  const sqlite3 = require('sqlite3').verbose();
  const dbFile = path.join(__dirname, 'database.sqlite');
  const sqliteDb = new sqlite3.Database(dbFile, (err) => {
    if (err) {
      console.error('Error opening database', err.message);
    } else {
      console.log('Connected to the SQLite database.');
      
      sqliteDb.run(`CREATE TABLE IF NOT EXISTS registros (
        id TEXT PRIMARY KEY,
        refNo TEXT,
        fecha TEXT,
        estado TEXT,
        operacion TEXT,
        doc TEXT,
        aduana TEXT,
        patente TEXT,
        cliente TEXT,
        importadorExportador TEXT,
        c20 INTEGER,
        c40 INTEGER,
        bultos INTEGER,
        clase TEXT,
        mercancia TEXT,
        observaciones TEXT,
        prioridad INTEGER,
        contacto TEXT,
        user_id TEXT
      )`, (err) => {
        if (err) console.error("Error creating registros table", err);
        
        sqliteDb.run(`CREATE TABLE IF NOT EXISTS embarques (
          id TEXT PRIMARY KEY,
          cliente TEXT,
          mercancia TEXT,
          origen TEXT,
          puertoOrigen TEXT,
          destino TEXT,
          valorFactura INTEGER,
          moneda TEXT,
          tipoOperacion TEXT,
          estado TEXT,
          semaforo TEXT,
          agenteAduanal TEXT,
          pedimento TEXT,
          documentos TEXT,
          historial TEXT,
          user_id TEXT
        )`, (err2) => {
          if (err2) console.error("Error creating embarques table", err2);
          
          sqliteDb.run(`CREATE TABLE IF NOT EXISTS calculos (
            id TEXT PRIMARY KEY,
            fecha TEXT,
            fraccion_codigo TEXT,
            fraccion_nombre TEXT,
            valor_factura REAL,
            flete REAL,
            seguro REAL,
            origen TEXT,
            igi REAL,
            dta REAL,
            iva REAL,
            total_impuestos REAL,
            user_id TEXT
          )`, (err3) => {
            if (err3) console.error("Error creating calculos table", err3);
            else {
              sqliteDb.serialize(() => {
                sqliteDb.run("PRAGMA journal_mode = WAL");
              
                sqliteDb.run(`CREATE TABLE IF NOT EXISTS usuarios (
                  id TEXT PRIMARY KEY,
                  username TEXT UNIQUE,
                  password_hash TEXT,
                  email TEXT,
                  phone TEXT UNIQUE,
                  is_verified INTEGER DEFAULT 0,
                  verification_code TEXT,
                  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )`);
                
                sqliteDb.run("ALTER TABLE usuarios ADD COLUMN phone TEXT", () => {});
                sqliteDb.run("ALTER TABLE registros ADD COLUMN user_id TEXT", () => {});
                sqliteDb.run("ALTER TABLE embarques ADD COLUMN user_id TEXT", () => {});
                sqliteDb.run("ALTER TABLE calculos ADD COLUMN user_id TEXT", () => {});
                
                seedDataIfNeeded();
              });
            }
          });
        });
      });
    }
  });

  db = {
    get: (sql, params, callback) => sqliteDb.get(sql, params, callback),
    all: (sql, params, callback) => sqliteDb.all(sql, params, callback),
    run: function(sql, params, callback) {
      sqliteDb.run(sql, params, function(err) {
        if (callback) callback.call(this, err);
      });
    },
    serialize: (callback) => sqliteDb.serialize(callback),
    prepare: (sql) => sqliteDb.prepare(sql)
  };
}

// Seed Initial Data from data.js
function seedDataIfNeeded() {
  db.get('SELECT COUNT(*) AS count FROM registros', (err, rowReg) => {
    if (err) return console.error(err);
    db.get('SELECT COUNT(*) AS count FROM embarques', (err, rowEmb) => {
      if (err) return console.error(err);

      const seedReg = rowReg.count === 0;
      const seedEmb = rowEmb.count === 0;

      if (seedReg || seedEmb) {
        console.log('Database missing initial data. Seeding from data.js...');
        try {
          const dataJs = fs.readFileSync(path.join(__dirname, 'data.js'), 'utf8');
          const jsContent = dataJs.replace('window.AduanaData =', 'module.exports =');
          fs.writeFileSync(path.join(__dirname, 'data_temp.js'), jsContent);
          const data = require('./data_temp.js');
          
          if (seedReg) {
            const registros = data.registrosIniciales || [];
            const stmtReg = db.prepare(`INSERT INTO registros 
              (id, refNo, fecha, estado, operacion, doc, aduana, patente, cliente, importadorExportador, c20, c40, bultos, clase, mercancia, observaciones, prioridad, contacto) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
            registros.forEach(r => {
              stmtReg.run(r.id, r.refNo, r.fecha, r.estado, r.operacion, r.doc, r.aduana, r.patente, r.cliente, r.importadorExportador, r.c20, r.c40, r.bultos, r.clase, r.mercancia, r.observaciones, r.prioridad, r.contacto);
            });
            stmtReg.finalize();
            console.log(`Seeded ${registros.length} records into registros.`);
          }

          if (seedEmb) {
            const embarques = data.embarquesIniciales || [];
            const stmtEmb = db.prepare(`INSERT INTO embarques 
              (id, cliente, mercancia, origen, puertoOrigen, destino, valorFactura, moneda, tipoOperacion, estado, semaforo, agenteAduanal, pedimento, documentos, historial) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
            embarques.forEach(e => {
              stmtEmb.run(
                e.id, e.cliente, e.mercancia, e.origen, e.puertoOrigen, e.destino, e.valorFactura, e.moneda, e.tipoOperacion, e.estado, e.semaforo, e.agenteAduanal, e.pedimento,
                JSON.stringify(e.documentos || []), JSON.stringify(e.historial || [])
              );
            });
            stmtEmb.finalize();
            console.log(`Seeded ${embarques.length} records into embarques.`);
          }

          fs.unlinkSync(path.join(__dirname, 'data_temp.js'));
        } catch (e) {
          console.error('Failed to seed data:', e);
        }
      }
    });
  });
}

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Usuario y contraseña son obligatorios' });
  
  db.get(`SELECT id FROM usuarios WHERE username = ?`, [username], async (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (row) return res.status(400).json({ error: 'El usuario ya está registrado' });

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = `USR-${Date.now()}`;

      db.run(
        `INSERT INTO usuarios (id, username, password_hash, is_verified) VALUES (?, ?, ?, 1)`, 
        [userId, username, hashedPassword], 
        async function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ success: true, message: 'Usuario registrado exitosamente. Ya puedes iniciar sesión.' });
        }
      );
    } catch (hashErr) {
      res.status(500).json({ error: 'Error processing password' });
    }
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM usuarios WHERE username = ?`, [username], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ success: true, token, username: user.username });
  });
});

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Apply authentication middleware to all routes below this line
app.use('/api', authenticateToken);

// ==========================================
// DATA API ROUTES
// ==========================================
// GET all registros
app.get('/api/registros', (req, res) => {
  db.all('SELECT * FROM registros WHERE user_id = ? ORDER BY fecha DESC', [req.user.id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// POST new registro
app.post('/api/registros', (req, res) => {
  const r = req.body;
  const sql = `INSERT INTO registros 
    (id, refNo, fecha, estado, operacion, doc, aduana, patente, cliente, importadorExportador, c20, c40, bultos, clase, mercancia, observaciones, prioridad, contacto, user_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [r.id, r.refNo, r.fecha, r.estado, r.operacion, r.doc, r.aduana, r.patente, r.cliente, r.importadorExportador, r.c20, r.c40, r.bultos, r.clase, r.mercancia, r.observaciones, r.prioridad, r.contacto, req.user.id];
  
  db.run(sql, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, id: r.id });
  });
});

// PUT update registro
app.put('/api/registros/:id', (req, res) => {
  const r = req.body;
  const sql = `UPDATE registros SET 
    refNo = ?, fecha = ?, estado = ?, operacion = ?, doc = ?, aduana = ?, patente = ?, cliente = ?, 
    importadorExportador = ?, c20 = ?, c40 = ?, bultos = ?, clase = ?, mercancia = ?, observaciones = ?, prioridad = ?, contacto = ?
    WHERE id = ? AND user_id = ?`;
  const params = [r.refNo, r.fecha, r.estado, r.operacion, r.doc, r.aduana, r.patente, r.cliente, r.importadorExportador, r.c20, r.c40, r.bultos, r.clase, r.mercancia, r.observaciones, r.prioridad, r.contacto, req.params.id, req.user.id];
  
  db.run(sql, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, changes: this.changes });
  });
});

// DELETE registro
app.delete('/api/registros/:id', (req, res) => {
  db.run(`DELETE FROM registros WHERE id = ? AND user_id = ?`, [req.params.id, req.user.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, changes: this.changes });
  });
});

// ==========================================
// API ROUTES FOR EMBARQUES
// ==========================================

// GET all embarques
app.get('/api/embarques', (req, res) => {
  db.all('SELECT * FROM embarques WHERE user_id = ?', [req.user.id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    // Parse JSON fields
    const parsedRows = rows.map(r => ({
      ...r,
      documentos: r.documentos ? JSON.parse(r.documentos) : [],
      historial: r.historial ? JSON.parse(r.historial) : []
    }));
    // Return sorted (just arbitrarily by id or leave as is)
    res.json(parsedRows);
  });
});

// POST new embarque
app.post('/api/embarques', (req, res) => {
  const e = req.body;
  const sql = `INSERT INTO embarques 
    (id, cliente, mercancia, origen, puertoOrigen, destino, valorFactura, moneda, tipoOperacion, estado, semaforo, agenteAduanal, pedimento, documentos, historial, user_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    e.id, e.cliente, e.mercancia, e.origen, e.puertoOrigen, e.destino, e.valorFactura, e.moneda, e.tipoOperacion, e.estado, e.semaforo, e.agenteAduanal, e.pedimento,
    JSON.stringify(e.documentos || []), JSON.stringify(e.historial || []), req.user.id
  ];
  
  db.run(sql, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, id: e.id });
  });
});

// PUT update embarque
app.put('/api/embarques/:id', (req, res) => {
  const e = req.body;
  const sql = `UPDATE embarques SET 
    cliente = ?, mercancia = ?, origen = ?, puertoOrigen = ?, destino = ?, valorFactura = ?, moneda = ?, 
    tipoOperacion = ?, estado = ?, semaforo = ?, agenteAduanal = ?, pedimento = ?, documentos = ?, historial = ?
    WHERE id = ? AND user_id = ?`;
  const params = [
    e.cliente, e.mercancia, e.origen, e.puertoOrigen, e.destino, e.valorFactura, e.moneda, e.tipoOperacion, e.estado, e.semaforo, e.agenteAduanal, e.pedimento,
    JSON.stringify(e.documentos || []), JSON.stringify(e.historial || []), req.params.id, req.user.id
  ];
  
  db.run(sql, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, changes: this.changes });
  });
});

// DELETE embarque
app.delete('/api/embarques/:id', (req, res) => {
  db.run(`DELETE FROM embarques WHERE id = ? AND user_id = ?`, [req.params.id, req.user.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, changes: this.changes });
  });
});

// ==========================================
// API ROUTES FOR CALCULOS (Cotizaciones)
// ==========================================

// GET all calculos
app.get('/api/calculos', (req, res) => {
  db.all('SELECT * FROM calculos WHERE user_id = ? ORDER BY fecha DESC', [req.user.id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// POST new calculo
app.post('/api/calculos', (req, res) => {
  const c = req.body;
  const sql = `INSERT INTO calculos 
    (id, fecha, fraccion_codigo, fraccion_nombre, valor_factura, flete, seguro, origen, igi, dta, iva, total_impuestos, user_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    c.id, c.fecha, c.fraccion_codigo, c.fraccion_nombre, c.valor_factura, c.flete, c.seguro, c.origen, c.igi, c.dta, c.iva, c.total_impuestos, req.user.id
  ];
  
  db.run(sql, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, id: c.id });
  });
});

// ── Health Check para UptimeRobot ──────────────────────────────────────────
// UptimeRobot hace GET a /health cada 5 min para mantener el servidor activo.
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
