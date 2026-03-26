requirejs.config({
  urlArgs: `v=${js_assets_version}`, // 资源版本号
  baseUrl: '/static/frontend/js',
  paths: {
    jquery: 'lib/jquery',
    zui: 'lib/zui',
    handlebars: 'lib/handlebars'
  },
  shim: {
    zui: ['jquery']
  }
})

requirejs(
  ['plugins/lazyload', 'http', 'handlebars', 'utils', 'db', 'jquery', 'common'],
  function (lazyload, http, Handlebars, utils, db) {
    const map = {
      1: 'novel',
      2: 'video',
      3: 'comic'
    }

    const api_map = {
      1: '/index/userCollectedList',
      2: '/index/userPurchaseList'
    }

    const count_api_map = {
      1: '/index/userCollectStatistics',
      2: '/index/userPurchaseStatistics'
    }

    $('.pager').pager({
      recTotal: 0,
      recPerPage: 10,
      onPageChange: function (state, oldState) {
        const index = get_active_cate()
        const type = get_active_tab()
        if (state.page !== oldState.page) {
          if (index <= 2) {
            get_user_collects(type, index, state.page)
          } else {
            get_history_data(type, index, state.page)
          }
        }
      }
    })

    // 注册自定义 'equals' 帮助器
    Handlebars.registerHelper('equals', function (value1, value2, options) {
      if (value1 === value2) {
        return options.fn(this) // 如果相等，返回 'if' 块
      }
    })

    function get_active_cate() {
      return $('.cate-container .btn-primary').index() + 1
    }

    function get_active_tab() {
      return $('.types .btn-primary').index() + 1
    }
    function render_list(type, items, cate) {
      if (cate !== get_active_cate() && get_active_tab()) {
        return
      }
      const index = type - 1
      const $container = $('.dx-tab-content').eq(index).find('.lists')
      if (items.length) {
        const template_id = `#${map[type]}-item-template`
        const template = Handlebars.compile($(template_id).html())

        $container.css('display', 'grid').html(
          template({
            items: items.map(function (item) {
              item.target = item.target || {}
              return {
                ...item,
                target: {
                  ...item.target,
                  status: item.target.status === '2' ? '已完结' : '连载中',
                  collect_count: utils.formatNumberWithUnit(item.target.collect_count || item.target.collect_num),
                  view_count: utils.formatNumberWithUnit(item.target.view_count || item.target.view_num)
                }
              }
            })
          })
        )

        lazyload.load_image()
      } else {
        const template = Handlebars.compile($('#empty-template').html())

        $container.css('display', 'flex').html(template())
      }
    }

    function get_user_collects(type, cate, page = 1) {
      const url = api_map[cate]
      http({
        url: url,
        method: 'GET',
        data: {
          type: type,
          page: page,
          limit: 10
        }
      }).then(items => {
        render_list(type, items, cate)
      })
    }

    function get_type_collects(cate) {
      get_user_collects(1, cate)
      get_user_collects(2, cate)
      get_user_collects(3, cate)
    }

    function update_pager(el, model) {
      var pager = $(el).data('zui.pager')

      if (model) {
        pager.set(1, model.num, 10)
      } else {
        pager.set(1, 0, 10)
      }
    }

    function get_type_current_count(type) {
      http({
        url: count_api_map[type],
        method: 'GET'
      }).then(items => {
        if (type == get_active_cate()) {
          items.forEach(item => {
            if (item.target_type === 'NovelModel') {
              $('.types button').eq(0).find('span').text(item.num)
            }
            if (item.target_type === 'MvModel') {
              $('.types button').eq(1).find('span').text(item.num)
            }
            if (item.target_type === 'ComicModel') {
              $('.types button').eq(2).find('span').text(item.num)
            }
          })

          const novel_model = items.find(item => item.target_type === 'NovelModel')
          const video_model = items.find(item => item.target_type === 'MvModel')
          const comic_model = items.find(item => item.target_type === 'ComicModel')
          update_pager('.pager1', novel_model)
          update_pager('.pager2', video_model)
          update_pager('.pager3', comic_model)
        }
      })
    }

    const DB_MAP = {
      1: 'novel',
      2: 'video',
      3: 'comic'
    }
    function get_history_data(cate, type, page = 1) {
      return db.get(DB_MAP[cate], page).then(res => {
        render_list(cate, res.items, type)
        return res
      })
    }

    $('.cate-container').on('click', 'button', function () {
      utils.check_login(() => {
        if (!$(this).hasClass('btn-primary')) {
          const type = $(this).data('type')
          $(this).addClass('btn-primary').siblings().removeClass('btn-primary')
          $('.dx-tab-list button').find('span').text(0)
          $('.dx-tabs .dx-tab-list .dx-tab').eq(0).addClass('btn-primary').siblings().removeClass('btn-primary')
          const index = type - 1
          $('.dx-tab-content').eq(index).find('ul').html()
          if (type <= 2) {
            get_type_collects(type)
            get_type_current_count(type)
          } else {
            get_history_data(1, type).then(res => {
              update_pager(`.pager1`, { num: res.total })
            })
            get_history_data(2, type).then(res => {
              update_pager(`.pager3`, { num: res.total })
            })
            get_history_data(3, type).then(res => {
              update_pager(`.pager3`, { num: res.total })
            })
          }
        }
      })
    })
    utils.check_login(() => {
      get_type_collects(1)
      get_type_current_count(1)
    })
  }
)
