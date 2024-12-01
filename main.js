const { app, BrowserWindow, Menu, Tray } = require("electron");
const { dialog } = require("electron");
const fs = require("fs");
const path = require('node:path');
const { type } = require("os");

let win;

const template = [
  {
    label: "File",
    submenu: [
      {
        id: "save-file",
        enabled: false,
        accelerator: "Ctrl+S",
        label: "Save",
        click: async () => {
          win.webContents.send("saveFile");
        },
      },
      {
        label: "Open",
        accelerator: "Ctrl+O",
        click: async () => {
          const { filePaths } = await dialog.showOpenDialog({
            properties: ["openFile"],
          });
          const file = filePaths[0];
          const contents = fs.readFileSync(file, "utf-8");
          win.webContents.send("fileOpened", {
            contents,
            filePath: file,
          });
          const saveFileItem = menu.getMenuItemById("save-file");
          saveFileItem.enabled = true;
        },
      },
      {
        type: 'separator'
      },
      {
        id: "Quit",
        accelerator: "Ctrl+q",
        label: "Quit",
        click: async () => {
          app.quit();
        },
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join('src','typewriterx_icon.png')
  });

  win.loadFile("index.html");

  win.webContents.openDevTools();

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
}

app.whenReady().then(() => {
  createWindow()
  new Tray(path.join('src','typewriterx_icon.png'))

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})