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

requirejs(['utils', 'http', 'jquery', 'common'], function (utils, http) {
  utils.get_user_info().then(res => {
    $('.user_coin').text(res.money)
  })
  http({
    url: '/index/productOnlineList',
    method: 'get',
    data: {
      product_type: 2
    }
  }).then(items => {
    $('.lists').html(
      items.map(function (item, index) {
        return $(`<button type='button' class="vip_card border mr-2 last:mr-0 rounded border-solid border-border p-3 ${index === 0 ? 'active' : ''}" data-value='${item.value}' data-id="${item.id}">
                  <div class="flex-center font-semibold">${item.name}</div>
                  <div class="flex-center text-sm my-2">${item.desc}</div>
                  <div class="flex justify-end text-xl">¥${item.price}</div>
                </button>`)
      })
    )
  })

  $('.lists').on('click', '.vip_card', function () {
    if (!$(this).hasClass('active')) {
      $(this).toggleClass('active').siblings().removeClass('active')
    }
  })

  $('.btn-pay').on('click', async function () {
    const product_id = $('.vip_card.active').data('id')
    var pay_way = $('input[name="vip_recharge"]:checked').val()
    if (!pay_way || !product_id) return
    try {
      $(this).attr('disabled', true).text('获取支付链接中...')
      const res = await http({
        url: '/index/createPay',
        data: {
          product_id,
          pay_way
        }
      })

      const origin = `${window.location.origin}/`
      const winRef = window.open(`${origin}waiting.html`, '_blank')
      if (res && res.pay_url && res.type === 'url') {
        winRef.location = res.pay_url
      } else {
        winRef.location = `${origin}error.html`
      }
    } catch (error) {
    } finally {
      $(this).attr('disabled', false).text('充值')
    }
  })
})
