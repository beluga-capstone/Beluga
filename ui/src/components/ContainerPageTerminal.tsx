"use client";

import React, { useState, useEffect, useRef } from "react";
import { Terminal, ITerminalOptions, ITerminalInitOnlyOptions } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { io, Socket } from "socket.io-client";
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
  const terminalInstanceRef = useRef<Terminal | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isRunning && containerPort && !isConnected) {
      initializeTerminal();
    }

    return () => {
      disconnectTerminal();
    };
  }, [isRunning, containerPort]);

  const initializeTerminal = () => {
    if (!terminalRef.current) return;

    // Clear the old terminal instance, if it exists
    if (terminalInstanceRef.current) {
      terminalInstanceRef.current.dispose();
      terminalInstanceRef.current = null;
    }

    const term = new Terminal(terminalOptions);
    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);

    term.open(terminalRef.current);
    fitAddon.fit();

    const socket = io(`ws://localhost:${containerPort}/pty`);
    socketRef.current = socket;

    // Set up terminal and socket communication
    term.onData((data) => {
      socket.emit("pty-input", { input: data });
    });

    socket.on("pty-output", (data) => {
      term.write(data.output);
    });

    // Connection handlers
    socket.on("connect", () => {
      term.clear(); // Clear the terminal upon reconnect
      term.writeln("\x1b[32mConnected to your virtual environment.\x1b[0m");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      term.writeln("\x1b[31mDisconnected from your virtual environment.\x1b[0m");
      setIsConnected(false);
    });

    fitAddonRef.current = fitAddon;
    terminalInstanceRef.current = term;
  };

  const disconnectTerminal = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    if (terminalInstanceRef.current) {
      terminalInstanceRef.current.dispose();
      terminalInstanceRef.current = null;
    }
    setIsConnected(false);
  };

  return <div ref={terminalRef} role="terminal textbox" />;
};

export default ContainerPageTerminal;

