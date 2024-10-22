"use client";

import React, { useEffect, useRef } from 'react';
import { Terminal, ITerminalOptions, ITerminalInitOnlyOptions } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import '@xterm/xterm/css/xterm.css';

const terminalOptions: ITerminalOptions & ITerminalInitOnlyOptions = {
  // terminal init options

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

const ContainerPageTerminal: React.FC<{ socketAddr: string }> = ({ socketAddr }) => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // init terminal
    const term = new Terminal(terminalOptions);
    xtermRef.current = term;
    const fitAddon = new FitAddon();
    fitAddonRef.current = fitAddon;
    const webLinksAddon = new WebLinksAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);

    // define websocket
    const ws = new WebSocket(socketAddr);
    socketRef.current = ws;

    // Open terminal
    term.open(terminalRef.current);
    setTimeout(() => fitAddon.fit(), 0);

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
    <>
      <div 
        ref={terminalRef} 
        aria-label="Terminal emulator"
        role="terminal"
      />
    </>
  );
};

export default ContainerPageTerminal;