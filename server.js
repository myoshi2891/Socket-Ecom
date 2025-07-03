const express = require('express');
const {createServer} = require('http');
const next = require("next");
const WebSocket = require('ws');


// 1. Setup Next.js and Express
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev })
const handler = app.getRequestHandler();

const server = express()
const httpServer = createServer(server)

// 2. Setup WebSocket Server
const wss = new WebSocket.Server({ server: httpServer })
const watchers = new Map()

wss.on('connection', (ws, res) => { 
    const productId = req.url && req.url.split('/').pop()
    if (!productId) return 

    // Increment watcher count
    const currentCount = (watchers.get(productId) || 0) + 1
    watchers.set(productId, currentCount)
    console.log(`New connection for product ${productId} with ${currentCount} watchers`);
    
    // Notify all connected clients about the new watcher count
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ productId, count: currentCount }))
        }
    })

    // Handle disconnection
    ws.on("close", () => {
        const updatedCount = Math.max((watchers.get(productId) || 0) - 1, 0)
        if (updatedCount === 0) {
            watchers.delete(productId) // Remove entry if no watchers left
        } else { 
        watchers.set(productId, updatedCount)
        }
        console.log(`Connection closed for product ${productId} : ${updatedCount} watchers`);

        // Notify all clients about the updated watcher count
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ productId, count: currentCount }))
            }
        })
    })

    // Send initial message
    ws.send(
        JSON.stringify({
            message: 'Connected to the WebSocket server!',
            productId,
            count: currentCount
        })
    )
})

// 3. Handle Next.js Routing
server.all('*', (req, res) => {
    return handler(req, res)
})

// 4. Start the Server
httpServer.listen(4000, (err) => {
    if (err) throw err
    console.log(`Server is running on http://localhost:4000`)
})