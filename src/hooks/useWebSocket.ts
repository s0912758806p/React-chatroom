import { useState, useEffect, useRef } from 'react';

type MessageData = {
  type: string;
  clientId?: string;
  nickname?: string;
  message?: string;
  avatarId?: number;
  clientCount?: number;
};

type WebSocketProps = {
  onMessage: (data: MessageData) => void;
  onClose?: () => void;
};

const useWebSocket = ({ onMessage, onClose }: WebSocketProps) => {
  const [, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const connectWebSocket = (url: string) => {
    const socket = new WebSocket(url);
    wsRef.current = socket;

    socket.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      const data: MessageData = JSON.parse(event.data);
      onMessage(data);
    };

    socket.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket closed');
      onClose?.();
    };

    setWs(socket);
  };

  const sendMessage = (message: MessageData) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  const closeWebSocket = () => {
    wsRef.current?.close();
  };

  useEffect(() => {
    return () => {
      closeWebSocket(); // Cleanup on unmount
    };
  }, []);

  return { connectWebSocket, sendMessage, closeWebSocket, isConnected };
};

export default useWebSocket;
