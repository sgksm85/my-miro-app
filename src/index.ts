export async function init() {
  // Miroアプリが開かれた際にパネルを表示
  miro.board.ui.on('icon:click', async () => {
    await miro.board.ui.openPanel({ url: 'app.html' });
  });
}

init();