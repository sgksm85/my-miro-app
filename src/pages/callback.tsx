import * as React from "react";
import { useEffect } from "react";
import { useRouter } from 'next/router'; // Next.jsのルーティング

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
      client_secret: CLIENT_SECRET  
    })
  });

  const data = await response.json();
  if (!data.access_token) {
    throw new Error('Failed to get access token');
  }

  localStorage.setItem('miro_access_token', data.access_token);
  return data.access_token;
};

const CallbackPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const code = router.query.code as string; // URLから認証コードを取得

    if (code) {
      getAccessToken(code).then(() => {
        window.location.href = '/'; // 認証後にメインページへリダイレクト
      }).catch((error) => {
        console.error('Failed to get access token:', error);
      });
    }
  }, [router.query.code]);

  return <div>Processing login...</div>;
};

export default CallbackPage;