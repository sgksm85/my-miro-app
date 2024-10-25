import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { parseCsv } from './csv-utils';
import { createMindmap } from './mindmap';

const MainApp: React.FC = () => {
  const [files, setFiles] = React.useState<File[]>([]);

  // ドロップゾーンの設定
  const dropzone = useDropzone({
    accept: {
      "text/csv": [".csv"],
    },
    maxFiles: 1,
    onDrop: (droppedFiles) => {
      setFiles([droppedFiles[0]]);
    },
  });

  // Miro SDKの準備
  React.useEffect(() => {
    const initializeMiro = async () => {
      try {
        await miro.onReady();
        console.log('Miro SDK is ready');
      } catch (error) {
        console.error('Error initializing Miro SDK:', error);
      }
    };

    initializeMiro();
  }, []);

  // マインドマップ作成処理
  const handleCreate = async () => {
    if (files.length === 0) {
      console.error('No file selected');
      return;
    }

    try {
      const contents = await parseCsv(files[0]);
      console.log('Parsed CSV contents:', contents);
      await createMindmap(contents);
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