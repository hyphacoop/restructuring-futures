const { app, BrowserWindow } = require('electron');

const createWindow = () => {
let win = new BrowserWindow({
  width: 1200,
  height: 720,
  webPreferences: {
    webSecurity: false,
    nodeIntegration: true,
    contextIsolation: false
  }})

  win.loadFile('index.html')
}
app.whenReady().then(() => {
    createWindow()
  
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })