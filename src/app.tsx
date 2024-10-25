import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { parseCsv } from './csv-utils';
import { createMindmapFromCSV } from './mindmap';
import CallbackPage from './pages/callback';

// Miroの型定義
declare const miro: any;

// Miro SDKの初期化
miro.onReady(() => {
  // アプリアイコンがクリックされたときの処理
  miro.board.ui.on('icon:click', async () => {
    const token = localStorage.getItem('miro_access_token');
    if (!token) {
      handleLogin();
      return;
    }
    
    // 認証済みの場合はパネルを開く
    await miro.board.ui.openPanel({
      url: '/',  // 変更: index.htmlではなくルートパスを使用
      height: 400
    });
  });
});

const CLIENT_ID = '3458764604502701348';
const REDIRECT_URI = 'https://my-miro-app.vercel.app/callback';

const generateAuthUrl = () => {
  const baseAuthUrl = 'https://miro.com/oauth/authorize';
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'boards:read boards:write',
  });
  return `${baseAuthUrl}?${params.toString()}`;
};

const handleLogin = () => {
  window.location.href = generateAuthUrl();
};

const MainApp: React.FC = () => {
  const [files, setFiles] = React.useState<File[]>([]);
  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  });

  const handleCreateMindmap = async () => {
    if (files.length === 0) {
      alert('Please select a CSV file first.');
      return;
    }

    const file = files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      const parsedCsv = parseCsv(content);
      await createMindmapFromCSV(parsedCsv);
      alert('Mindmap creation complete!');
      setFiles([]);
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>CSV to Mindmap</h1>
      <button onClick={handleLogin}>Login with Miro</button>
      
      <div {...getRootProps()} style={{
        border: '2px dashed #cccccc',
        padding: '20px',
        marginBottom: '20px',
      }}>
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop the file here ...</p> : <p>Drag 'n' drop a CSV file here, or click to select one</p>}
      </div>
      {files.length > 0 && (
        <div>
          <h2>Selected file:</h2>
          <ul>
            {files.map(file => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={handleCreateMindmap} disabled={files.length === 0}>
        Create Mindmap
      </button>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/callback" element={<CallbackPage />} />
      </Routes>
    </BrowserRouter>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);