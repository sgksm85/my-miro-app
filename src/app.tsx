import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { useDropzone } from 'react-dropzone';
import { parseCsv } from './csv-utils';
import MarkdownIt from 'markdown-it';
import { createMindmapFromCSV, createMindmapFromMarkdown } from './mindmap';

const App: React.FC = () => {
  const [files, setFiles] = React.useState<File[]>([]);

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleFileParseAndCreateMindmap = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      if (file.name.endsWith('.csv')) {
        const parsedCsv = parseCsv(content);
        await createMindmapFromCSV(parsedCsv);
      } else if (file.name.endsWith('.md')) {
        const md = new MarkdownIt();
        const parsedMarkdown = md.parse(content, {});
        await createMindmapFromMarkdown(parsedMarkdown);
      }
    };
    reader.readAsText(file);
  };

  const handleCreateMindmap = async () => {
    const token = localStorage.getItem('miro_access_token');
    if (!token) {
      alert('Please login to Miro first.');
      window.location.href = generateAuthUrl(); // ログインページにリダイレクト
      return;
    }
  
    try {
      miro.onReady(() => {
        miro.setToken(token);  // トークンを設定
      });
  
      if (files.length === 0) {
        alert('Please select a file first.');
        return;
      }
  
      await handleFileParseAndCreateMindmap(files[0]);
      alert('Mindmap creation complete!');
      setFiles([]);
    } catch (error) {
      console.error('Error creating mindmap:', error);
      alert('Failed to create mindmap. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Miro CSV/Markdown to Mindmap</h1>
      <div {...getRootProps()} style={{ border: '2px dashed #cccccc', padding: '20px', marginBottom: '20px' }}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Drag 'n' drop some files here, or click to select files</p>
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
