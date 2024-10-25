import * as React from "react";
import { useEffect } from "react";

const CLIENT_ID = '3458764604502701348';
const CLIENT_SECRET = 'm9A6ivHE2yEv2L1I4dulYu0q02QCHXly';
const REDIRECT_URI = 'https://my-miro-app.vercel.app/callback';

const getAccessToken = async (code: string) => {
  const tokenUrl = 'https://api.miro.com/v1/oauth/token';
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error('Failed to get access token');
  }

  const data = await response.json();
  console.log('Access Token:', data.access_token); // デバッグ用にアクセストークンを出力
  return data.access_token;
};

const CallbackPage: React.FC = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      getAccessToken(code).then((token) => {
        console.log('Saving access token to localStorage');
        localStorage.setItem('miro_access_token', token); // トークンを保存
        window.location.href = '/'; // メインページにリダイレクト
      }).catch((error) => {
        console.error('Failed to get access token:', error);
        // 必要に応じてエラーページへのリダイレクトを追加
      });
    }
  }, []);

  return <div>Processing login...</div>;
};

export default CallbackPage;