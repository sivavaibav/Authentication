const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dns = require('dns');

require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

if (process.env.DNS_SERVERS) {
  const servers = process.env.DNS_SERVERS.split(',').map((s) => s.trim()).filter(Boolean);
  if (servers.length) dns.setServers(servers);
}

if (!MONGODB_URI) {
  // eslint-disable-next-line no-console
  console.error('Missing required env var: MONGODB_URI');
  process.exit(1);
}

if (!JWT_SECRET) {
  // eslint-disable-next-line no-console
  console.error('Missing required env var: JWT_SECRET');
  process.exit(1);
}

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json({ limit: '10kb' }));

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Backend listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
