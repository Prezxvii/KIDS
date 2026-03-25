const express    = require('express');
const dotenv     = require('dotenv');
const cors       = require('cors');
const connectDB  = require('./config/db');
const authRoutes  = require('./routes/authRoutes');
const mediaRoutes = require('./routes/mediaRoutes');

// Load environment variables
dotenv.config();

// Debugging: Confirm keys are loaded in the Render environment
console.log('--- Environment Check ---');
console.log('YOUTUBE_API_KEY:', process.env.YOUTUBE_API_KEY ? '✅' : '❌');
console.log('NEWS_API_KEY:',    process.env.NEWS_API_KEY    ? '✅' : '❌');
console.log('MONGO_URI:',       process.env.MONGO_URI       ? '✅' : '❌');
console.log('-------------------------');

// Connect to MongoDB
connectDB();

const app = express();

// ─── CORS CONFIGURATION ──────────────────────────────────────────────────────
// This section allows your Vercel frontend to communicate with this Render backend.
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'https://kids-lemon.vercel.app', // Your specific Vercel URL
];

app.use(cors({
  origin: (origin, callback) => {
    // 1. Allow requests with no origin (like Postman or mobile apps)
    if (!origin) return callback(null, true);
    
    // 2. Check if the origin is in our allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.error(`CORS Blocked: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle preflight requests
app.options('*', cors());
app.use(express.json());

// ─── ROUTES ──────────────────────────────────────────────────────────────────
app.use('/api/auth',  authRoutes);
app.use('/api/media', mediaRoutes);

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    status: 'Success',
    message: 'KIDS Platform API is live ✅',
    timestamp: new Date().toISOString()
  });
});

// ─── START SERVER ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 Accepting requests from: ${allowedOrigins.join(', ')}`);
});