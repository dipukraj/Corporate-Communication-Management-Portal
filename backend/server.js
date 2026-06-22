require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const contentRoutes = require('./routes/contentRoutes');
const magazineRoutes = require('./routes/magazineRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.netlify.app') ||
        origin.endsWith('.onrender.com') ||
        origin.endsWith('.railway.app') ||
        origin.endsWith('.web.app') ||
        origin.endsWith('.firebaseapp.com')
      ) {
        return callback(null, true);
      }
      callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    message: 'CMS Portal API is running',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/magazine', magazineRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️  Server chal raha hai lekin MongoDB connect nahi hai — login kaam nahi karega.');
    }
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ Port ${PORT} already in use!`);
      console.error('   Fix: Purana server band karo, phir dubara npm run dev chalao.');
      console.error(`   Command: netstat -ano | findstr :${PORT}`);
      console.error('   Phir: taskkill /PID <number> /F\n');
    } else {
      console.error('Server error:', err.message);
    }
    process.exit(1);
  });
};

startServer();
