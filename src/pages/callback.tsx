import React, { useEffect } from 'react';

const CLIENT_ID = '3458764604502701348';
const CLIENT_SECRET = 'm9A6ivHE2yEv2L1I4dulYu0q02QCHXly';
const REDIRECT_URI = 'https://my-miro-app.vercel.app/callback'; // Miroに登録した値と完全一致

const getAccessToken = async (code: string) => {
  const response = await fetch('https://api.miro.com/v1/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    })
  });
  
  const data = await response.json();
  if (!data.access_token) {
    throw new Error('Failed to get access token');
  }

  localStorage.setItem('miro_access_token', data.access_token);
};

const CallbackPage = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      getAccessToken(code)
        .then(() => {
          window.location.href = '/'; // 認証後にリダイレクト
        })
        .catch(error => console.error('Failed to get access token:', error));
    }
  }, []);

  return <div>Processing login...</div>;
};

export default CallbackPage;
