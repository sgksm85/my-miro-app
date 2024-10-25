import { csvParse } from "d3-dsv";

// 非同期でファイルを読み込む関数
const readFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    // ファイルが読み込まれた際の処理
    reader.onload = (e) => {
      if (!e.target || typeof e.target.result !== 'string') {
        reject("Failed to load file");
        return;
      }
      resolve(e.target.result);
    };
    
    // エラーハンドリング
    reader.onerror = () => {
      reject("Failed to load file due to an error");
    };
    
    reader.onabort = () => {
      reject("File reading was aborted");
    };
    
    // ファイルをテキストとして読み込む
    reader.readAsText(file, "utf-8");
  });
};

// CSVファイルを解析する関数
export const parseCsv = async (file: File): Promise<any> => {
  try {
    const fileContent = await readFile(file); // ファイルの内容を読み込む
    console.log('CSV file content:', fileContent); // ログにファイル内容を出力
    const parsedData = csvParse(fileContent); // CSVを解析
    return parsedData;
  } catch (error) {
    console.error('Error parsing CSV:', error); // エラーハンドリング
    throw new Error('Failed to parse CSV file');
  }
};