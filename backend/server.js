const express    = require('express');
const dotenv     = require('dotenv');
const cors       = require('cors');
const connectDB  = require('./config/db');
const authRoutes  = require('./routes/authRoutes');
const mediaRoutes = require('./routes/mediaRoutes');

// 1. Load environment variables
dotenv.config();

// 2. Connect to MongoDB
connectDB();

const app = express();

// 3. Simple & Robust CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://kids-lemon.vercel.app' 
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or mobile)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 4. Middleware
app.use(express.json());

// 5. Routes - Explicitly defined to prevent PathErrors
app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);

// 6. Health Check & Root
app.get('/health', (req, res) => res.status(200).json({ status: 'active' }));

app.get('/', (req, res) => {
  res.json({ message: 'KIDS Platform API is Live 🚀' });
});

// 7. Start Server
const PORT = process.env.PORT || 5000;

// Binding to 0.0.0.0 is critical for Render to assign a public IP
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});