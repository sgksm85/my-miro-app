import { DSVRowArray } from "d3-dsv";

// Miroボードにノードを追加する関数
const createMindmapNode = async (nodeData: any, x: number, y: number) => {
  console.log("Creating node for:", nodeData);  // 追加
  const node = await miro.board.widgets.create({
    type: 'text',
    text: nodeData.nodeView.content || 'No content',  // デフォルトで'No content'を表示
    x: x,
    y: y,
  });

  // 子ノードがある場合は再帰的に追加
  if (nodeData.children && nodeData.children.length > 0) {
    let childX = x + 300;  // 子ノードの位置調整
    let childY = y;

    for (const child of nodeData.children) {
      await createMindmapNode(child, childX, childY);
      childY += 200;  // 各子ノードのY位置を調整
    }
  }

  return node;
};

/**
 * CSVデータからグラフ構造を作成する
 *
 * @param contents CSVから取得した行データ
 * @returns Miroボードに直接渡せるツリー構造のデータ
 */
const createGraph = (contents: DSVRowArray<string>) => {
  let root: any;

  const visited: Record<string, any> = {};

  for (const row of contents) {
    let parent = undefined;
    for (const col of contents.columns) {
      const value = row[col]!;

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

  return root;
};

// CSVをパースしてMiroボードにマインドマップを作成する関数
export const createMindmap = async (contents: DSVRowArray<string>) => {
  const root = createGraph(contents);  // CSVからツリー構造を作成
  if (root) {
    await createMindmapNode(root, 0, 0);  // ルートノードからMiroに反映
  } else {
    console.error("Failed to create graph from CSV data");
  }
};