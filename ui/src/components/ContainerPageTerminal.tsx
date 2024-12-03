import React, { useState, useEffect, useRef } from "react";
import { Terminal, ITerminalOptions, ITerminalInitOnlyOptions } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import "@xterm/xterm/css/xterm.css";

// Terminal initialization options
const terminalOptions: ITerminalOptions & ITerminalInitOnlyOptions = {
  cursorBlink: true,
  fontSize: 22,
  fontFamily: 'Menlo, Monaco, "Courier New", monospace',
  theme: {
    background: "#1e1e1e",
    foreground: "#ffffff",
  },
  convertEol: true,
  cursorStyle: "block",
  scrollback: 1000,
};

interface ContainerPageTerminalProps {
  isRunning: boolean;
  containerPort: number | null;
}

const ContainerPageTerminal: React.FC<ContainerPageTerminalProps> = ({
  isRunning,
  containerPort,
}) => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  // Helper function to calculate cols and rows
  const calculateTerminalSize = () => {
    const terminalElement = terminalRef.current;
    if (!terminalElement) return { cols: 80, rows: 24 }; // Default size

    const width = terminalElement.clientWidth;
    const height = terminalElement.clientHeight;
    const fontSize = terminalOptions.fontSize || 22;

    // Calculate columns and rows based on the terminal's container size
    const cols = Math.floor(width / (fontSize * 0.6)); // Approximate width per column
    const rows = Math.floor(height / (fontSize * 1.2)); // Approximate height per row

    return { cols, rows };
  };

  useEffect(() => {
    if (!terminalRef.current || !isRunning) return;

    // Init terminal
    const term = new Terminal(terminalOptions);
    xtermRef.current = term;
    const fitAddon = new FitAddon();
    fitAddonRef.current = fitAddon;
    const webLinksAddon = new WebLinksAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);

    // Define websocket
    const ws = new WebSocket(`${process.env.wsbackend}:${containerPort}`);
    socketRef.current = ws;

    // Open terminal
    term.open(terminalRef.current);
    setTimeout(() => fitAddon.fit(), 0);

    ws.onopen = () => {
      // Handle terminal input
      term.onData((data: string) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'input', data }));
        }
      });

      // Handle terminal resize
      const resizeTerminal = () => {
        if (ws.readyState === WebSocket.OPEN) {
          const { cols, rows } = calculateTerminalSize();
          ws.send(JSON.stringify({ type: 'resize', cols, rows }));
        }
      };

      term.onResize(() => {
        resizeTerminal();
      });
    };

    ws.onmessage = (event: MessageEvent) => {
      term.write(event.data);
    };

    ws.onerror = () => {
      term.writeln('\x1b[31mWebSocket error occurred\x1b[0m');
    };

    ws.onclose = (event: CloseEvent) => {
      // Handle disconnection
    };

    // Handle window resize
    const handleResize = (): void => {
      fitAddonRef.current?.fit();
      const resizeTerminal = () => {
        if (ws.readyState === WebSocket.OPEN) {
          const { cols, rows } = calculateTerminalSize();
          ws.send(JSON.stringify({ type: 'resize', cols, rows }));
        }
      };
      resizeTerminal(); // Recalculate and resize terminal
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
  }, [isRunning, containerPort]);

  return (
    <>
      <div ref={terminalRef} role="terminal textbox" style={{ width: '100%', height: '100%' }} />
    </>
  );
};

export default ContainerPageTerminal;

