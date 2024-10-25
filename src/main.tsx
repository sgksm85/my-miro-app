// src/main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import MainApp from './app'; // ここでMainAppをインポート

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <MainApp /> {/* MainAppをここで使用 */}
    </BrowserRouter>
  </React.StrictMode>
);