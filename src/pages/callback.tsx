import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // 追加

const CallbackPage = () => {
  const navigate = useNavigate();  // React Routerのナビゲーション

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    console.log('Auth code:', code);  // デバッグ用

    if (code) {
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
          // window.location.href の代わりにnavigateを使用
          navigate('/');
        } else {
          console.error('Token error:', data);
          navigate('/?error=token_error');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        navigate('/?error=fetch_error');
      });
    } else {
      navigate('/?error=no_code');
    }
  }, [navigate]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>認証処理中...</h2>
      <p>しばらくお待ちください</p>
    </div>
  );
};

export default CallbackPage;