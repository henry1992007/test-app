// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveCredentials: async (account, password) => {
    await ipcRenderer.invoke('save-credentials', account, password);
  },
  getCredentials: async (account) => {
    return await ipcRenderer.invoke('get-credentials', account);
  },
  deleteCredentials: async (account) => {
    return await ipcRenderer.invoke('delete-credentials', account);
  },
  readData: async (key) => {
    console.log("invoke readData")
    return await ipcRenderer.invoke('read-data', key);
  },
  saveData: async (key, value) => {
    return await ipcRenderer.invoke('save-data', key, value);
  },
  deleteData: async (key) => {
    return await ipcRenderer.invoke('delete-data', key);
  },
});