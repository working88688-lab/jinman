requirejs.config({
  urlArgs: `v=${js_assets_version}`, // 资源版本号
  baseUrl: '/static/frontend/js',
  paths: {
    jquery: 'lib/jquery',
    zui: 'lib/zui',

    swiper: 'lib/swiper'
  },
  shim: {
    zui: ['jquery']
  }
})

requirejs(['common'])
