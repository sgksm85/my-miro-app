import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';          // メインアプリ
import CallbackPage from '../pages/callback';  // OAuth2.0のコールバックページ

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <BrowserRouter>
    <Routes>
      {/* ルート（ホーム）ページ */}
      <Route path="/" element={<App />} />

      {/* /callback へのルーティング */}
      <Route path="/callback" element={<CallbackPage />} />
    </Routes>
  </BrowserRouter>
);