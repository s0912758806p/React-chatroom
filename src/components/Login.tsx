import React, { useState } from 'react';

interface LoginProps {
  onLogin: (name: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState<string>('');

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  const handleLogin = () => {
    if (name.trim()) {
      onLogin(name);
    }
  };

  return (
    <div id="login">
      <label>
        使用者名稱:
        <input
          id="input-login"
          type="text"
          placeholder="輸入暱稱"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </label>
      <button onClick={handleLogin}>登錄</button>
    </div>
  );
};

export default Login;
