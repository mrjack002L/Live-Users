const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config(); 

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Database connection failed", err);
    process.exit(1);
  }
};

connectDB();

app.use(bodyParser.json());
app.use(express.static('public'));

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

const User = require('./models/User');

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join', async (email) => {
    try {
      const user = await User.findOne({ email });
      if (user) {
        socket.email = email;
        socket.join('mainRoom');
        io.to('mainRoom').emit('updateUsers', await getOnlineUsers());
      } else {
        socket.emit('error', 'Email not registered. Please check and try again.');
      }
    } catch (err) {
      console.error('Error handling join event:', err);
      socket.emit('error', 'An error occurred while joining the room.');
    }
  });

  socket.on('disconnect', async () => {
    console.log('Client disconnected');
    try {
      if (socket.email) {
        io.to('mainRoom').emit('updateUsers', await getOnlineUsers());
      }
    } catch (err) {
      console.error('Error handling disconnect event:', err);
    }
  });
});

// Get list of online users
async function getOnlineUsers() {
  try {
    const sockets = await io.in('mainRoom').fetchSockets();
    return sockets.map(s => ({ email: s.email, socketId: s.id }));
  } catch (err) {
    console.error('Error fetching online users:', err);
    return [];
  }
}

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
