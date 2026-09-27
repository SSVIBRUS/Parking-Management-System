const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const slotsRoutes = require('./routes/slots');
const guestRoutes = require('./routes/guest');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/slots', slotsRoutes);
app.use('/api/guest', guestRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'College Smart Parking System (Single Link Unified Engine)',
    theme: 'Theme 2 Emerald Academic',
    dimensions: '170ft x 120ft',
    slotsSummary: { twoWheeler: 175, guest: 15, fourWheeler: 30, total: 220 },
    timestamp: new Date().toISOString()
  });
});

// Detect dist location (root dist or frontend/dist)
const distPath = fs.existsSync(path.join(__dirname, '../dist'))
  ? path.join(__dirname, '../dist')
  : path.join(__dirname, '../frontend/dist');

app.use(express.static(distPath));

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.send('College Smart Parking System API & Frontend Engine Online');
    }
  }
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 College Smart Parking System running on SINGLE LINK:`);
    console.log(`   👉 http://localhost:${PORT}`);
    console.log(`   Dimensions: 170ft x 120ft`);
    console.log(`   Slots: 175 Two-Wheeler | 15 Guest | 30 Four-Wheeler`);
    console.log(`====================================================`);
  });
}

module.exports = app;
