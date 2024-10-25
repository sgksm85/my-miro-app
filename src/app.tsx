import * as React from "react";
import { createRoot } from "react-dom/client";
import { useDropzone } from "react-dropzone";
import { parseCsv } from "./csv-utils";  // CSV解析用のユーティリティ
import MarkdownIt from "markdown-it";
import { createMindmap } from "./mindmap";  // マインドマップ生成用の関数

// MiroのクライアントIDとリダイレクトURI
const CLIENT_ID = '3458764604502701348';  // クライアントID
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

// ファイルの種類を判別して、それに応じたパース処理を行う
const handleFileParse = async (file: File) => {
  const fileType = file.name.split('.').pop()?.toLowerCase();
  
  if (fileType === "csv") {
    const csvContents = await file.text();
    const parsedCsv = await parseCsv(csvContents);
    console.log("Parsed CSV:", parsedCsv);
    return parsedCsv;
  }

  if (fileType === "md") {
    const md = new MarkdownIt();
    const markdownContents = await file.text();
    const parsedMarkdown = md.parse(markdownContents, {});
    console.log("Parsed Markdown:", parsedMarkdown);
    return convertMarkdownToMindmap(parsedMarkdown);
  }

  throw new Error("Unsupported file type");
};

// Markdownをマインドマップ形式に変換する（仮の例）
const convertMarkdownToMindmap = (parsedMarkdown: any) => {
  const root = { content: 'Mindmap', children: [] };
  console.log("Converted Markdown to Mindmap structure:", root);
  return root;
};

const App: React.FC = () => {
  const [files, setFiles] = React.useState<File[]>([]);

  const dropzone = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'text/markdown': ['.md'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    onDrop: (droppedFiles) => {
      setFiles([droppedFiles[0]]);
    },
  });

  const handleCreate = async () => {
    const failed = [];
    for (const file of files) {
      try {
        const parsedData = await handleFileParse(file);
        console.log("Parsed Data:", parsedData);
        await createMindmap(parsedData);  // マインドマップ生成
        console.log("Mindmap creation complete.");
      } catch (e) {
        failed.push(file);
        console.error("Error creating mindmap for file:", file.name, e);
      }
    }
    setFiles([]);
  };

  const style = React.useMemo(() => {
    let borderColor = "rgba(41, 128, 185, 0.5)";
    if (dropzone.isDragAccept) {
      borderColor = "rgba(41, 128, 185, 1.0)";
    }

    if (dropzone.isDragReject) {
      borderColor = "rgba(192, 57, 43,1.0)";
    }
    return {
      borderColor,
    };
  }, [dropzone.isDragAccept, dropzone.isDragReject]);

  const handleLogin = () => {
    const authUrl = generateAuthUrl();
    window.location.href = authUrl;  // Miroの認証ページにリダイレクト
  };

  return (
    <div>
      <h1>Miro CSV/Markdown to Mindmap</h1>
      <button onClick={handleLogin}>Login with Miro</button>

      <div className="dnd-container">
        <p>Select your CSV or Markdown file to import it as a mind map</p>
        <div {...dropzone.getRootProps({ style })}>
          <input {...dropzone.getInputProps()} />
          {dropzone.isDragAccept ? (
            <p>Drop your file here</p>
          ) : (
            <div>
              <button>Select CSV or Markdown file</button>
              <p>Or drop your file here</p>
            </div>
          )}
        </div>
        {files.length > 0 && (
          <>
            <ul>
              {files.map((file, i) => (
                <li key={i}>{file.name}</li>
              ))}
            </ul>
            <button onClick={handleCreate}>Create Mind Map</button>
          </>
        )}
      </div>
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);