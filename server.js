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


// 3. Handle Next.js Routing
server.all('*', (req, res) => {
    return handler(req, res)
})

// 4. Start the Server
httpServer.listen(4000, (err) => {
    if (err) throw err
    console.log(`Server is running on http://localhost:4000`)
})