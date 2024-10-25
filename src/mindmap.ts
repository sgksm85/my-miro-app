import { DSVRowArray } from 'd3-dsv';

// Miroボードにノードを追加する関数
const createMindmapNode = async (nodeData: any, x: number, y: number): Promise<any> => {
  try {
    console.log('Creating node for:', nodeData);
    const [node] = await miro.board.widgets.create({
      type: 'shape',
      text: nodeData.content || 'No content',
      x: x,
      y: y,
      style: {
        shapeType: 3, // 四角形
      },
    });

    // 子ノードがある場合は再帰的に追加
    if (nodeData.children && nodeData.children.length > 0) {
      let childX = x + 200; // 子ノードの位置調整
      let childY = y - ((nodeData.children.length - 1) * 100) / 2;

      for (const child of nodeData.children) {
        const childNode = await createMindmapNode(child, childX, childY);
        if (childNode) {
          // ノード間を接続する線を作成
          await miro.board.widgets.create({
            type: 'connector',
            startWidgetId: node.id,
            endWidgetId: childNode.id,
          });
        }
        childY += 100; // 各子ノードのY位置を調整
      }
    }

    return node;
  } catch (error) {
    console.error('Error creating node:', error);
  }
};

// CSVからマインドマップを作成する関数
export const createMindmapFromCSV = async (parsedCsv: DSVRowArray<string>) => {
  const root = createGraphFromCSV(parsedCsv);
  if (root) {
    await createMindmapNode(root, 0, 0);
  } else {
    console.error('Failed to create graph from CSV data');
  }
};

// CSVデータからグラフ構造を作成する関数
const createGraphFromCSV = (contents: DSVRowArray<string>) => {
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
          if (!root) {
            root = node;
          } else {
            root.children.push(node);
          }
        }
      }

      parent = visited[key];
    }
  }

  return root;
};

// Markdownデータからグラフ構造を作成する関数
const createGraphFromMarkdown = (parsedMarkdown: any) => {
  const root = { content: 'Mindmap', children: [] };

  const stack = [{ node: root, level: 0 }];

  parsedMarkdown.forEach((token: any) => {
    if (token.type === 'heading_open') {
      const level = parseInt(token.tag.replace('h', ''), 10);
      const contentToken = parsedMarkdown[parsedMarkdown.indexOf(token) + 1];
      const content = contentToken.content;

      const node = { content, children: [] };

      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      stack[stack.length - 1].node.children.push(node);
      stack.push({ node, level });
    }
  });

  return root;
};

// Miroボードにノードを追加する関数
const createMindmapNode = async (nodeData: any, x: number, y: number): Promise<IWidget | undefined> => {
  try {
    console.log('Creating node for:', nodeData);
    const node = await miro.board.widgets.create({
      type: 'shape',
      text: nodeData.content || 'No content',
      x: x,
      y: y,
      style: {
        shapeType: 3, // 四角形
      },
    });

    // 子ノードがある場合は再帰的に追加
    if (nodeData.children && nodeData.children.length > 0) {
      let childX = x + 200; // 子ノードの位置調整
      let childY = y - ((nodeData.children.length - 1) * 100) / 2;

      for (const child of nodeData.children) {
        const childNode = await createMindmapNode(child, childX, childY);
        if (childNode) {
          // ノード間を接続する線を作成
          await miro.board.widgets.create({
            type: 'connector',
            startWidgetId: node.id,
            endWidgetId: childNode.id,
          });
        }
        childY += 100; // 各子ノードのY位置を調整
      }
    }

    return node;
  } catch (error) {
    console.error('Error creating node:', error);
  }
};