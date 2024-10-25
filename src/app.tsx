import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { parseCsv } from './csv-utils';  // CSVをパースするモジュール
import { createMindmap } from './mindmap';  // マインドマップを作成するモジュール

miro.onReady().then(() => {
  console.log('Miro SDK is ready');
}).catch((error) => {
  console.error('Miro SDK error:', error);
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

  // CSVをパースしてマインドマップを作成する処理
  const handleCreate = async () => {
    if (files.length === 0) {
      console.error('No file selected');
      return;
    }

    try {
      const contents = await parseCsv(files[0]);  // CSVファイルの内容をパース
      console.log('Parsed CSV contents:', contents);  // ここで内容を確認
      await createMindmap(contents);  // パースした内容を元にマインドマップを作成
      console.log('Mind map created successfully');
    } catch (error) {
      console.error('Error creating mind map:', error);
    }
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
          <p className="dnd-text">Drop your CSV file here</p>
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