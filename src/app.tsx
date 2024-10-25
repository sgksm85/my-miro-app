import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { useDropzone } from 'react-dropzone';
import { parseCsv } from './csv-utils'; // CSV解析用のユーティリティ
import MarkdownIt from 'markdown-it';
import { createMindmapFromCSV, createMindmapFromMarkdown } from './mindmap'; // マインドマップ生成用の関数

// MiroのクライアントIDとリダイレクトURI
const CLIENT_ID = '3458764604502701348'; // ここにMiroのクライアントIDを設定
const REDIRECT_URI = 'https://my-miro-app.vercel.app/callback'; // ここにリダイレクトURIを設定

// 認証URLを生成する関数
const generateAuthUrl = () => {
  const baseAuthUrl = 'https://miro.com/oauth/authorize';
  const params = new URLSearchParams({
    response_type: 'code', // Authorization Code Flow
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'boards:read boards:write', // 必要なスコープ
  });

  return `${baseAuthUrl}?${params.toString()}`;
};

const App: React.FC = () => {
  const [files, setFiles] = React.useState<File[]>([]);

  // ドロップゾーンの設定
  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'text/markdown': ['.md', '.markdown'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
  });

  // ファイルの種類を判別して、それに応じたパース処理を行う
  const handleFileParseAndCreateMindmap = async (file: File) => {
    const fileType = file.name.split('.').pop()?.toLowerCase();

    if (fileType === 'csv') {
      const csvContents = await file.text();
      const parsedCsv = parseCsv(csvContents);
      console.log('Parsed CSV:', parsedCsv);
      await createMindmapFromCSV(parsedCsv);
      return;
    }

    if (fileType === 'md' || fileType === 'markdown' || fileType === 'txt') {
      const md = new MarkdownIt();
      const markdownContents = await file.text();
      const parsedMarkdown = md.parse(markdownContents, {});
      console.log('Parsed Markdown:', parsedMarkdown);
      await createMindmapFromMarkdown(parsedMarkdown);
      return;
    }

    throw new Error('Unsupported file type');
  };

  // マインドマップを作成するハンドラー
  const handleCreateMindmap = async () => {
    if (files.length === 0) {
      alert('Please select a file first.');
      return;
    }

    try {
      await handleFileParseAndCreateMindmap(files[0]);
      alert('Mindmap creation complete!');
      setFiles([]);
    } catch (error) {
      console.error('Error creating mindmap:', error);
      alert('Failed to create mindmap.');
    }
  };

  // Miroへのログインボタンを押すと認証ページにリダイレクト
  const handleLogin = () => {
    const authUrl = generateAuthUrl();
    window.location.href = authUrl;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Miro CSV/Markdown to Mindmap</h1>

      {/* ログインボタン */}
      <button onClick={handleLogin} style={{ marginBottom: '20px' }}>
        Login with Miro
      </button>

      {/* ドロップゾーン */}
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed #cccccc',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: isDragActive ? '#f0f8ff' : '#ffffff',
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the file here ...</p>
        ) : (
          <p>Drag 'n' drop a CSV or Markdown file here, or click to select one</p>
        )}
      </div>

      {/* 選択されたファイルの表示 */}
      {files.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Selected file:</h3>
          <ul>
            {files.map((file) => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
          <button onClick={handleCreateMindmap}>Create Mindmap</button>
        </div>
      )}
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);