requirejs.config({
  urlArgs: `v=${js_assets_version}`, // 资源版本号
  baseUrl: '/static/frontend/js',
  paths: {
    jquery: 'lib/jquery',
    zui: 'lib/zui'
  },
  shim: {
    zui: ['jquery']
  }
})

requirejs(['jquery', 'plugins/lazyload', 'utils', 'video_helper', 'common'], function ($, lazyload, utils) {
  lazyload.load_image()
  lazyload.load_bg_image()

  const params = new URLSearchParams(window.location.search)

  $('.pager').pager({
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

  $('.open-popover').on('click', function () {
    const $this = $(this)
    const $target = $(`${$this.data('target')}`)

    $target.fadeToggle(200)

    $this.toggleClass('text-primary')

    $target.one('mouseleave', function () {
      $target.fadeOut(200)

      $this.removeClass('text-primary')
    })
  })
})
