import * as React from "react";
import { createRoot } from "react-dom/client";
import { useDropzone } from "react-dropzone";
import { parseCsv } from "./csv-utils";  // CSVをパースするモジュール
import { createMindmap } from "./mindmap";  // マインドマップを作成するモジュール

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

  // Miro SDKの準備
  React.useEffect(() => {
    const initializeMiro = async () => {
      if (!miro) {
        console.error("Miro SDK is not loaded.");
        return;
      }

      try {
        const isAuthorized = await miro.isAuthorized();
        if (isAuthorized) {
          console.log("Miro SDK is ready");
        } else {
          console.error("Miro SDK is not authorized");
        }
      } catch (error) {
        console.error("Error checking Miro SDK authorization:", error);
      }
    };

    initializeMiro();
  }, []);

  const handleCreate = async () => {
    if (files.length === 0) {
      console.error("No file selected");
      return;
    }

    try {
      const contents = await parseCsv(files[0]);
      console.log("Parsed CSV contents:", contents);
      await createMindmap(contents);
      console.log("Mind map created successfully");
    } catch (error) {
      console.error("Error creating mind map:", error);
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
        <button type="button" className="button button-primary button-small">
          Select CSV file
        </button>
      </div>
      {files.length > 0 && (
        <button onClick={handleCreate} className="button button-small button-primary">
          Create Mind Map
        </button>
      )}
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);