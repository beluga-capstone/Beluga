const WebSocket = require('ws');
const os = require('os');
const pty = require('node-pty');
const process = require('process');
const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

// Default port or take it from the command line
const port = process.argv[2] ? parseInt(process.argv[2], 10) : 5000;

const server = new WebSocket.Server({ port });
console.log(`WebSocket terminal server running on port ${port}`);
server.on('connection', (ws) => {
    // Initialize PTY
    const ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 24,
        cwd: process.env.HOME,
        env: process.env
    });
    // Handle incoming data from client
    ws.on('message', (data) => {
        ptyProcess.write(data.toString());
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

