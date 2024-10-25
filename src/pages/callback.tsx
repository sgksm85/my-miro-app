import React, { useEffect } from 'react';

const CallbackPage = () => {
  useEffect(() => {
    // URLからコードを取得
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (!code) {
      console.error('No authorization code found');
      window.location.href = '/';
      return;
    }

    // トークン取得のリクエスト
    const getToken = async () => {
      try {
        const response = await fetch('https://api.miro.com/v1/oauth/token', {
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
          }).toString()
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.access_token) {
          localStorage.setItem('miro_access_token', data.access_token);
          // 強制的にリダイレクト
          window.location.replace('/');
        } else {
          throw new Error('No access token received');
        }
      } catch (error) {
        console.error('Token request failed:', error);
        // エラー時もホームにリダイレクト
        window.location.replace('/?error=token_error');
      }
    };

    getToken();
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif' 
    }}>
      <h2>認証処理中...</h2>
      <p>このページは自動的にリダイレクトされます。</p>
    </div>
  );
};

export default CallbackPage;