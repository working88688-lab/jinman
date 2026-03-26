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
requirejs(['utils', 'http', 'lib/handlebars', 'jquery', 'common'], function (utils, http, Handlebars) {
  utils.get_user_info().then(res => {
    $('.user_coin').text(res.money);
  });
  http({
    url: '/index/memberTransfer',
    method: 'get',
    data: {
      page: 1
    }
  }).then(items => {
    if (items.length) {
      $('.lists').html(items.map(function (item, index) {
        return $("<tr> <td>".concat(item.created_at, "</td><td>").concat(item.target_type_str, "</td><td>").concat(item.balance, "</td></tr>"));
      }));
    } else {
      const template = Handlebars.compile($('#empty-template').html());
      $('.empty').html(template());
    }
  });
});