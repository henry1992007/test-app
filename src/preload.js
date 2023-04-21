// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    saveCredentials: async (account, password) => {
        await ipcRenderer.invoke('save-credentials', account, password);
    },
    getCredentials: async (account) => {
        console.log("getCredentials")
        const password = await ipcRenderer.invoke('get-credentials', account);
        return password;
    },
});