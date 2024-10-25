import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { parseCsv } from './csv-utils';  // CSVをパースするモジュール
import { createMindmap } from './mindmap';  // マインドマップを作成するモジュール

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

  return (
    <div className="dnd-container">
      <p>Select your CSV file to import it as a mind map</p>
      <div {...dropzone.getRootProps()}>
        <input {...dropzone.getInputProps()} />
        <button type="button">Select CSV file</button>
      </div>
      {files.length > 0 && (
        <button onClick={handleCreate}>Create Mind Map</button>
      )}
    </div>
  );
};

export default MainApp;