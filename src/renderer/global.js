const ipcRenderer = require('electron').ipcRenderer;
var Jimp = require('jimp');
var fs = require('fs');
const dialog = require('electron').remote.dialog;

const psData = {
    transparent: 'rgba(0,0,0,0)'
}