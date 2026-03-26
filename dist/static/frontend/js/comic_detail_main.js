"use strict";

requirejs.config({
  urlArgs: "v=".concat(js_assets_version),
  // 资源版本号
  baseUrl: '/static/frontend/js',
  paths: {
    jquery: 'lib/jquery',
    zui: 'lib/zui'
  },
  shim: {
    zui: ['jquery']
  }
});
requirejs(['utils', 'plugins/lazyload', 'jquery', 'common'], function (utils, lazyload) {
  utils.useShare(window.location.href);
  // lazyload.load_image()
});