const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const MONGODB_CONFIG = require('./mongodb');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const client = new MongoClient(MONGODB_CONFIG.connectionString);
let db;

// --- Connect to MongoDB first ---
async function startServer() {
  try {
    await client.connect();
    db = client.db(MONGODB_CONFIG.databaseName);
    console.log("✅ MongoDB connected");

    // --- Register ---
    app.post('/api/register', async (req, res) => {
      try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
          return res.status(400).json({ error: 'All fields required' });
        }

        const existing = await db.collection(MONGODB_CONFIG.usersCollection).findOne({ email });
        if (existing) return res.status(400).json({ error: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.collection(MONGODB_CONFIG.usersCollection).insertOne({
          name,
          email,
          password: hashedPassword,
          createdAt: new Date()
        });

        res.json({ success: true, userId: result.insertedId });
      } catch (err) {
        console.error("❌ Register error:", err);
        res.status(500).json({ error: 'Server error during registration' });
      }
    });

    // --- Login ---
    app.post('/api/login', async (req, res) => {
      try {
        const { email, password } = req.body;
        const user = await db.collection(MONGODB_CONFIG.usersCollection).findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, MONGODB_CONFIG.jwtSecret, { expiresIn: '1h' });
        res.json({ token, user: { name: user.name, email: user.email } });
      } catch (err) {
        console.error("❌ Login error:", err);
        res.status(500).json({ error: 'Server error during login' });
      }
    });

    // --- Protected ---
    app.get('/api/protected', (req, res) => {
      const authHeader = req.headers['authorization'];
      if (!authHeader) return res.status(401).json({ error: 'No token' });

      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, MONGODB_CONFIG.jwtSecret);
        res.json({ message: 'Access granted', userId: decoded.userId });
      } catch (err) {
        return res.status(403).json({ error: 'Invalid token' });
      }
    });

    // --- Default route ---
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'login.html'));
    });

    // ✅ Start server only after DB is ready
    app.listen(3000, () => console.log('✅ Server running on http://localhost:3000'));
  } catch (err) {
    console.error("❌ Could not connect to MongoDB:", err);
    process.exit(1);
  }
}

startServer();
