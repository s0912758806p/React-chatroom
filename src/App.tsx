import React, { useState, lazy, Suspense } from 'react';

const Login = lazy(() => import('./components/Login'));
const ChatRoom = lazy(() => import('./components/ChatRoom'));

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (name: string) => {
    setUsername(name);
    setIsLoggedIn(true);
  };

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        {!isLoggedIn ? (
          <Login onLogin={handleLogin} />
        ) : (
          <ChatRoom username={username} />
        )}
      </Suspense>
    </div>
  );
};

export default App;
