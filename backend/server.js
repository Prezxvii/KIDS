const express    = require('express');
const dotenv     = require('dotenv');
const cors       = require('cors');
const connectDB  = require('./config/db');
const authRoutes  = require('./routes/authRoutes');
const mediaRoutes = require('./routes/mediaRoutes'); // ← NEW

// Load environment variables first
dotenv.config();

// Confirm keys loaded (shows ✅ or ❌ without exposing the actual values)
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
  // Add your deployed frontend URL here when you go live, e.g.:
  // 'https://kids-platform.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, mobile apps, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin} is not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle preflight requests for all routes
app.options(/(.*)/, cors());
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',  authRoutes);
app.use('/api/media', mediaRoutes); // ← NEW — handles /api/media/videos and /api/media/news

// ─── Health check ─────────────────────────────────────────────────────────────
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