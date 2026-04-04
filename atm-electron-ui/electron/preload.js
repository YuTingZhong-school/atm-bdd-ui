const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('atmApp', {
    platform: process.platform,
});
