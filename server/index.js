require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { loadSecrets } = require('./config/secrets');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

// Sync database and start server
async function start() {
  try {
    // Load secrets from Secrets Manager before initializing DB/S3
    await loadSecrets();

    // Require after secrets are loaded so env vars are available
    const { sequelize } = require('./config/db');
    const photoRoutes = require('./routes/photos');

    // API routes
    app.use('/api/photos', photoRoutes);

    // Catch-all for frontend in production
    if (process.env.NODE_ENV === 'production') {
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
      });
    }

    const PORT = process.env.PORT || 3000;

    await sequelize.authenticate();
    console.log('Database connected successfully.');
    await sequelize.sync({ alter: true });
    console.log('Database synced.');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      if (process.env.NODE_ENV === 'production') {
        console.log(`App available at http://localhost:${PORT}`);
      } else {
        console.log(`API available at http://localhost:${PORT}/api`);
        console.log(`Frontend dev server at http://localhost:5173`);
      }
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

start();
