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
requirejs(['utils', 'http', 'lib/handlebars', 'plugins/lazyload', 'jquery', 'common'], function (utils, http, Handlebars, lazyload) {
  utils.useShare(window.location.href);
  const params = new URLSearchParams(window.location.search);
  const comments_limit = 10;
  let comment_page = 1;
  Handlebars.registerHelper('fixed', function (a) {
    return a.toFixed(2);
  });
  function get_novel_comments(page) {
    return http({
      url: '/index/commentList',
      method: 'get',
      data: {
        type: 1,
        target_id: params.get('id'),
        order: 'id',
        page,
        limit: comments_limit
      },
      _options: {
        showError: true
      }
    }).then(res => {
      comment_page++;
      const {
        count,
        comments: items
      } = res;
      $('.total-comment').text("\u5168\u90E8\u8BC4\u8BBA[\u5171".concat(count, "\u6761]"));
      const rest_comments = count - page * comments_limit;
      if (count > page * comments_limit) {
        $('.total-comment-expand').text("\u5C55\u5F00\u5269\u4F59".concat(rest_comments, "\u6761\u8BC4\u8BBA")).parents('.hidden').show();
      } else {
        $('.total-comment-expand').parents('.hidden').hide();
      }
      if (items.length) {
        const item_hbs = $('#comment-template').html();
        const template = Handlebars.compile(item_hbs);
        $('.comments').append(template({
          items
        }));
        $('.dx-rate').rating();
        lazyload.load_image();
      }
    });
  }
  get_novel_comments(1);
  $('.btn-expand-comment').on('click', function () {
    $(this).attr('disabled', true);
    get_novel_comments(comment_page).finally(() => {
      $(this).attr('disabled', false);
    });
  });
});