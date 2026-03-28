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

requirejs(['utils', 'jquery', 'common'], function (utils) {

  utils.useShare(window.location.href)

  function setActiveTab(tab) {
    const $btns = $('.novel-tab-btn')
    $btns.each(function () {
      const $btn = $(this)
      const isActive = $btn.data('tab') === tab
      $btn.toggleClass('is-active', isActive)
    })

    $('.novel-panel').addClass('detail-page__panel--hidden')
    if (tab === 'catalog') {
      $('.novel-panel-catalog').removeClass('detail-page__panel--hidden')
    } else {
      $('.novel-panel-comments').removeClass('detail-page__panel--hidden')
    }
  }

  //- 评论区按设计稿走“模拟评论”，不请求接口
  setActiveTab('catalog')

  $('.novel-tab-btn').on('click', function () {
    setActiveTab($(this).data('tab'))
  })

  //- 保留旧按钮绑定占位（当前模板不显示）
})
