const express    = require('express');
const dotenv     = require('dotenv');
const cors       = require('cors');
const connectDB  = require('./config/db');
const authRoutes  = require('./routes/authRoutes');
const mediaRoutes = require('./routes/mediaRoutes');

// 1. Load environment variables
dotenv.config();

// 2. Connect to MongoDB
// NOTE: If this fails, the server will crash. Ensure MONGO_URI is in Render Env Vars.
connectDB();

const app = express();

// 3. CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://kids-lemon.vercel.app', // Your Production Frontend
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`🚫 CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle preflight requests
app.options('*', cors());

// 4. Middleware
app.use(express.json());

// 5. Routes
app.use('/api/auth',  authRoutes);
app.use('/api/media', mediaRoutes);

// 6. Health Check (Crucial for Render to see the app is "Alive")
app.get('/health', (req, res) => res.status(200).json({ status: 'active' }));

app.get('/', (req, res) => {
  res.json({ message: 'KIDS Platform API is Live 🚀' });
});

// 7. Start Server
const PORT = process.env.PORT || 5000;
// We bind to '0.0.0.0' specifically for Render/Cloud environments
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});