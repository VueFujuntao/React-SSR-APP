const express = require('express');
// 讀取文件
const fs = require('fs');
// http 代理
const proxy = require('http-proxy-middleware');
const vm = require('vm');
// webpack
const webpack = require('webpack');
// 路徑
const path = require('path');
// 數據請求
const axios = require('axios');
const NativeModule = require('module');
// 緩存文件讀取
const MemoryFs = require('memory-fs');
const ejs = require('ejs');
// 服務端渲染React
const ReactDOMServer = require('react-dom/server');
// icon 圖標
const favicon = require('serve-favicon');
const serialize = require('serialize-javascript');
// 服務端代買webpack配置
const serverConfig = require('./script/webpack.server.js');

const asyncBootstrap = require('react-async-bootstrapper').default;

const app = express();

app.use(favicon(path.join(__dirname, './favicon.ico')));

const isDev = process.env.NODE_ENV === 'development';



const mfs = new MemoryFs()
const serverCompiler = webpack(serverConfig);
serverCompiler.outputFileSystem = mfs;

let serverBundle;
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err;
  stats = stats.toJson();
  // 遍歷編譯錯誤
  stats.errors.forEach(element => {
    console.error('error' + element);
  });
  // 遍歷編譯警告
  stats.warnings.forEach(element => {
    console.warn('waring  ' + element);
  });
  // 獲取編譯後的文件路徑
  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  )
  // 從緩存中讀取文件
  const bundle = mfs.readFileSync(bundlePath, 'utf-8');
  // 將文件的內容拿取
  const m = getModuleFromString(bundle, 'server-entry.js');
  serverBundle = m.exports;
})

const getModuleFromString = (bundle, filename) => {
  const m = { exports: {} }
  const wrapper = NativeModule.wrap(bundle);
  const script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: true
  });
  const result = script.runInThisContext();
  result.call(m.exports, m.exports, require, m);
  return m;
}

const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/server.ejs').then(res => {
      resolve(res);
    }).catch(error => {
      reject(error);
    })
  })
}


const options = {
  target: "http://localhost:8888",
  changeOrigin: true,
  ws: true
}
const newProxy = proxy(options)

const serverRender = (app) => {
  // 反向代理文件
  app.use('/public/', newProxy);
  app.get('*', function (req, res, next) {
    if (!serverBundle) {
      return res.send('wating');
    }
    getTemplate().then(template => {
      sendRender(serverBundle, template.data, req, res);
    }).catch(error => {
      next();
    })
  })
}

const sendRender = (bundle, template, req, res) => {
  return new Promise((resolve, reject) => {
    // 獲取到的內容
    const createApp = bundle.default;
    const store = bundle.newStore;
    let routerContext = {};
    let app = createApp(routerContext, req.url, store);
    asyncBootstrap(app).then(() => {
      const content = ReactDOMServer.renderToString(app);
      const html = ejs.render(template, {
        appString: content,
        initalState: serialize(store.getState())
      });
      res.send(html);
      resolve(true);
    })
  })
}

//  生產環境
if (!isDev) {
//   const serverEntry = require('../dist/server-entry.js');
//   const templateHtml = fs.readFileSync(path.join(__dirname, '../dist/server.ejs'), 'utf-8');
//   app.use('/public', express.static(path.join(__dirname, '../dist')));
//   app.get('*', function(req, res, next) {
//     serverRender(serverEntry, templateHtml, req, res).catch(next)
//   });
} else {
  serverRender(app);
}

app.listen(3000, function() {
  console.log('server is listening 3000');
})