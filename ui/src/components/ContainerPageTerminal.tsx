"use client";

import React, { useEffect, useRef } from 'react';
import { Terminal, ITerminalOptions, ITerminalInitOnlyOptions } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { io, Socket } from 'socket.io-client';
import '@xterm/xterm/css/xterm.css';

const terminalOptions: ITerminalOptions & ITerminalInitOnlyOptions = {
  // terminal init options
  // none

  // terminal options
  cursorBlink: true,
  fontSize: 22,
  fontFamily: 'Menlo, Monaco, "Courier New", monospace',
  theme: {
    background: '#1g1g1g',
    foreground: '#ffffff'
  },
  convertEol: true,
  cursorStyle: 'block',
  scrollback: 1000,
};

const ContainerPageTerminal: React.FC<{ containerId: number | null }> = ({ containerId }) => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // init terminal
    const term = new Terminal(terminalOptions);
    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);
    
    const connectToContainer = async () => {
      // try {
      //   const response = await fetch('http://localhost:3001/container/connect', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json'
      //     },
      //     body: JSON.stringify({ 'container_id': 7})
      //   });

      //   if (response.ok) {
      //     const data = await response.json();
      //     console.log('Container connection info:', data);

          // Connect to WebSocket using the returned port
          // const socket = io(`http://localhost:${data.port}/pty`);
          const socket = io(`ws://localhost:5000/pty`);
          socketRef.current=socket;
          
          if (!terminalRef.current) return;
          term.open(terminalRef.current);
    
          // host sends terminal data
          term.onData((data) => {
            socket.emit("pty-input", { input: data });
          });
          
          socketRef.current.on('connect', () => {
            term.writeln('\x1b[32mConnected to your virtual environment.\x1b[0m');
            socket.emit("pty-input", {input: "\n"})
          });
          socketRef.current.on('disconnect', () => {
            term.writeln('\x1b[32mDisconnected from your virtual environment.\x1b[0m');
          });

          // host receive terminal data
          socketRef.current.on("pty-output", function (data) {
            term.write(data.output);
          });
          
      //   } else {
      //     console.error('Failed to connect container:', response.statusText);
      //   }
      // } catch (error) {
      //   console.error('Error connecting to container:', error);
      // }
    };

    connectToContainer();
    
    return () => {
      term.dispose();
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <>
      <div 
        ref={terminalRef} 
        role="terminal textbox" 
      />
    </>
  );
};

export default ContainerPageTerminal;