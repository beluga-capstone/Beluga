const WebSocket = require('ws');
const os = require('os');
const pty = require('node-pty');
const process = require('process');
const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

// Default port or take it from the command line
const port = process.argv[2] ? parseInt(process.argv[2], 10) : 5000;

// Allowed origins for CORS
const allowedOrigins = ['http://localhost:3000', 'https://your-domain.com'];

const server = new WebSocket.Server({
    port,
    verifyClient: (info, done) => {
        const origin = info.origin;
        if (allowedOrigins.includes(origin)) {
            done(true); // Allow the connection
        } else {
            console.error(`Connection from disallowed origin: ${origin}`);
            done(false, 403, 'Forbidden'); // Reject the connection
        }
    },
});

console.log(`WebSocket terminal server running on port ${port}`);

server.on('connection', (ws) => {
    // Initialize PTY
    const ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: 110,
        rows: 24,
        cwd: process.env.HOME,
        env: process.env,
    });

    // Handle incoming data from client
    // ws.on('message', (data) => {
    //     ptyProcess.write(data.toString());
    // });
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data); // Expecting JSON format
            if (message.type === 'input') {
                // Pass terminal input to PTY
                ptyProcess.write(message.data);
            } else if (message.type === 'resize') {
                // Resize PTY based on client data
                const { cols, rows } = message;
                ptyProcess.resize(cols, rows);
            }
        } catch (err) {
            console.error('Error handling message:', err);
        }
    });

    // Handle PTY output
    ptyProcess.onData((data) => {
        try {
            ws.send(data);
        } catch (ex) {
            // Client probably disconnected
        }
    });

    // Handle resize events
    ws.on('resize', (data) => {
        try {
            const { cols, rows } = JSON.parse(data);
            ptyProcess.resize(cols, rows);
        } catch (ex) {
            console.error('Error resizing terminal:', ex);
        }
    });

    // Cleanup on close
    ws.on('close', () => {
        ptyProcess.kill();
    });
});

