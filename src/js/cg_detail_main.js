'use strict'

requirejs.config({
  urlArgs: 'v='.concat(js_assets_version),
  // 资源版本号
  baseUrl: '/static/frontend/js',
  paths: {
    jquery: 'lib/jquery',
    zui: 'lib/zui',
    xgplayer: 'lib/xgplayer',
    hlsPlugin: 'lib/xgplayer-hlsjs',
    player: 'plugins/player',
    clipboard: 'lib/clipboard'
  },
  shim: {
    zui: ['jquery'],
    hlsPlugin: ['xgplayer']
  }
})
requirejs(
  ['player', 'plugins/lazyload', 'http', 'utils', 'lib/clipboard', 'lib/handlebars', 'jquery', 'video_helper', 'common'],
  function (player, lazyload, http, utils, Clipboard, Handlebars) {
    let url = ''
    try {
      if (typeof track_vtt) {
        const blob = new Blob([track_vtt], { type: 'text/plain' })
        url = URL.createObjectURL(blob)
      }
    } catch (error) {}

     

    const clipboard = new Clipboard('.btn-share')
    clipboard.on('success', function (e) {
      new $.zui.Messager('复制成功', {
        time: 2000,
        close: false,
        type: 'success'
      }).show()

      $('.share-container').addClass('is-success')
    })

    $('.btn-show-share').on('click', function () {
      $('.share-container').removeClass('is-success').toggleClass('is-open')

      $(this).toggleClass('is-open')
    })

    lazyload.load_image()
    lazyload.load_image('file')
    const params = new URLSearchParams(window.location.search)
    const $video = $('#mse')

    if ($video.get(0)) {
      player
        .create_player({
          id: 'mse',
          url: $video.data('url'),
          poster: $video.data('poster'),

          pip: {
            showIcon: true,
            preferDocument: true,
            index: 1
          },
          volume: {
            index: 7
          },

          autoplay: false,
          muted: false,
          autoplayMuted: false,
          // 字幕，
          track: {
            url: url,
            language: 'zh-cn',
            label: '字幕1'
          },

          last_play_time: {
            key: $video.data('video')
          }
        })
        .then(my_player => {
          my_player.once('play', async function () {
            try {
              await http({
                url: '/index/videoHot',
                method: 'post',
                data: {
                  video_id: $video.data('video')
                }
                // _options: {
                //     showError: true
                // }
              })
              // new $.zui.Messager('点赞成功', {
              //     time: 3000,
              //     type: 'success' // 定义颜色主题
              // }).show();
            } catch (error) {
              console.log('error: ', error)
            }
          })
        })
    }

    $('.dx-tabs').on('click', '.dx-tab', function () {
      const $this = $(this)
      const index = $this.index()
      $this
        .addClass('dx-tab--active')
        .siblings()
        .removeClass('dx-tab--active')
        .parents('.dx-tab-list')
        .siblings('.dx-tab-content')
        .removeClass('dx-tab-content--active')
        .eq(index)
        .addClass('dx-tab-content--active')

      // const action = index ? 'show' : 'hide'
      // $('.fixed-footer')[action]()
    })

    //

    async function get_comments(page) {
      const video_id = $('.video-comment-show').data('video_id')
      try {
        const result = await http({
          url: '/index/commentlist',
          method: 'get',
          data: {
            video_id,
            page
          },
          _options: {
            showError: true
          }
        })

        var my_pager = $('.pager').data('zui.pager')

        my_pager.set(result.page, result.page_count, 10)
        const item_hbs = $('#comment-template').html()
        const template = Handlebars.compile(item_hbs)
        $('.comments').html(
          template({
            items: result.data
          })
        )

        $('#comment-input').val('')
        lazyload.load_image()
      } catch (e) {
        return Promise.reject(e)
      }
    }

    $('.video-comment-show').on('click', async function () {
      const video_id = $(this).data('video_id')
      console.log('video_id...', video_id)
      try {
        // $(this).attr('disabled', true);

        get_comments(1)
      } catch (error) {
        $(this).attr('disabled', false)
        console.log('_e: ', error)
      } finally {
        $(this).attr('disabled', false)
      }
    })

    // 用户关注视频作者-end
    $('.focus-user').on('click', async function () {
      const user_id = $(this).data('user_id')
      const video_id = $(this).data('video_id')
      // console.log('user_id...', user_id);
      try {
        // $(this).attr('disabled', true);

        const result = await http({
          url: '/user/savefocus',
          method: 'post',
          data: {
            user_id,
            video_id
          },
          _options: {
            showError: true
          }
        })
        $(this).text(result['btn_text'])

        $('.text-focus').text(result['focus_num'])
      } catch (error) {
        $(this).attr('disabled', false)
        console.log('_e: ', error)
      } finally {
        $(this).attr('disabled', false)
      }
    })

    // 视频点赞-end
    $('.video-like').on('click', async function () {
      const video_id = $(this).data('video_id')
      // console.log('video_id...', video_id);
      // console.log('like_val...', like_val);
      try {
        // $(this).attr('disabled', true);

        const result = await http({
          url: '/user/like',
          method: 'post',
          data: {
            video_id
          },
          _options: {
            showError: true
          }
        })

        let svg_class = ''
        if (result['user_like'] > 0) {
          svg_class = 'text-primary'
        }

        let html =
          '<svg class="w-5 h-5 ' +
          svg_class +
          ' svg-icon mr-1">' +
          '<use href="/static/frontend/icons/icons.svg#like"></use></svg>' +
          '<span>' +
          result['like_count'] +
          '</span>'

        // console.log('html ...', html);
        $(this).html(html)

        // new $.zui.Messager('设置成功', {
        //     type: 'success' // 定义颜色主题
        // }).show();

        // await sleep(1000);

        // location.reload();
      } catch (error) {
        $(this).attr('disabled', false)
        console.log('_e: ', error)
      } finally {
        $(this).attr('disabled', false)
      }
    })

    // 视频收藏-end
    $('.collect-video').on('click', async function () {
      const video_id = $(this).data('video_id')
      // const collect_val = $(this).data('collect_val');
      // console.log('video_id...', video_id);
      // console.log('collect_val...', collect_val);
      try {
        // $(this).attr('disabled', true);

        const result = await http({
          url: '/user/savecollect',
          method: 'post',
          data: {
            video_id
          },
          _options: {
            showError: true
          }
        })

        let collect_txt = ''
        let text_primary = ''
        if (result['collect_status'] > 0) {
          $(this).addClass('text-primary')
          text_primary = 'text-primary'
          collect_txt = '取消收藏'
        } else {
          $(this).removeClass('text-primary')
          collect_txt = '收藏视频'
        }

        const html =
          '<svg class="w-5 h-5 svg-icon mr-1">\n' +
          '                                            <use href="/static/frontend/icons/icons.svg#collect"></use>\n' +
          '                                        </svg>' +
          collect_txt

        $(this).html(html)

        const collect_div =
          '<svg class="w-5 h-5 svg-icon mr-1\n' +
          text_primary +
          '">\n' +
          '<use href="/static/frontend/icons/icons.svg#heart"></use>\n' +
          '</svg>' +
          result['collect_count']

        $('.collect-div').html(collect_div)
      } catch (error) {
        $(this).attr('disabled', false)
        console.log('_e: ', error)
      } finally {
        $(this).attr('disabled', false)
      }
    })

    $('.dx-tab-content').on('click', '.btn-comment', async function () {
      const id = $(this).data('id')
      const comment_id = $(this).data('comment_id')
      let comment_key = '#comment-input'
      if (comment_id > 0) {
        comment_key = '#comment-input-' + comment_id
      }

      const value = $(comment_key).val()

      try {
        // $(this).attr('disabled', true);

        await http({
          url: '/index/comment',
          method: 'post',
          data: {
            id,
            comment_id,
            value
          },
          _options: {
            showError: true
          }
        })
        new $.zui.Messager('评论成功', {
          time: 2000,
          close: false,
          type: 'success'
        }).show()
        get_comments(1)
      } catch (error) {
        $(this).attr('disabled', false)
        console.log('_e: ', error)
      }
    })

    $('.comments').on('click', '.btn-reply', function () {
      const $root = $(this).parents('.video-comment')
      const user_name = $(this).siblings('div').find('.avatar-link').text().trim()
      const $c = $root.find('.reply-container')
      $c.find('input').attr('placeholder', '\u56DE\u590D'.concat(user_name))
      $c.show()
      setTimeout(() => {
        $c.find('input').focus()
      }, 0)
    })
    if (utils.isPc) {
      utils.useQrcode(location.href)
    }
    $('.pager').pager({
      page: 1,
      onPageChange: function onPageChange(state, oldState) {
        if (state.page !== oldState.page) {
          console.log('页码从', oldState.page, '变更为', state.page)
          get_comments(state.page)
        }
      }
    })
  }
)
