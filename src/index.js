const {app, BrowserWindow, BrowserView, ipcMain} = require('electron');
const path = require('path');
const keytar = require('keytar');
const Store = require('electron-store');
const serviceName = 'weai-chat-app';
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = async () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // 保存凭据
  ipcMain.handle('save-credentials', async (event, account, password) => {
    await keytar.setPassword(serviceName, account, password);
  });

  // 获取凭据
  ipcMain.handle('get-credentials', async (event, account) => {
    return await keytar.getPassword(serviceName, account);
  });

  // 删除凭据
  ipcMain.handle('delete-credentials', async (event, account) => {
    await keytar.deletePassword(serviceName, account);
  });

  const store = new Store();

  // 监听保存数据请求
  ipcMain.handle('save-data', async (event, key, value) => {
    // console.log('set-data', key, value);
    store.set(key, value);
  });

  // 监听读取数据请求
  ipcMain.handle('read-data', async (event, key) => {
    // console.log('read-data', key, store.get(key));
    return store.get(key);
  });

  // 监听删除数据请求
  ipcMain.handle('delete-data', async (event, key) => {
    // console.log('delete-data', key);
    return store.delete(key);
  });

  await mainWindow.webContents.loadURL('http://54.153.41.210/');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', async () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    await createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
