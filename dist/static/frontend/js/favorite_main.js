"use strict";

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
requirejs.config({
  urlArgs: "v=".concat(js_assets_version),
  // 资源版本号
  baseUrl: '/static/frontend/js',
  paths: {
    jquery: 'lib/jquery',
    zui: 'lib/zui',
    handlebars: 'lib/handlebars'
  },
  shim: {
    zui: ['jquery']
  }
});
requirejs(['plugins/lazyload', 'http', 'handlebars', 'utils', 'db', 'jquery', 'common'], function (lazyload, http, Handlebars, utils, db) {
  const map = {
    1: 'novel',
    2: 'video',
    3: 'comic'
  };
  const api_map = {
    1: '/index/userCollectedList',
    2: '/index/userPurchaseList'
  };
  const count_api_map = {
    1: '/index/userCollectStatistics',
    2: '/index/userPurchaseStatistics'
  };
  $('.pager').pager({
    recTotal: 0,
    recPerPage: 10,
    onPageChange: function onPageChange(state, oldState) {
      const index = get_active_cate();
      const type = get_active_tab();
      if (state.page !== oldState.page) {
        if (index <= 2) {
          get_user_collects(type, index, state.page);
        } else {
          get_history_data(type, index, state.page);
        }
      }
    }
  });

  // 注册自定义 'equals' 帮助器
  Handlebars.registerHelper('equals', function (value1, value2, options) {
    if (value1 === value2) {
      return options.fn(this); // 如果相等，返回 'if' 块
    }
  });
  function get_active_cate() {
    return $('.cate-container .btn-primary').index() + 1;
  }
  function get_active_tab() {
    return $('.types .btn-primary').index() + 1;
  }
  function render_list(type, items, cate) {
    if (cate !== get_active_cate() && get_active_tab()) {
      return;
    }
    const index = type - 1;
    const $container = $('.dx-tab-content').eq(index).find('.lists');
    if (items.length) {
      const template_id = "#".concat(map[type], "-item-template");
      const template = Handlebars.compile($(template_id).html());
      $container.css('display', 'grid').html(template({
        items: items.map(function (item) {
          item.target = item.target || {};
          return _objectSpread(_objectSpread({}, item), {}, {
            target: _objectSpread(_objectSpread({}, item.target), {}, {
              status: item.target.status === '2' ? '已完结' : '连载中',
              collect_count: utils.formatNumberWithUnit(item.target.collect_count || item.target.collect_num),
              view_count: utils.formatNumberWithUnit(item.target.view_count || item.target.view_num)
            })
          });
        })
      }));
      lazyload.load_image();
    } else {
      const template = Handlebars.compile($('#empty-template').html());
      $container.css('display', 'flex').html(template());
    }
  }
  function get_user_collects(type, cate) {
    let page = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    const url = api_map[cate];
    http({
      url: url,
      method: 'GET',
      data: {
        type: type,
        page: page,
        limit: 10
      }
    }).then(items => {
      render_list(type, items, cate);
    });
  }
  function get_type_collects(cate) {
    get_user_collects(1, cate);
    get_user_collects(2, cate);
    get_user_collects(3, cate);
  }
  function update_pager(el, model) {
    var pager = $(el).data('zui.pager');
    if (model) {
      pager.set(1, model.num, 10);
    } else {
      pager.set(1, 0, 10);
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
            $('.types button').eq(0).find('span').text(item.num);
          }
          if (item.target_type === 'MvModel') {
            $('.types button').eq(1).find('span').text(item.num);
          }
          if (item.target_type === 'ComicModel') {
            $('.types button').eq(2).find('span').text(item.num);
          }
        });
        const novel_model = items.find(item => item.target_type === 'NovelModel');
        const video_model = items.find(item => item.target_type === 'MvModel');
        const comic_model = items.find(item => item.target_type === 'ComicModel');
        update_pager('.pager1', novel_model);
        update_pager('.pager2', video_model);
        update_pager('.pager3', comic_model);
      }
    });
  }
  const DB_MAP = {
    1: 'novel',
    2: 'video',
    3: 'comic'
  };
  function get_history_data(cate, type) {
    let page = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    return db.get(DB_MAP[cate], page).then(res => {
      render_list(cate, res.items, type);
      return res;
    });
  }
  $('.cate-container').on('click', 'button', function () {
    utils.check_login(() => {
      if (!$(this).hasClass('btn-primary')) {
        const type = $(this).data('type');
        $(this).addClass('btn-primary').siblings().removeClass('btn-primary');
        $('.dx-tab-list button').find('span').text(0);
        $('.dx-tabs .dx-tab-list .dx-tab').eq(0).addClass('btn-primary').siblings().removeClass('btn-primary');
        const index = type - 1;
        $('.dx-tab-content').eq(index).find('ul').html();
        if (type <= 2) {
          get_type_collects(type);
          get_type_current_count(type);
        } else {
          get_history_data(1, type).then(res => {
            update_pager(".pager1", {
              num: res.total
            });
          });
          get_history_data(2, type).then(res => {
            update_pager(".pager3", {
              num: res.total
            });
          });
          get_history_data(3, type).then(res => {
            update_pager(".pager3", {
              num: res.total
            });
          });
        }
      }
    });
  });
  utils.check_login(() => {
    get_type_collects(1);
    get_type_current_count(1);
  });
});