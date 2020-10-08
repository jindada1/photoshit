import { app, BrowserWindow, Menu, dialog } from 'electron';
const path = require('path')
const url = require('url')


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Menu.setApplicationMenu(null) // 取消菜单栏

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // 监听窗口大小更改
  mainWindow.on('resize', () => {
    let sizedata = mainWindow.getContentBounds();
    mainWindow.webContents.send('window-resized', sizedata);
  })
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

const ipc = require('electron').ipcMain

let createCanvasWin;

ipc.on('add', () => {
  if (createCanvasWin) return;
  createCanvasWin = new BrowserWindow({
    width: 400,
    height: 512,
    frame: false,
    parent: mainWindow,
    movable: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  })
  createCanvasWin.loadURL(path.join('file:', __dirname, 'subwindow/create_canvas.html')); //new.html是新开窗口的渲染进程
  createCanvasWin.on('closed', () => { createCanvasWin = null })

  createCanvasWin.webContents.openDevTools();
})

ipc.on('create-canvas', (event, arg) => {
  mainWindow.webContents.send('add-canvas', arg);
})

ipc.on('open-imagefile', (event, arg) => {

  dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{
      name: 'Images',
      extensions: ['jpg', 'png']
    }]
  }).then((data) => {
    if (data.filePaths.length) {
      createCanvasWin.webContents.send('open-image', data.filePaths[0]);
    }
 });;

})
