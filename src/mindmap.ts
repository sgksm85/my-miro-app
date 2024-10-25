import { DSVRowArray } from "d3-dsv";
import { useEffect } from 'react';

/**
 * Create graph from CSV rows
 *
 * @param contents CSV rows
 * @returns Tree structure that can be passed to createMindmapNode
 */
const createGraph = (contents: DSVRowArray<string>) => {
  let root: any;
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

  console.log('Generated tree:', root);
  return root;
};

/**
 * Create mindmap from CSV rows
 *
 * @param contents CSV rows
 */
export const createMindmap = async (contents: DSVRowArray<string>) => {
  const root = createGraph(contents);
  console.log('Created tree structure:', root);

  try {
    await window.miro.board.experimental.createMindmapNode(root);
    console.log('Mindmap successfully created');
  } catch (error) {
    console.error('Error creating mindmap:', error);
  }
};

/**
 * Initialize Miro SDK
 */
export const useInitializeMiro = () => {
  useEffect(() => {
    const initMiro = () => {
      if (window.miro) {
        console.log("miroオブジェクトが存在します:", window.miro);

        // SDKの準備が完了したイベントをリッスン
        window.miro.on("ready", async () => { // イベント名を "ready" に変更
          console.log("Miro SDKの 'ready' イベントがトリガーされました");
          try {
            const authorized = await window.miro.isAuthorized();
            console.log("ユーザーの認証ステータス:", authorized);
            if (!authorized) {
              await window.miro.requestAuthorization();
              console.log("ユーザー認証を要求しました");
            }
            console.log("Miro SDKが初期化されました");
          } catch (error) {
            console.error("Miro SDK initialization failed:", error);
          }
        });

        // SDKの初期化をトリガー
        window.miro.board.requestToken();
        console.log("Miro SDKの初期化をトリガーしました");
      } else {
        console.error("Miro SDKが利用できません");
      }
    };

    initMiro();
  }, []);
};