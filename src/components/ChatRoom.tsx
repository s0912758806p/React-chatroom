import React, { useState, useEffect } from 'react';
import useWebSocket from '../hooks/useWebSocket';

interface Message {
  text: string;
  sender: string;
}

interface Announcement {
  annItem: string;
}

interface ChatRoomProps {
  username: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ username }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [announcement, setAnnouncement] = useState<Announcement[]>([]);
  const [clientCount, setClientCount] = useState<number>(0);

  const { connectWebSocket, sendMessage, closeWebSocket, isConnected } = useWebSocket({
    onMessage: (data) => {
        if (data.type === 'join' || data.type === 'message') {
            setMessages((prev) => [
            ...prev,
            { text: data.message ?? '[未提供訊息]', sender: data.nickname ?? '未知' },
            ]);
        }
        if (data.clientCount !== undefined) {
            setClientCount(data.clientCount);
        }
    },
      
    onClose: () => {
      console.log('WebSocket closed');
    },
  });

  useEffect(() => {
    const announcements: Announcement[] = [
      { annItem: '廣播, 通知, 公告位置調整' },
      { annItem: '聊天機器人' },
      { annItem: '切換頭像' },
      { annItem: '表情, 貼圖片' },
    ];
    setAnnouncement(announcements);

     // 啟用 WebSocket 連線
     connectWebSocket('ws://10.1.5.25:3000');

     // Cleanup WebSocket on unmount
    return () => {
        closeWebSocket();
    };
  }, [connectWebSocket, closeWebSocket]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendMessage({
        type: 'message',
        clientId: username,
        nickname: username,
        message: inputValue,
      });
      setInputValue('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chatroom">
      <div className="chatroom-info">
        <div className="chatroom-title">
          <div id="mine-avatar"></div>
          <div className="chatroom-title-info">
            <div id="mine-nickname">{username}</div>
            <div className="client-count">
              <div id="channel">聊天室</div>
              <div id="count">{clientCount} 人在線</div>
            </div>
          </div>
        </div>
        <div id="chatroom-box" className="chatroom-box">
          {messages.map((msg, index) => (
            <div key={index} className={`message-box ${msg.sender === username ? 'box-self' : ''}`}>
              <div className="msg-style">{msg.text}</div>
            </div>
          ))}
        </div>
        <div className="send">
          <input
            id="input-text"
            type="text"
            placeholder="開始聊天"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSendMessage} disabled={!isConnected}>送出</button>
        </div>
      </div>
      <div className="announcement-info">
        <div>目前未完成項目:</div>
        {announcement.map((ann, index) => (
          <div key={index}>
            <div>{index + 1}. {ann.annItem}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatRoom;
