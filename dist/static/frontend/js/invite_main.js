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
    const invite_url = "".concat(location.origin, "?aff=").concat(res.id);
    utils.useQrcode(invite_url);
    utils.useShare(invite_url);
    utils.useShare(res.id, '.btn-share-code', '邀请码复制成功');
    $('.invite_url').text(invite_url);
    $('.invite_code').text(res.id);
  });
  http({
    url: '/index/userSharedMemberList',
    method: 'GET'
  }).then(items => {
    if (items.length) {
      $('.invites').html(items.map(function (item) {
        return $("<tr> <td>".concat(item.reg_time, "</td><td>").concat(item.id, "</td><td>").concat(item.user_product[0].product.name, "</td><td>").concat(item.status_str, "</td></tr>"));
      }));
      $('.invite_num').text(items.length);
    } else {
      const template = Handlebars.compile($('#empty-template').html());
      $('.empty').html(template());
    }
  });
});