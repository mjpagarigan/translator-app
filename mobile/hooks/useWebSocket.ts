import { useState, useRef, useCallback, useEffect } from "react";
import { TranslationWebSocket } from "../services/websocket";
import { WSMessage } from "../types";
import { WS_BASE_URL } from "../constants/config";

interface UseWebSocketReturn {
  isConnected: boolean;
  lastMessage: WSMessage | null;
  connect: (targetLang: string, voiceId: string | null) => void;
  disconnect: () => void;
  sendAudio: (data: ArrayBuffer) => void;
}

export function useWebSocket(baseUrl?: string): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WSMessage | null>(null);
  const wsRef = useRef<TranslationWebSocket | null>(null);

  const connect = useCallback(
    (targetLang: string, voiceId: string | null) => {
      // Disconnect existing
      wsRef.current?.disconnect();

      const ws = new TranslationWebSocket(
        targetLang,
        voiceId,
        (msg) => setLastMessage(msg),
        (connected) => setIsConnected(connected),
        baseUrl || WS_BASE_URL
      );

      ws.connect();
      wsRef.current = ws;
    },
    [baseUrl]
  );

  const disconnect = useCallback(() => {
    wsRef.current?.disconnect();
    wsRef.current = null;
    setIsConnected(false);
  }, []);

  const sendAudio = useCallback((data: ArrayBuffer) => {
    wsRef.current?.sendAudio(data);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      wsRef.current?.disconnect();
    };
  }, []);

  return {
    isConnected,
    lastMessage,
    connect,
    disconnect,
    sendAudio,
  };
}
