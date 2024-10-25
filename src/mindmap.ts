import { DSVRowArray } from 'd3-dsv';

// Miroボードにノードを追加する関数
const createMindmapNode = async (nodeData: any, x: number, y: number): Promise<any> => {
  const token = localStorage.getItem('miro_access_token');
  if (!token) {
    throw new Error('No access token found');
  }

  try {
    miro.setToken(token);  // トークンを再度設定（念のため）

    const [node] = await miro.board.createShape({
      content: nodeData.content || 'No content',
      x: x,
      y: y,
      shape: 'rectangle',
    });

    if (nodeData.children && nodeData.children.length > 0) {
      let childX = x + 200;
      let childY = y - ((nodeData.children.length - 1) * 100) / 2;

      for (const child of nodeData.children) {
        const childNode = await createMindmapNode(child, childX, childY);
        if (childNode) {
          await miro.board.createConnector({
            start: {
              item: node.id,
            },
            end: {
              item: childNode.id,
            },
          });
        }
        childY += 100;
      }
    }

    return node;
  } catch (error) {
    console.error('Error creating node:', error);
    throw error;
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

// Markdownからマインドマップを作成する関数
export const createMindmapFromMarkdown = async (parsedMarkdown: any) => {
  const root = createGraphFromMarkdown(parsedMarkdown);
  if (root) {
    await createMindmapNode(root, 0, 0);
  } else {
    console.error('Failed to create graph from Markdown data');
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

  parsedMarkdown.forEach((token: any, index: number) => {
    if (token.type === 'heading_open') {
      const level = parseInt(token.tag.replace('h', ''), 10);
      const contentToken = parsedMarkdown[index + 1];
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
