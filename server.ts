
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, 'db.json');

// Initial data structure
const INITIAL_DATA = {
  users: [
    { id: 'u1', username: 'master', password: '123456', role: 'MASTER', name: 'Suporte Master', active: true },
    { id: 'u2', username: 'admin', password: '123456', role: 'ADMIN', name: 'Administração Geral', active: true },
    { id: 'u3', username: 'portaria', password: '123456', role: 'PORTARIA', name: 'Portaria Principal', active: true },
    { id: 'u4', username: 'sindico', password: '123456', role: 'SINDICO', name: 'Síndico Geral', active: true }
  ],
  deliveries: [],
  towers: [
    { id: 't1', name: 'Torre A - Ipê' },
    { id: 't2', name: 'Torre B - Jatobá' },
    { id: 't3', name: 'Torre C - Aroeira' },
    { id: 't4', name: 'Torre D - Algaroba' },
    { id: 't5', name: 'Torre E - Jacarandá' },
    { id: 't6', name: 'Torre F - Imbúia' },
  ],
  apartments: [] // Will be populated if empty
};

// Helper to load/save DB
const loadDB = () => {
  if (!fs.existsSync(DB_FILE)) {
    // Generate initial apartments if they don't exist
    const apts: any[] = [];
    INITIAL_DATA.towers.forEach(t => {
      for (let floor = 1; floor <= 20; floor++) {
        for (let unit = 1; unit <= 4; unit++) {
          const aptNum = `${floor}${unit.toString().padStart(2, '0')}`;
          apts.push({
            id: `${t.id}-${aptNum}`,
            towerId: t.id,
            number: aptNum,
            residentName: `Morador ${aptNum} ${t.name.split(' - ')[1]}`,
            residentPhone: `551199999${Math.floor(Math.random() * 9000) + 1000}`
          });
        }
      }
    });
    const data = { ...INITIAL_DATA, apartments: apts };
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return data;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
};

const saveDB = (data: any) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(bodyParser.json());

  // API Routes
  app.get('/api/db', (req, res) => {
    res.json(loadDB());
  });

  app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const db = loadDB();
    const user = db.users.find((u: any) => u.username === username && u.active);
    
    if (user && (user.password === password || !user.password)) {
      res.json({ success: true, user });
    } else if (user) {
      res.status(401).json({ success: false, message: 'Senha incorreta.' });
    } else {
      res.status(404).json({ success: false, message: 'Usuário não encontrado ou inativo.' });
    }
  });

  app.post('/api/deliveries', (req, res) => {
    const db = loadDB();
    db.deliveries = req.body;
    saveDB(db);
    res.json({ success: true });
  });

  app.post('/api/users', (req, res) => {
    const db = loadDB();
    db.users = req.body;
    saveDB(db);
    res.json({ success: true });
  });

  app.post('/api/apartments', (req, res) => {
    const db = loadDB();
    db.apartments = req.body;
    saveDB(db);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
