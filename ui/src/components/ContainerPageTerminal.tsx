import { useEffect, useRef } from 'react';
import 'xterm/css/xterm.css';
import { io, Socket } from 'socket.io-client';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

const FontSize = 16;
const Col = 80;

const ContainerPageTerminal = () => {
  const webTerminal = useRef<Terminal | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const initializeTerminal = async () => {
      const ele = document.getElementById('terminal');
      if (ele && !webTerminal.current) {
        const height = ele.clientHeight;

        // init xterm terminal
        const terminal = new Terminal({
          cursorBlink: true,
          cols: Col,
          rows: Math.ceil(height / FontSize),
        });

        const fitAddon = new FitAddon();
        terminal.loadAddon(fitAddon);

        terminal.open(ele);
        terminal.focus();
        fitAddon.fit();
        webTerminal.current = terminal;

        const socket = io('http://172.17.0.2:8080');
        socketRef.current = socket;

        terminal.onData((data) => socket.emit('message', data));

        socket.on('message', (data) => terminal.write(data));

        socket.on('error', (err) => {
          console.error('Socket.IO error:', err);
        });

        return () => {
          socket.disconnect();
        };
      }
    };

    initializeTerminal();

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <div
      id="terminal"
      className="bg-black w-full h-[89%] pl-6 pt-2 rounded-sm"
    />
  );
};

export default ContainerPageTerminal;
