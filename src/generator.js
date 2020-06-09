const path = require("path");
const fs = require("fs");
const vscode = require("vscode");

const TYPENAME = {
  wxpage: {
    inputTitle: "微信小程序Page文件",
    ext: ["wxml", "js", "wxss", "json"],
  },
  wxcomponent: {
    inputTitle: "微信小程序Component文件",
    ext: ["wxml", "js", "wxss", "json"],
  },
  qqpage: {
    inputTitle: "QQ小程序Page文件",
    ext: ["qml", "js", "qss", "json"],
  },
  qqcomponent: {
    inputTitle: "QQ小程序Component文件",
    ext: ["qml", "js", "qss", "json"],
  },
};

class DuplicateError extends Error {
  constructor(file, message) {
    super(message);
    this.file = file;
    Error.captureStackTrace(this.constructor);
  }
}

class FileGenerator {
  async execute(uri, type) {
    const name = (await this.prompt(type)) || "index";
    console.log(uri, name, type);
    if (!name || !uri) {
      return;
    }
    try {
      this.create(uri, name, type);
    } catch (error) {
      if (error instanceof DuplicateError) {
        vscode.window.showErrorMessage(`Error:该文件已存在无法创建`);
      } else {
        console.error(error);
        vscode.window.showErrorMessage(`Error: ${error.message}`);
      }
    }
  }
  prompt(type) {
    return vscode.window.showInputBox({
      ignoreFocusOut: true,
      placeHolder: `请输入文件名,默认创建index文件`,
      validateInput(name) {
        if (/[\\/:*?"<>|]/.test(name)) {
          return `包含非法字符`;
        }
        if (/[\s]/.test(name)) {
          return "不允许空格";
        }
        return null;
      },
      prompt: `${TYPENAME[type].inputTitle}`,
    });
  }
  create(dir, name, type) {
    const fileName = name;
    const dirname = path.join(dir);
    const pageJsString = `Page({
  data:{},
  onLoad(){},
  onShow(){}
})
    `;
    const componentJsString = `Component({
  data: {},
  properties: {},
  methods: {},
})
    `;
    const htmlString = `<view>${fileName}.${TYPENAME[type].ext[0]}</view>`;
    const pageJson = `{
  "usingComponents":{}
}`;
    const componentJson = `{
  "component": true
}`;
    //ext:['qml','js','qss','json']
    const htmlPath = path.join(dirname, `${fileName}.${TYPENAME[type].ext[0]}`);
    const jsPath = path.join(dirname, `${fileName}.${TYPENAME[type].ext[1]}`);
    const cssPath = path.join(dirname, `${fileName}.${TYPENAME[type].ext[2]}`);
    const jsonPath = path.join(dirname, `${fileName}.${TYPENAME[type].ext[3]}`);

    if (
      fs.existsSync(htmlPath) ||
      fs.existsSync(jsPath) ||
      fs.existsSync(cssPath) ||
      fs.existsSync(jsonPath)
    ) {
      throw new DuplicateError(dirname);
    }
    fs.writeFileSync(htmlPath, htmlString);
    fs.writeFileSync(
      jsPath,
      type.indexOf("page") !== -1 ? pageJsString : componentJsString
    );
    fs.writeFileSync(cssPath, ``);
    fs.writeFileSync(
      jsonPath,
      type.indexOf("page") !== -1 ? pageJson : componentJson
    );
    vscode.window.showInformationMessage(`${name}创建成功`);
  }
}
exports.FileGenerator = FileGenerator;
