import React, { useEffect } from 'react';

const CallbackPage = () => {
  useEffect(() => {
    // デバッグログを追加
    console.log('Callback page loaded');
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    console.log('Auth code:', code);  // codeの値を確認

    if (code) {
      console.log('Attempting to get access token...');
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
      .then(response => {
        console.log('Response status:', response.status);
        return response.json();
      })
      .then(data => {
        console.log('Token response:', data);  // レスポンスデータを確認
        if (data.access_token) {
          localStorage.setItem('miro_access_token', data.access_token);
          console.log('Token saved, redirecting...');
          window.location.href = '/';
        } else {
          console.error('No access token in response');
        }
      })
      .catch(error => {
        console.error('Error during token request:', error);
      });
    } else {
      console.error('No code parameter found in URL');
    }
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Processing authentication...</h2>
      <p>Please check the browser console for debug information.</p>
    </div>
  );
};

export default CallbackPage;