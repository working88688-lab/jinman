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

requirejs(['utils', 'http', 'lib/handlebars', 'jquery', 'common'], function (utils, http, Handlebars) {
  utils.get_user_info().then(res => {
    const invite_url = `${location.origin}?aff=${res.id}`
    utils.useQrcode(invite_url)
    utils.useShare(invite_url)
    utils.useShare(res.id, '.btn-share-code', '邀请码复制成功')
    $('.invite_url').text(invite_url)
    $('.invite_code').text(res.id)
  })

  http({
    url: '/index/userSharedMemberList',
    method: 'GET'
  }).then(items => {
    if (items.length) {
      $('.invites').html(
        items.map(function (item) {
          return $(
            `<tr> <td>${item.reg_time}</td><td>${item.id}</td><td>${item.user_product[0].product.name}</td><td>${item.status_str}</td></tr>`
          )
        })
      )

      $('.invite_num').text(items.length)
    } else {
      const template = Handlebars.compile($('#empty-template').html())

      $('.empty').html(template())
    }
  })
})
