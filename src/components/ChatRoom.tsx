import React, { useState, useEffect } from 'react';
import useWebSocket from '../hooks/useWebSocket';
import styled from 'styled-components';

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
    <Chatroom>
      <ChatroomInfo>
        <ChatroomTitle>
          <MineAvatarBox>
            <MineAvatarImg src="avatar.jpg" alt="Avatar" />
          </MineAvatarBox>
          <ChatroomTitleInfo>
            <div>{username}</div>
            <ClientCount>
              <div>聊天室</div>
              <div>{clientCount} 人在線</div>
            </ClientCount>
          </ChatroomTitleInfo>
        </ChatroomTitle>
        <ChatroomBox>
          {messages.map((msg, index) => (
            <MessageBox key={index} isSelf={msg.sender === username}>
              <MessageText>{msg.text}</MessageText>
            </MessageBox>
          ))}
        </ChatroomBox>
        <Send>
          <InputText
            type="text"
            placeholder="開始聊天"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <SendButton onClick={handleSendMessage} disabled={!isConnected}>
            送出
          </SendButton>
        </Send>
      </ChatroomInfo>
      <AnnouncementInfo>
        <div>目前未完成項目:</div>
        {announcement.map((ann, index) => (
          <div key={index}>
            {index + 1}. {ann.annItem}
          </div>
        ))}
      </AnnouncementInfo>
    </Chatroom>
  );
};

const Chatroom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const ChatroomInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChatroomTitle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ChatroomTitleInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 0.5rem;
`;

const MineAvatarBox = styled.div`
  width: 5rem;
  height: 5rem;
`;

const MineAvatarImg = styled.img`
  width: 100%;
  height: 100%;
  vertical-align: middle;
  border-radius: 50%;
`;

const ChatroomBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 350px;
  height: 500px;
  color: #fff;
  border: 1px solid #000;
  background: #444;
  padding: 1rem;
  overflow: auto;
`;

const MessageBox = styled.div<{ isSelf: boolean }>`
  display: flex;
  flex-direction: column;
  max-width: 75%;
  min-width: 25px;
  padding: 0.3rem;
  margin: 0.2rem 0;
  color: ${(props) => (props.isSelf ? '#333' : '#e1e1e1')};
  background: ${(props) => (props.isSelf ? 'rgb(193, 243, 146)' : 'rgb(8, 8, 8)')};
  border-radius: ${(props) => (props.isSelf ? '10px 0px 10px 10px' : '0px 10px 10px 10px')};
`;

const MessageText = styled.div`
  font-size: 1rem;
  word-break: break-all;
`;

const Send = styled.div`
  display: flex;
  background: #444;
`;

const InputText = styled.input`
  width: 100%;
  height: 2.5rem;
  border: none;
  color: #e1e1e1;
  background-color: #444;
  padding: 0 0.5rem;
`;

const SendButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  &:disabled {
    background-color: #ccc;
  }
`;

const AnnouncementInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 500px;
  margin-left: 10px;
`;

const ClientCount = styled.div`
  display: flex;
  justify-content: flex-start;
`;

export default ChatRoom;
