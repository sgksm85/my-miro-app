import * as React from "react";
import { useEffect } from "react";

const CLIENT_ID = '3458764604502701348';  // ここにクライアントIDを設定
const CLIENT_SECRET = 'm9A6ivHE2yEv2L1I4dulYu0q02QCHXly';  // クライアントシークレット
const REDIRECT_URI = 'https://my-miro-app.vercel.app/callback';  // リダイレクトURI

// アクセストークンを取得する関数
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

  const data = await response.json();
  return data.access_token;  // アクセストークンを返す
};

const CallbackPage: React.FC = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      getAccessToken(code).then((token) => {
        console.log('Access Token:', token);
        // アクセストークンを保存して後で使用する
        localStorage.setItem('miro_access_token', token);
        // 必要に応じてボードにリダイレクトするなどの処理を追加
      }).catch((error) => {
        console.error('Failed to get access token:', error);
      });
    }
  }, []);

  return <div>Processing login...</div>;
};

export default CallbackPage;