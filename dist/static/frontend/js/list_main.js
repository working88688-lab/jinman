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
requirejs(['utils', 'jquery', 'common'], function (utils) {
  const params = new URLSearchParams(window.location.search);
  const to_page = $('.pager').data('link');
  $('.pager').pager({
    maxNavCount: 8,
    page: Number(params.get('page') || 1),
    linkCreator: function linkCreator(page, pager) {
      const to = '?' + utils.format_url_search_params({
        page
      });
      return to_page ? to_page + to : to;
    },
    onPageChange: function onPageChange(state, oldState) {
      if (state.page !== oldState.page) {
        const to = '?' + utils.format_url_search_params({
          page: state.page
        });
        console.log('页码从', oldState.page, '变更为', state.page);
        window.location.href = to_page ? to_page + to : to;
      }
    }
  });
});