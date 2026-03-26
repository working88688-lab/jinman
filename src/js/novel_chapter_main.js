requirejs.config({
  urlArgs: `v=${js_assets_version}`, // 资源版本号
  baseUrl: '/static/frontend/js',
  paths: {
    jquery: 'lib/jquery',
    zui: 'lib/zui',
    xgplayer: 'lib/xgplayer',
    hlsPlugin: 'lib/xgplayer-hlsjs',
    player: 'plugins/player'
  },
  shim: {
    zui: ['jquery'],
    hlsPlugin: ['xgplayer']
  }
})

requirejs(
  ['plugins/lazyload', 'http', 'utils', 'player', 'jquery', 'common'],
  function (lazyload, http, utils, player) {
    utils.useShare(window.location.href)
    var replaceCache = []
    var replaceStrArray = [{ origin: '', target: '' }]
    var defaultFontSize = 17
    const MIN_SIZE = 14
    const MAX_SIZE = 28
    const REPLACE_KEY = 'novel_replace'

    try {
      replaceStrArray = JSON.parse(localStorage.getItem(REPLACE_KEY)) || [{ origin: '', target: '' }]
    } catch (error) {
      replaceStrArray = [{ origin: '', target: '' }]
    }
    const params = new URLSearchParams(window.location.search)

    $('.btn-open-popup').on('click', function () {
      const type = $(this).data('type')
      $('.dx-popup').addClass('is-open').find(`.${type}`).show().siblings().hide()

      $('.dx-overlay').data('close', '.dx-popup').data('class', 'is-open').fadeIn()

      $('.btn-open-menu').click()

      $(document.documentElement).addClass('overflow')
    })
    // $('.dx-overlay').on('click', function () {
    //   $('.btn-open-menu').click()
    // })

    $('.btn-close-popup').on('click', function () {
      $(this).parents('.dx-popup').removeClass('is-open')

      $('.dx-overlay').fadeOut()

      $(document.documentElement).removeClass('overflow')
    })
    // 卷 点击
    $('.dx-tabs').on('click', '.volume_box-title', function () {
      $(this).parent().toggleClass('is-open')
    })

    // 书签
    $('.btn-mark').on('click', function () {
      http({
        url: '/novel/userNovelHandleMark',
        method: 'get',
        data: {
          novel_id: params.get('novel_id'),
          chapter_no: params.get('chapter_no')
        },
        _options: {
          showError: true,
          showSuccess: true
        }
      })
    })

    function get_user_mark() {
      http({
        url: '/novel/userNovelMark',
        method: 'get',
        data: {
          novel_id: params.get('novel_id')
        }
      }).then(items => {
        const chapter_no = params.get('chapter_no')
        if (
          chapter_no &&
          items.some(function (item) {
            return item.chapter_no === Number(chapter_no)
          })
        ) {
          $('.btn-mark').addClass('text-primary')
        }

        if (items.length) {
          $('.directory .marks .lists').html(
            items.map(function (item) {
              return $(`<li class="volume_box"><a href='novel_chapter.html?novel_id=${item.novel_id}&chapter_no=${item.chapter_no}' class="px-3 py-2 flex items-center justify-between cursor-pointer"><span>${item.node_title}</span>
              <div class="flex-center"><span class="mr-1">${item.created_at}</span>
                <svg class="w-4 h-4">
                  <use class="open" href="/static/frontend/icons/icons.svg#trash"> </use>
                </svg>
              </div></a></li>`)
            })
          )
        }
      })
    }

    function get_audio_list() {
      http({
        url: '/novel/novelAudioList',
        method: 'get'
      }).then(items => {
        if (items.length) {
          $('.dx-popup .music .lists').html(
            items.map(function (item, index) {
              return $(`<button data-src='${item}' class="flex play-music items-center px-3 py-2 dx-hairline--bottom">
              <svg class="w-4 h-4 mr-1">
                <use class="open" href="/static/frontend/icons/icons.svg#play_music"></use>
              </svg><span>背景叫床声${index + 1}</span>
            </button>`)
            })
          )
        }
      })
    }
    let music_player
    $('.dx-popup .music .lists').on('click', '.play-music', function () {
      const url = $(this).data('src')
      if (!music_player) {
        player
          .create_player({
            id: 'audio',
            url,
            loop: true,
            autoplay: true
          })
          .then(_player => {
            music_player = _player
          })
      } else {
        music_player.switchURL(url)
      }
    })

    // 内容替换
    function replaceTargetContent() {
      $.each($('.line'), function () {
        var text = $(this).text()
        replaceStrArray
          .filter(item => item.origin.length && item.target.length)
          .forEach(item => {
            text = text.replace(new RegExp(item.origin), item.target)
            replaceCache.push({
              origin: item.target,
              target: item.origin
            })
          })
        $(this).text(text)
      })
    }

    function renderReplace() {
      var html_string = replaceStrArray
        .map((item, index) => {
          return `<div class="flex items-center whitespace-nowrap px-2 mb-3">将
                <input class="w-[100px] mx-1 border border-solid border-border" type="text" data-type="origin" value="${item.origin}">替换成
                <input class="w-[100px] ml-1 border border-solid border-border" type="text" data-type="target" value="${item.target}">
                <svg class="w-6 h-6 delete" data-index='${index}'>
                  <use class="open" href="/static/frontend/icons/icons.svg#remove"></use>
                </svg>
              </div>`
        })
        .join('')
      $('.replace_box').html($(html_string))
    }

    // 内容替换
    $('.replace_box').on('click', '.delete', function () {
      var index = $(this).data('index')
      replaceStrArray.splice(index, 1)

      renderReplace()
    })
    $('.add_replace').on('click', function () {
      replaceStrArray.push({ origin: '', target: '' })
      renderReplace()
    })

    $('.replace_box').on('input', 'input', function () {
      var index = $(this).parent().index()
      var type = $(this).data('type')

      replaceStrArray[index][type] = $(this).val()
    })
    $('.reset_replace').on('click', function () {
      replaceStrArray = [{ origin: '', target: '' }]

      renderReplace()
      replaceCache.forEach(item => {
        $.each($('.line'), function () {
          var text = $(this).text()
          text = text.replace(new RegExp(item.origin), item.target)

          $(this).text(text)
        })
      })
      replaceCache = []

      localStorage.removeItem(REPLACE_KEY)
    })

    $('.btn_replace').on('click', function () {
      if (replaceStrArray && replaceStrArray.length && replaceStrArray.every(item => item.origin && item.target)) {
        replaceTargetContent()

        utils.useMessage('替换成功', 'success')

        localStorage.setItem(REPLACE_KEY, JSON.stringify(replaceStrArray))
      }
    })

    function set_color_theme(color, index) {
      const arr = [document.body, '.app-header', '.header', '.footer']

      arr.forEach(el => {
        $(el).css('background', color)

        $(document.body).css('color', 'var(--dx-base2-color)')
      })

      if (index === 7) {
        $(document.body).css('color', '#fff')
      }

      $('.custom-theme')
        .eq(index - 1)
        .addClass('is-select')
        .siblings()
        .removeClass('is-select')
    }
    $('.theme').on('click', '.custom-theme', function () {
      const index = $(this).index()
      const color = $(this).data('color')

      set_color_theme(color, index)
    })

    function set_size(font_size) {
      $('.line').css('font-size', font_size + 'px')
      $('.font_size').text(font_size)

      defaultFontSize = font_size
    }
    $('.theme .fontsize_btn').on('click', function () {
      var type = $(this).data('type')
      if (type === -1) {
        defaultFontSize = defaultFontSize <= MIN_SIZE ? MIN_SIZE : defaultFontSize + type
      } else {
        defaultFontSize = defaultFontSize >= MAX_SIZE ? MAX_SIZE : defaultFontSize + type
      }

      set_size(defaultFontSize)
    })

    $('.btn-theme-submit').on('click', function () {
      if (localStorage.getItem('is_login')) {
        http({
          url: '/novel/novelStyleSet',
          data: {
            font_size: defaultFontSize,
            theme: $('.custom-theme.is-select').index()
          }
        }).then(() => {
          utils.useMessage('保存成功', 'success')
        })
      } else {
        localStorage.setItem(
          'novel_setting',
          JSON.stringify({
            font_size: defaultFontSize,
            theme: $('.custom-theme.is-select').index()
          })
        )
        utils.useMessage('保存成功', 'success')
      }
    })

    $('.btn-theme-reset').on('click', function () {
      let setting = {
        font_size: 17,
        theme: 1
      }
      const color = $('.custom-theme')
        .eq(setting.theme - 1)
        .data('color')
      set_color_theme(color, setting.theme)
      set_size(setting.font_size)
      if (localStorage.getItem('is_login')) {
        http({
          url: '/novel/novelStyleSet',
          data: setting
        }).then(() => {
          utils.useMessage('重置成功', 'success')
        })
      } else {
        localStorage.setItem('novel_setting', JSON.stringify(setting))
        utils.useMessage('重置成功', 'success')
      }
    })

    function get_novel_setting() {
      http({
        url: '/novel/novelSetting',
        method: 'get'
      }).then(res => {
        let setting = {
          font_size: 17,
          theme: 1
        }
        if (Array.isArray(res)) {
          try {
            setting = JSON.parse(localStorage.getItem('novel_setting')) || setting
          } catch (error) {}
        }
        const color = $('.custom-theme')
          .eq(setting.theme - 1)
          .data('color')
        set_color_theme(color, setting.theme)
        set_size(setting.font_size)
      })
    }

    renderReplace()
    replaceTargetContent()
    get_user_mark()
    get_audio_list()
    get_novel_setting()
  }
)
