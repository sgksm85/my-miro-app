import * as React from "react";
import { createRoot } from "react-dom/client";
import { useDropzone } from "react-dropzone";
import { parseCsv } from "./csv-utils";  // CSV解析用のユーティリティ
import { createMindmap } from "./mindmap";  // マインドマップ生成用の関数

// MiroのクライアントIDとリダイレクトURI
const CLIENT_ID = '3458764604502701348';  // ここにクライアントIDを設定
const REDIRECT_URI = 'http://localhost:3000/callback';  // リダイレクトURI

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

const dropzoneStyles = {
  display: "flex",
  height: "100%",
  flexDirection: "column",
  justifyContent: "center",
  textAlign: "center",
  border: "3px dashed rgba(41, 128, 185, 0.5)",
  color: "rgba(41, 128, 185, 1.0)",
  fontWeight: "bold",
  fontSize: "1.2em",
} as const;

const App: React.FC = () => {
  const [files, setFiles] = React.useState<File[]>([]);
  const dropzone = useDropzone({
    accept: {
      "text/csv": [".csv"],
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
        const contents = await parseCsv(file);  // CSV解析
        await createMindmap(contents);  // マインドマップ生成
      } catch (e) {
        failed.push(file);
        console.error(e);
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
      ...dropzoneStyles,
      borderColor,
    };
  }, [dropzone.isDragActive, dropzone.isDragReject]);

  // Miroへのログインボタンを押すと認証ページにリダイレクト
  const handleLogin = () => {
    const authUrl = generateAuthUrl();
    window.location.href = authUrl;  // ユーザーをMiroの認証ページにリダイレクト
  };

  return (
    <div>
      <h1>Miro CSV to Mindmap</h1>
      <button onClick={handleLogin}>Login with Miro</button>

      <div className="dnd-container">
        <p>Select your CSV file to import it as a mind map</p>
        <div {...dropzone.getRootProps({ style })}>
          <input {...dropzone.getInputProps()} />
          {dropzone.isDragAccept ? (
            <p className="dnd-text">Drop your CSV file here</p>
          ) : (
            <>
              <div>
                <button
                  type="button"
                  className="button button-primary button-small"
                >
                  Select CSV file
                </button>
                <p className="dnd-text">Or drop your CSV file here</p>
              </div>
            </>
          )}
        </div>
        {files.length > 0 && (
          <>
            <ul className="dropped-files">
              {files.map((file, i) => (
                <li key={i}>{file.name}</li>
              ))}
            </ul>

            <button
              onClick={handleCreate}
              className="button button-small button-primary"
            >
              Create Mind Map
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);