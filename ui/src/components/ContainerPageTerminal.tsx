"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ITerminalOptions, ITerminalInitOnlyOptions } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { io, Socket } from 'socket.io-client';
import { useProfile } from '@/hooks/useProfile';
import '@xterm/xterm/css/xterm.css';

// Terminal initialization options
const terminalOptions: ITerminalOptions & ITerminalInitOnlyOptions = {
  cursorBlink: true,
  fontSize: 22,
  fontFamily: 'Menlo, Monaco, "Courier New", monospace',
  theme: {
    background: '#1g1g1g',
    foreground: '#ffffff',
  },
  convertEol: true,
  cursorStyle: 'block',
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
  const socketRef = useRef<Socket | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isRunning && containerPort && !isConnected) {
      console.log('initing term');
      initializeTerminal();
    }
    console.log(isRunning,containerPort,isConnected);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [isRunning, containerPort]);

  const initializeTerminal = () => {
    if (!terminalRef.current) return;

    const term = new Terminal(terminalOptions);
    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);

    term.open(terminalRef.current);

    //const socket = io(`ws://localhost:5656/pty`);
    const socket = io(`ws://localhost:${containerPort}/pty`);
    socketRef.current = socket;

    // Host sends terminal data
    term.onData((data) => {
      socket.emit('pty-input', { input: data });
    });

    // Host receives terminal data
    socket.on('pty-output', (data) => {
      term.write(data.output);
    });

    // Connection handlers
    socket.on('connect', () => {
      term.writeln('\x1b[32mConnected to your virtual environment.\x1b[0m');
      setIsConnected(true);
      socket.emit('pty-input', { input: '\n' });
    });

    socket.on('disconnect', () => {
      term.writeln('\x1b[32mDisconnected from your virtual environment.\x1b[0m');
      setIsConnected(false);
    });

    fitAddonRef.current = fitAddon;
  };


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

