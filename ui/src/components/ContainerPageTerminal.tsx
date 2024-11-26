"use client";
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
  const [isConnected, setIsConnected] = useState(false);

  const initializeTerminal = () => {
    if (!terminalRef.current || !containerPort) return;

    // Initialize terminal
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
      setIsConnected(true);
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
      setIsConnected(false);
      term.writeln(`\x1b[31mDisconnected from terminal server (${event.code})\x1b[0m`);
    };

    // Handle window resize
    const handleResize = (): void => {
      fitAddonRef.current?.fit();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  };

  const disconnectTerminal = () => {
    // Close WebSocket
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.close();
    }

    // Dispose of terminal
    if (xtermRef.current) {
      xtermRef.current.dispose();
      xtermRef.current = null;
    }

    // Reset state
    setIsConnected(false);
  };

  useEffect(() => {
    console.log(isRunning, containerPort, isConnected);
    
    if (isRunning && containerPort && !isConnected) {
      const cleanup = initializeTerminal();
      
      return () => {
        disconnectTerminal();
        cleanup?.();
      };
    }
  }, [isRunning, containerPort]);

  return (
    <>
      <div 
        ref={terminalRef} 
        className="w-full"
        role="terminal textbox" 
      />
    </>
  );
};

export default ContainerPageTerminal;
