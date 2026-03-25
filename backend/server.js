const express    = require('express');
const dotenv     = require('dotenv');
const cors       = require('cors');
const connectDB  = require('./config/db');
const authRoutes  = require('./routes/authRoutes');
const mediaRoutes = require('./routes/mediaRoutes');

// Load environment variables first
dotenv.config();

// Confirm keys loaded
console.log('ENV check:',
  'YOUTUBE_API_KEY:', process.env.YOUTUBE_API_KEY ? '✅ loaded' : '❌ MISSING',
  '| NEWS_API_KEY:',  process.env.NEWS_API_KEY    ? '✅ loaded' : '❌ MISSING',
  '| MONGO_URI:',     process.env.MONGO_URI        ? '✅ loaded' : '❌ MISSING'
);

// Connect to MongoDB
connectDB();

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'https://kids-lemon.vercel.app',    // production frontend
  'https://kids-o599.onrender.com',   // allow Render self-calls
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin} is not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle preflight for all routes
app.options(/(.*)/, cors());
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',  authRoutes);
app.use('/api/media', mediaRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.get('/', (req, res) => {
  res.json({
    message: 'KIDS Platform API is running ✅',
    endpoints: {
      auth:   '/api/auth/signup',
      videos: '/api/media/videos?category=Tech',
      news:   '/api/media/news?topic=NYC+youth+programs&pageSize=15',
    },
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));