"use strict";

requirejs.config({
  urlArgs: "v=".concat(js_assets_version),
  // 资源版本号
  baseUrl: '/static/frontend/js',
  paths: {
    jquery: 'lib/jquery',
    zui: 'lib/zui',
    xgplayer: 'lib/xgplayer',
    hlsPlugin: 'lib/xgplayer-hlsjs',
    player: 'plugins/player'
  },
  shim: {
    zui: ['jquery'],
    hlsPlugin: ['xgplayer']
  }
});
requirejs(['plugins/lazyload', 'http', 'utils', 'player', 'jquery', 'common'], function (lazyload, http, utils, player) {
  utils.useShare(window.location.href);
  const params = new URLSearchParams(window.location.search);
  $('.btn-open-popup').on('click', function () {
    const type = $(this).data('type');
    $('.dx-popup').addClass('is-open').find(".".concat(type)).show().siblings().hide();
    $('.dx-overlay').data('close', '.dx-popup').data('class', 'is-open').fadeIn();
    $('.btn-open-menu').click();
    $(document.documentElement).addClass('overflow');
  });
  // $('.dx-overlay').on('click', function () {
  //   $('.btn-open-menu').click()
  // })

  $('.btn-close-popup').on('click', function () {
    $(this).parents('.dx-popup').removeClass('is-open');
    $('.dx-overlay').fadeOut();
    $(document.documentElement).removeClass('overflow');
  });
  // 卷 点击
  $('.dx-tabs').on('click', '.volume_box-title', function () {
    $(this).parent().toggleClass('is-open');
  });
});