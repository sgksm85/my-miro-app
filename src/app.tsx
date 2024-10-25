import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { useDropzone } from 'react-dropzone';
import { parseCsv } from './csv-utils';
import MarkdownIt from 'markdown-it';
import { createMindmapFromCSV, createMindmapFromMarkdown } from './mindmap';

// Miro SDKが正しくロードされているか確認
miro.onReady(() => {
  console.log("Miro SDK is connected");
});

const CLIENT_ID = '3458764604502701348';  // MiroのクライアントID
const REDIRECT_URI = 'https://my-miro-app.vercel.app/callback';  // リダイレクトURI

// 認証URLを生成する関数
const generateAuthUrl = () => {
  const baseAuthUrl = 'https://miro.com/oauth/authorize';
  const params = new URLSearchParams({
    response_type: 'code',  // Authorization Code Flow
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'boards:read boards:write',  // 必要なスコープ
  });
  return `${baseAuthUrl}?${params.toString()}`;
};

// アプリ初回ロード時にトークンを確認する
const checkAuthToken = () => {
  const token = localStorage.getItem('miro_access_token');
  if (!token) {
    // トークンがない場合は認証へリダイレクト
    window.location.href = generateAuthUrl();
  } else {
    console.log("Token is available: ", token);
  }
};

// アプリの起動時にトークン確認を実行
React.useEffect(() => {
  checkAuthToken();
}, []);

const App: React.FC = () => {
  const [files, setFiles] = React.useState<File[]>([]);

  // ドロップゾーンの設定
  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    console.log("Dropped files: ", acceptedFiles);  // ドロップされたファイルを確認
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  });

  // CSVファイルを解析してマインドマップを作成
// CSVファイルを解析してマインドマップを作成
const handleCreateMindmap = async () => {
  if (files.length === 0) {
    alert('Please select a CSV file first.');
    return;
  }

  const file = files[0];
  console.log("Reading file: ", file.name);  // ファイル名の確認
  const reader = new FileReader();

  reader.onload = async (e) => {
    const content = e.target?.result as string;
    if (content) {
      const parsedCsv = parseCsv(content);
      await createMindmapFromCSV(parsedCsv);
      alert('Mindmap creation complete!');
      setFiles([]);
    } else {
      console.error("Failed to read file content");
      alert('Failed to read file content.');
    }
  };

  reader.onerror = () => {
    console.error("Error reading file");
    alert('Error reading file.');
  };

  reader.readAsText(file);
};

  return (
    <div style={{ padding: '20px' }}>
      <h1>CSV to Mindmap</h1>
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed #cccccc',
          padding: '20px',
          marginBottom: '20px',
        }}
      >
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the file here ...</p> :
            <p>Drag 'n' drop a CSV file here, or click to select one</p>
        }
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

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);