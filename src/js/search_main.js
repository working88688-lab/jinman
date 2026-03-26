requirejs.config({
  urlArgs: `v=${js_assets_version}`, // 资源版本号
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
})

requirejs(['jquery', 'lazyload', 'utils', 'video_helper', 'common'], function ($, lazyload, utils) {
  const params = new URLSearchParams(window.location.search)

  lazyload.load_image()

  $('.pager').pager({
    maxNavCount: 8,
    page: Number(params.get('page') || 1),
    linkCreator: function (page, pager) {
      return '?' + utils.format_url_search_params({ page })
    },
    onPageChange: function (state, oldState) {
      if (state.page !== oldState.page) {
        console.log('页码从', oldState.page, '变更为', state.page)
        window.location.href = '?' + utils.format_url_search_params({ page: state.page })
      }
    }
  })
})
