const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Enable CORS for frontend at localhost:3000
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  socket.on('send_message', (data) => {
    console.log('📨 User said:', data.message);

    // Broadcast user message to all clients
    io.emit('receive_message', data);

    // Prepare smarter bot response
    const text = data.message.toLowerCase();
    let reply = '';

    if (text.includes('hello') || text.includes('hi')) {
      reply = 'Hey there! 👋 How can I help you today?';
    } else if (text.includes('time')) {
      reply = `⏰ It's currently ${new Date().toLocaleTimeString()}`;
    } else if (text.includes('joke')) {
      const jokes = [
        "Why do Java developers wear glasses? Because they don’t C# 😎",
        "Debugging: Being the detective in a crime movie where you're also the murderer. 🔍💀",
        "What is a programmer’s favorite hangout place? The Foo Bar! 🍸"
      ];
      reply = jokes[Math.floor(Math.random() * jokes.length)];
    } else if (text.includes('help')) {
      reply = "You can say 'hello', ask for 'time', request a 'joke', or just chat!";
    } else if (text.includes('who are you')) {
      reply = "I’m your friendly chatbot 🤖 powered by JavaScript and creativity!";
    } else {
      reply = "Hmm... I didn't understand that. Try asking for help!";
    }

    // Send bot reply after 1 second
    setTimeout(() => {
      io.emit('receive_message', {
        message: `🤖 Bot: ${reply}`,
        time: new Date().toLocaleTimeString(),
        sender: 'bot'
      });
    }, 1000);
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

server.listen(5000, () => {
  console.log('🚀 Smart bot server running on http://localhost:5000');
});
