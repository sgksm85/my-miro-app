// CSVデータからマインドマップを作成する関数
export const createMindmap = async (contents: string[][]) => {
  // ビューポートの中心を取得
  const viewport = await miro.board.viewport.get();
  const center = {
    x: viewport.x + viewport.width / 2,
    y: viewport.y + viewport.height / 2,
  };

  // ルートノードを作成
  const [rootNode] = await miro.board.widgets.create({
    type: 'card',
    text: contents[0][0], // 最初の行の最初の列をルートとして使用
    x: center.x,
    y: center.y,
  });

  // 各行を処理
  for (let i = 1; i < contents.length; i++) {
    const row = contents[i];
    let parentNode = rootNode;
    let x = center.x;
    let y = center.y + (i * 100); // 各行を下に配置

    // 行の各列を処理
    for (let j = 0; j < row.length; j++) {
      if (row[j]) {
        // 子ノードを作成
        const [childNode] = await miro.board.widgets.create({
          type: 'card',
          text: row[j],
          x: x + (j * 200), // 各列を右に配置
          y: y,
        });

        // 親ノードと子ノードを接続
        await miro.board.widgets.create({
          type: 'connector',
          startWidgetId: parentNode.id,
          endWidgetId: childNode.id,
        });

        parentNode = childNode;
      }
    }
  }
};