import { DSVRowArray } from "d3-dsv";

/**
 * Create graph from CSV rows
 *
 * @param contents CSV rows
 * @returns Tree structure that can be passed to createMindmapNode
 */
const createGraph = (contents: DSVRowArray<string>) => {
  let root: any;  // ルートノードを格納するための変数

  // ノードの訪問状態を追跡するためのオブジェクト
  const visited: Record<string, any> = {};

  // CSVの各行を処理
  for (const row of contents) {
    let parent = undefined;
    
    // 各列の内容を処理
    for (const col of contents.columns) {
      const value = row[col];  // 各セルの値を取得

      if (value) {
        const key = `${col}-${value}`;  // キーを作成して重複を防ぐ

        // ノードがまだ作成されていない場合、新しいノードを作成
        if (!visited[key]) {
          const node = { nodeView: { content: value }, children: [] };
          visited[key] = node;

          // 親ノードが存在する場合、そのノードの子として追加
          if (parent) {
            parent.children.push(visited[key]);
          } else {
            root = node;  // 最初のノードをルートノードとして設定
          }
        }

        parent = visited[key];  // 親ノードを更新
      }
    }
  }

  return root;  // ルートノードを返す
};

/**
 * Create mindmap from CSV rows
 *
 * @param contents CSV rows
 */
export const createMindmap = async (contents: DSVRowArray<string>) => {
  const root = createGraph(contents);  // ツリー構造を生成
  console.log('Created tree structure:', root);  // 構造が正しく作成されているか確認

  try {
    // Miroボードにマインドマップを作成
    await miro.board.experimental.createMindmapNode(root);
    console.log('Mindmap successfully created');
  } catch (error) {
    console.error('Error creating mindmap:', error);  // エラーハンドリング
  }
};