requirejs.config({
  urlArgs: `v=${js_assets_version}`, // 资源版本号
  baseUrl: '/static/frontend/js',
  paths: {
    jquery: 'lib/jquery',
    zui: 'lib/zui',

    swiper: 'lib/swiper'
  },
  shim: {
    zui: ['jquery']
  }
})

requirejs(['jquery', 'utils', 'plugins/lazyload', 'swiper', 'common'], function ($, utils, lazyload) {
  new Swiper('.swiper', {
    // Optional parameters
    loop: true,
    spaceBetween: 0,
    slidesPerView: 1,
    centeredSlides: true,
    // autoplay: true,
    pagination: {
      el: '.swiper-pagination'
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  })

  //分类下的轮播广告
   new Swiper('.swiper-ad', {
    // Optional parameters
    loop: true,
    spaceBetween: 0,
    slidesPerView: 1,
    centeredSlides: true,
    autoplay: true,
  })

  function create_swiper_list() {
    if (utils.isMobile) {
      $('.swiper-list').each(function () {
        const container_type = `dx-${$(this).data('type')}-list`
        const $swiper = $(`<div class="swiper"><div class="swiper-wrapper"></div></div>`)
        const items = $(this).children()
        $(this).removeClass(container_type).empty()

        const grid_num = Math.ceil(items.length / 6)

        for (let i = 0; i < grid_num; i++) {
          const $ul = $(`<div class="swiper-slide"><div class="${container_type} gap-2.5 md:gap-4"></div></div>`)
          const grid_items = items.slice(i * 6, (i + 1) * 6)
          let gird_html = ''
          grid_items.each(function () {
            const _html = $(this).html()
            gird_html += _html
          })
          $ul.find(`.${container_type}`).append($(gird_html))
          $swiper.find('.swiper-wrapper').append($ul)
        }
        $(this).append($swiper)
        new Swiper($swiper.get(0), {
          loop: false,
          spaceBetween: 0,
          slidesPerView: 1,
          centeredSlides: true
        })

        lazyload.load_image()
      })
    }
  }

  create_swiper_list()
})
