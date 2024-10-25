// src/callback.tsx
import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CLIENT_ID = '3458764604502701348';
const CLIENT_SECRET = 'm9A6ivHE2yEv2L1I4dulYu0q02QCHXly';
const REDIRECT_URI = 'https://my-miro-app.vercel.app/callback';

// アクセストークンを取得する関数
const getAccessToken = async (code: string) => {
  const response = await fetch('https://api.miro.com/v1/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });

  const data = await response.json();
  if (!data.access_token) {
    throw new Error('Failed to get access token');
  }
  return data.access_token;
};

const CallbackPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      getAccessToken(code)
        .then((token) => {
          console.log('Access Token:', token);
          localStorage.setItem('miro_access_token', token); // トークンを保存
          navigate('/'); // 認証後にメインページにリダイレクト
        })
        .catch((error) => {
          console.error('Failed to get access token:', error);
          alert('Failed to authenticate with Miro');
        });
    }
  }, [navigate]);

  return <div>Processing login...</div>;
};

export default CallbackPage;