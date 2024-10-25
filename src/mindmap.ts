import { DSVRowArray } from "d3-dsv";

// Miroボードにノードを追加する関数
const createMindmapNode = async (nodeData: any, x: number, y: number) => {
  try {
    console.log("Creating node for:", nodeData);
    const node = await miro.board.widgets.create({
      type: 'text',
      text: nodeData.content || 'No content',
      x: x,
      y: y,
    });

    if (nodeData.children && nodeData.children.length > 0) {
      let childX = x + 300;
      let childY = y;

      for (const child of nodeData.children) {
        await createMindmapNode(child, childX, childY);
        childY += 200;
      }
    }
    return node;
  } catch (error) {
    console.error("Error creating node:", error);
  }
};

// CSVデータからグラフ構造を作成する関数
const createGraph = (contents: DSVRowArray<string>) => {
  let root: any;
  const visited: Record<string, any> = {};

  for (const row of contents) {
    let parent = undefined;
    for (const col of contents.columns) {
      const value = row[col]!;

      const key = `${col}-${value}`;

      if (!visited[key]) {
        const node = { content: value, children: [] };
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

// Miroボードにマインドマップを作成する関数
export const createMindmap = async (contents: DSVRowArray<string>) => {
  const root = createGraph(contents);
  if (root) {
    await createMindmapNode(root, 0, 0);
  } else {
    console.error("Failed to create graph from CSV data");
  }
};