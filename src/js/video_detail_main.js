requirejs.config({
  urlArgs: `v=${js_assets_version}`, // 资源版本号
  baseUrl: '/static/frontend/js',
  paths: {
    jquery: 'lib/jquery',
    zui: 'lib/zui',
    xgplayer: 'lib/xgplayer',
    hlsPlugin: 'lib/xgplayer-hlsjs',
    player: 'plugins/player',
    swiper: 'lib/swiper'
  },
  shim: {
    zui: ['jquery'],
    hlsPlugin: ['xgplayer']
  }
})

requirejs(['player', 'utils', 'http', 'jquery', 'swiper', 'common'], function (player, utils, http) {
  utils.useShare(location.href)

  const swiper = new Swiper('.swiper', {
    // Optional parameters
    loop: true,
    // autoplay: true,
    pagination: {
      el: '.swiper-pagination',
      dynamicBullets: true
    }
  })

  const params = new URLSearchParams(window.location.search)

  const $video = $('#mse')
  player
    .create_player({
      id: 'mse',
      url: $video.data('url'),
      poster: $video.data('poster'),
      muted: false,
      autoplay: false,
      autoplayMuted: false,
      pip: {
        showIcon: true,
        preferDocument: true,
        index: 1
      },
      volume: {
        index: 7
      },
      autoplayMuted: false
      // 字幕，
    })
    .then(my_player => {
      // 隐藏静态封面占位
      $video.find('.mse-poster').hide()
      my_player.once('play', e => {
        console.log('e: ', e)
        // 统计播放
      })
    })

  // 视频点赞
  $('.video-action').on('click', '.btn-like', async function () {
    try {
      const res = await http({
        url: '/_api/comic/member/videoGood',
        method: 'post',
        data: {
          video_id: params.get('id')
        },
        _options: {
          showError: true
        }
      })
      new $.zui.Messager('点赞成功', {
        time: 3000,
        type: 'success' // 定义颜色主题
      }).show()
    } catch (error) {
      console.log('error: ', error)
    }
  })

  // 视频收藏
  $('.video-action').on('click', '.btn-heart', async function () {
    try {
      const res = await http({
        url: '/_api/comic/member/videoLike',
        method: 'post',
        data: {
          video_id: params.get('id')
        },
        _options: {
          showError: true
        }
      })
      new $.zui.Messager('点赞成功', {
        time: 3000,
        type: 'success' // 定义颜色主题
      }).show()
    } catch (error) {
      console.log('error: ', error)
    }
  })

  // 评论点赞
  $('.comments').on('click', '.btn-like', async function () {
    const comment_id = $(this).parent().data('id')

    try {
      await http({
        url: '/_api/comic/member/commentGood',
        method: 'post',
        data: {
          comment_id
        },
        _options: {
          showError: true
        }
      })
      new $.zui.Messager('点赞成功', {
        time: 3000,
        type: 'success' // 定义颜色主题
      }).show()
    } catch (error) {
      console.log('error: ', error)
    }
  })

  // 发起评论
  $('.comments').on('click', '.btn-reply', function () {
    const $root = $(this).parents('.video-comment-content')
    const user_name = $(this).siblings('.avatar-info').find('.avatar-name').text().trim()

    const $c = $root.find('.reply-container')
    $c.find('input').attr('placeholder', `回复${user_name}`)
    $c.show()

    setTimeout(() => {
      $c.find('input').focus()
    }, 0)
  })

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
