const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Set up WebSocket connection
wss.on('connection', (ws) => {
    console.log('Client connected');

    // Send a welcome message to the client
    ws.send(JSON.stringify({ type: 'welcome', message: 'Welcome to the WebSocket server!' }));

    ws.on('message', (message) => {
        console.log('Received from client:', message);

        // Broadcast message to all connected clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'broadcast', message }));
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

app.post('/send-message', express.json(), (req, res) => {
    const { message } = req.body;

    // Broadcast the custom message to all connected clients
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'custom', message }));
        }
    });

    res.send({ status: 'Message sent to all clients' });
});

app.get('/', express.json(), (req, res) => {
    res.send({ message: 'test' });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
