"use strict";

requirejs.config({
  urlArgs: "v=".concat(js_assets_version),
  // 资源版本号
  baseUrl: '/static/frontend/js',
  paths: {
    jquery: 'lib/jquery',
    zui: 'lib/zui',
    lazyload: 'plugins/lazyload',
    cryptojs: 'lib/crypto'
  },
  shim: {
    zui: ['jquery']
  }
});
requirejs(['lazyload', 'http', 'jquery', 'common'], function (lazyload, http) {
  lazyload.load_image();
});