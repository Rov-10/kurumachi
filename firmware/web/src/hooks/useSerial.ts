"use client";
import { useState } from "react";

// Розширюємо типи для підтримки нативного Web Serial API без сторонніх ліб
interface SerialPort {
  open(options: { baudRate: number }): Promise<void>;
  close(): Promise<void>;
  writable: WritableStream | null;
  readable: ReadableStream | null;
}

interface NavigatorSerial extends Navigator {
  serial: {
    requestPort(): Promise<SerialPort>;
  };
}

export function useSerial() {
  const [port, setPort] = useState<SerialPort | null>(null);
  const [status, setStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev.slice(0, 19)]);
  };

  const connect = async () => {
    // Безпечна перевірка наявності API в браузері
    if (typeof window !== "undefined" && !("serial" in navigator)) {
      alert("Web Serial API is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    const nav = navigator as NavigatorSerial;

    try {
      setStatus("connecting");
      addLog("Requesting serial port connection...");
      
      // Strongly typed нативний виклик
      const selectedPort = await nav.serial.requestPort();
      await selectedPort.open({ baudRate: 115200 });
      
      setPort(selectedPort);
      setStatus("connected");
      addLog("Successfully connected to KURUMACHI (ESP32-C3) at 115200 baud.");
    } catch (error) {
      console.error(error);
      setStatus("disconnected");
      addLog("Connection failed or cancelled by user. Entering MOCK simulation mode.");
      
      // Імітуємо підключення для демонстрації (Mock-режим)
      setTimeout(() => {
        setStatus("connected");
        addLog("[SIMULATOR] Connected to virtual Kurumachi core v1.0.4");
      }, 1000);
    }
  };

  const disconnect = async () => {
    if (port) {
      try {
        await port.close();
      } catch (e) {
        console.error("Error closing port:", e);
      }
      setPort(null);
    }
    setStatus("disconnected");
    addLog("Port closed. Device disconnected.");
  };

  const sendData = async (command: string) => {
    addLog(`Sending command: ${command}`);
    
    if (port && port.writable) {
      try {
        const encoder = new TextEncoder();
        const writer = port.writable.getWriter();
        await writer.write(encoder.encode(command + "\n"));
        writer.releaseLock();
        addLog("Data successfully transmitted over hardware serial channel.");
      } catch (error) {
        console.error("Write error:", error);
        addLog("Hardware transmission failed. Redirecting to simulator.");
      }
    } else {
      addLog(`[SIMULATOR] Command acknowledged by virtual core.`);
    }
  };

  return { status, logs, connect, disconnect, sendData };
}