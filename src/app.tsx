import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { parseCsv } from './csv-utils';
import { createMindmapFromCSV } from './mindmap';

const CLIENT_ID = '3458764604502701348';
const REDIRECT_URI = 'https://my-miro-app.vercel.app/callback';

// 認証URLを生成する関数
const generateAuthUrl = () => {
  const baseAuthUrl = 'https://miro.com/oauth/authorize';
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
  });
  return `${baseAuthUrl}?${params.toString()}`;
};

miro.onReady(() => {
  miro.board.ui.on('icon:click', async () => {
    const authorized = await miro.isAuthorized();
    if (!authorized) {
      const authUrl = generateAuthUrl();
      window.location.href = authUrl;
      return;
    }

    // パネルを開く
    await miro.board.ui.openPanel({
      url: '/',
      height: 400,
      iconUrl: 'https://example.com/icon.png',  // アイコンURLを指定
    });
  });
});

// Miroの初期化
miro.onReady(() => {
  console.log('Miro SDK is ready');
  miro.board.ui.on('icon:click', async () => {
    const authorized = await miro.isAuthorized();
    console.log('Authorization status:', authorized);  // 認証ステータスを確認
    if (!authorized) {
      const authUrl = generateAuthUrl();
      console.log('Redirecting to auth URL:', authUrl);  // 認証URLを確認
      window.location.href = authUrl;
      return;
    }

    await miro.board.ui.openPanel({
      url: '/',
      height: 400
    });
  });
});

// ドロップゾーンのスタイル定義
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

const MainApp: React.FC = () => {
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
        const contents = await parseCsv(file);
        await createMindmap(contents);
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

  return (
    <div className="dnd-container">
      <p>Select your CSV file to import it as a mind map</p>
      <div {...dropzone.getRootProps({ style })}>
        <input {...dropzone.getInputProps()} />
        {dropzone.isDragAccept ? (
          <p className="dnd-text">Drop your CSV file are here</p>
        ) : (
          <>
            <div>
              <button type="button" className="button button-primary button-small">
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
          <button onClick={handleCreate} className="button button-small button-primary">
            Create Mind Map
          </button>
        </>
      )}
    </div>
  );
};

export default MainApp;