const { app, Tray, Menu } = require('electron');
const path = require('path');
const dota2App = require('./app');
const fs = require('fs');
const os = require('os');

let tray = null;

app.whenReady().then(() => {
  tray = new Tray(path.join(__dirname, 'ULcgHso.png'));

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Exit', click: () => app.quit() }
  ]);

  tray.setToolTip('Dota-rpc');
  tray.setContextMenu(contextMenu);

  app.on('window-all-closed', () => {
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
    }
  });
  dota2App.start();
});


app.on('before-quit', () => {
  tray.destroy();
});
