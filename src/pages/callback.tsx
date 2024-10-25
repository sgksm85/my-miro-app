import React, { useEffect } from 'react';

const CallbackPage = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // アクセストークンの取得処理
      fetch('https://api.miro.com/v1/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: '3458764604502701348',
          client_secret: 'm9A6ivHE2yEv2L1I4dulYu0q02QCHXly',
          code: code,
          redirect_uri: 'https://my-miro-app.vercel.app/callback'
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.access_token) {
          localStorage.setItem('miro_access_token', data.access_token);
          // メインページにリダイレクト
          window.location.href = '/';
        } else {
          console.error('Failed to get access token');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  }, []);

  return <div>Processing authentication...</div>;
};

export default CallbackPage;