import { DSVRowArray } from "d3-dsv";

/**
 * Create graph from CSV rows
 *
 * @param contents CSV rows
 * @returns Tree structure that can be passed to createMindmapNode
 */
const createGraph = (contents: DSVRowArray<string>) => {
  let root: any;  // ルートノードを格納するための変数
  const visited: Record<string, any> = {};

  for (const row of contents) {
    let parent = undefined;
    for (const col of contents.columns) {
      const value = row[col];
      if (value) {
        const key = `${col}-${value}`;

        if (!visited[key]) {
          const node = { nodeView: { content: value }, children: [] };
          visited[key] = node;

          if (parent) {
            parent.children.push(visited[key]);
          } else {
            root = node;
          }
        }

        parent = visited[key];
      }
    }
  }

  console.log('Generated tree:', root);  // ここで確認
  return root;
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