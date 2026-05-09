require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { initSocket } = require('./socket/socketManager');
const expertRoutes = require('./routes/experts');
const bookingRoutes = require('./routes/bookings');
const errorHandler = require('./middleware/errorHandler');
const Expert = require('./models/Expert');

const app = express();
const httpServer = http.createServer(app);

// Initialize Socket.io
initSocket(httpServer);

// Middleware
app.use(cors({ 
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"], 
  credentials: true 
}));
app.use(express.json());

// Routes
app.use('/api/experts', expertRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Error handler (must be last)
app.use(errorHandler);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/expertbooking';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('[DB] Connected to MongoDB');
    
    // Seed Data
    const count = await Expert.countDocuments();
    if (count === 0) {
      console.log('Seeding initial expert data...');
      const categories = ['Tech', 'Business', 'Health', 'Finance', 'Legal', 'Design'];
      const seedExperts = [];
      
      const getNext7Days = () => {
        const slots = [];
        for(let i=0; i<7; i++) {
          const d = new Date();
          d.setDate(d.getDate() + i);
          const dateStr = d.toISOString().split('T')[0];
          slots.push(
            { date: dateStr, time: '10:00 AM', isBooked: false },
            { date: dateStr, time: '02:00 PM', isBooked: false }
          );
        }
        return slots;
      };

      for(let i=0; i<12; i++) {
        const category = categories[i % 6];
        seedExperts.push({
          name: `Expert ${i+1}`,
          category: category,
          experience: Math.floor(Math.random() * 10) + 2,
          rating: Number((Math.random() * 2 + 3).toFixed(1)),
          bio: `Experienced professional in ${category}. Ready to help you with your challenges.`,
          avatar: `https://ui-avatars.com/api/?name=Expert+${i+1}&background=random`,
          availableSlots: getNext7Days()
        });
      }
      
      await Expert.insertMany(seedExperts);
      console.log(`Seeded ${seedExperts.length} experts.`);
    }

    httpServer.listen(PORT, () => {
      console.log(`[Server] Running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[DB] Connection failed:', err.message);
    process.exit(1);
  });
