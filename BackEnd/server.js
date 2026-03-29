const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/job');
const companyRoutes = require('./routes/company');
const applicationRoutes = require('./routes/application');
const contactRoutes = require('./routes/contact');
const path = require('path');

const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const Message = require('./models/Message');

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Socket.io initialization
io.on('connection', (socket) => {
  console.log('User connected', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User join room: ${userId}`);
  });

  socket.on('sendMessage', async (data) => {
    const { senderId, receiverId, content } = data;
    try {
      const newMessage = new Message({ senderId, receiverId, content });
      await newMessage.save();
      
      // Emit to both sender and receiver
      io.to(senderId).to(receiverId).emit('receiveMessage', newMessage);
      console.log(`Message sent from ${senderId} to ${receiverId}`);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Routes
const PORT = process.env.PORT || 5000;

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/chat', require('./routes/chat'));

const User = require('./models/User');
const Job = require('./models/Job');
const Company = require('./models/Company');
const Application = require('./models/Application');
const { verifyToken, checkRole } = require('./middleware/auth');

app.get('/api/stats', [verifyToken, checkRole('admin')], async (req, res) => {
  try {
    const usersCount = await User.countDocuments({ role: 'user' });
    const companiesCount = await Company.countDocuments();
    const jobsCount = await Job.countDocuments();
    const applicationsCount = await Application.countDocuments();
    res.json({ users: usersCount, companies: companiesCount, jobs: jobsCount, applications: applicationsCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
