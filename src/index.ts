export async function init() {
  miro.board.ui.on('icon:click', async () => {
    await miro.board.ui.openPanel({ url: 'app.html' });
  });
}

// MiroのSDKが読み込まれた後に初期化を実行
miro.onReady(() => {
  init();
});