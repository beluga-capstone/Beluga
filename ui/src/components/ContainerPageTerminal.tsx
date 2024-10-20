"use client";

import React, { useEffect, useRef } from 'react';
import { Terminal, ITerminalOptions } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import '@xterm/xterm/css/xterm.css';

const ContainerPageTerminal: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    const terminalOptions: ITerminalOptions = {
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#1e1e1e',
        foreground: '#ffffff'
      },
      convertEol: true,
      cursorStyle: 'block',
      scrollback: 1000,
    };

    // Initialize terminal
    const term = new Terminal(terminalOptions);
    xtermRef.current = term;

    // Create addons
    const fitAddon = new FitAddon();
    fitAddonRef.current = fitAddon;
    const webLinksAddon = new WebLinksAddon();

    // Load addons
    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);

    // Open terminal
    term.open(terminalRef.current);
    fitAddon.fit();

    // Initialize WebSocket
    const ws = new WebSocket('ws://localhost:8080');
    socketRef.current = ws;

    ws.onopen = () => {
      term.writeln('\x1b[32mConnected to your virtual environment.\x1b[0m');
      
      // Handle terminal input
      term.onData((data: string) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(data);
        }
      });

      // Handle terminal resize
      term.onResize(({ cols, rows }) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'resize', cols, rows }));
        }
      });
    };

    ws.onmessage = (event: MessageEvent) => {
      term.write(event.data);
    };

    ws.onerror = () => {
      term.writeln('\x1b[31mWebSocket error occurred\x1b[0m');
    };

    ws.onclose = (event: CloseEvent) => {
      term.writeln(`\x1b[31mDisconnected from terminal server (${event.code})\x1b[0m`);
    };

    // Handle window resize
    const handleResize = (): void => {
      fitAddonRef.current?.fit();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
      term.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="w-full h-full min-h-[400px] p-4 bg-gray-900">
      <div 
        ref={terminalRef} 
        className="w-full h-full rounded-lg overflow-hidden"
        aria-label="Terminal emulator"
        role="terminal"
      />
    </div>
  );
};

export default ContainerPageTerminal;