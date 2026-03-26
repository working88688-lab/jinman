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
requirejs(['utils', 'http', 'plugins/lazyload', 'db', 'common', 'jquery'], function (utils, http, lazyload, db) {
  // 退出登录
  $('.btn-logout').on('click', async function () {
    try {
      await http({
        url: '/index/logout'
      });
      localStorage.clear();
      sessionStorage.clear();
      document.cookie = "landing_modal_key =; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      db.clear();
      window.location.href = '/';
    } catch (error) {
      console.log('error: ', error);
    }
  });

  // utils.get_user_info().then(res => {
  //   $('.user_name').text(res.nick_name)
  //   $('.user_id').text(`id: ${res.id}`)
  //   $('.user_avatar').attr('data-src', res.avatar_str)

  //   lazyload.load_image()
  // })
});