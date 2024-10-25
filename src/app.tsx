import * as React from "react";
import { createRoot } from "react-dom/client";
import { useDropzone } from "react-dropzone";
import { parseCsv } from "./csv-utils";
import MarkdownIt from "markdown-it";
import { createMindmap } from "./mindmap";  // マインドマップ生成用の関数

// ファイルの種類を判別して、それに応じたパース処理を行う
const handleFileParse = async (file: File) => {
  const fileType = file.name.split('.').pop()?.toLowerCase();
  
  if (fileType === "csv") {
    const csvContents = await file.text();
    const parsedCsv = await parseCsv(csvContents);
    console.log("Parsed CSV:", parsedCsv);  // CSVの解析結果を確認
    return parsedCsv;  // CSVデータを返す
  }

  if (fileType === "md") {
    const md = new MarkdownIt();
    const markdownContents = await file.text();
    const parsedMarkdown = md.parse(markdownContents, {});
    console.log("Parsed Markdown:", parsedMarkdown);  // Markdownの解析結果を確認
    return convertMarkdownToMindmap(parsedMarkdown);  // Markdownデータを返す
  }

  throw new Error("Unsupported file type");
};

// Markdownをマインドマップ形式に変換する
const convertMarkdownToMindmap = (parsedMarkdown: any) => {
  const root = { content: 'Mindmap', children: [] };
  console.log("Converted Markdown to Mindmap structure:", root);  // デバッグ用
  return root;
};

const App: React.FC = () => {
  const [files, setFiles] = React.useState<File[]>([]);
  const dropzone = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'text/markdown': ['.md'],
    },
    maxFiles: 1,
    onDrop: (droppedFiles) => {
      setFiles([droppedFiles[0]]);
    },
  });

  const handleCreate = async () => {
    for (const file of files) {
      try {
        const parsedData = await handleFileParse(file);
        console.log("Parsed Data:", parsedData);  // デバッグ用ログ
        await createMindmap(parsedData);  // マインドマップ生成
      } catch (e) {
        console.error("Error creating mindmap for file:", file.name, e);
      }
    }
    setFiles([]);
  };

  return (
    <div>
      <h1>CSV/Markdown to Mindmap</h1>
      <div {...dropzone.getRootProps()}>
        <input {...dropzone.getInputProps()} />
        <p>Drop CSV or Markdown file here</p>
      </div>
      {files.length > 0 && (
        <button onClick={handleCreate}>Create Mind Map</button>
      )}
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);