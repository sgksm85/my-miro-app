import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { useDropzone } from 'react-dropzone';
import { parseCsv } from './csv-utils';
import { createMindmapFromCSV } from './mindmap';

// Miro SDKが正しくロードされているか確認
miro.onReady(() => {
  console.log("Miro SDK is ready.");
});

const App: React.FC = () => {
  const [files, setFiles] = React.useState<File[]>([]);

  // ドロップゾーンの設定
  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],  // CSVファイルのみ許可
    },
    maxFiles: 1,
  });

  // CSVファイルを解析してMiroボードにマインドマップを作成する関数
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
      await createMindmapFromCSV(parsedCsv);  // CSVからマインドマップを生成
      alert('Mindmap creation complete!');
      setFiles([]);  // ファイルをクリア
    };
    reader.readAsText(file);  // ファイルの読み込み
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