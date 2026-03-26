'use strict';

define(['jquery', 'validate', 'utils', 'http', 'plugins/lazyload', 'zui', 'warn'], function ($, validator, utils, http, lazyload) {
  const params = new URLSearchParams(window.location.search);
  lazyload.load_image();
  function show_modal_type(index) {
    $('#login_modal').find('.dx-tabs .dx-tab-content').eq(index).addClass('dx-tab-content--active').siblings().removeClass('dx-tab-content--active');
    $('#login_modal').find('.dx-tabs .dx-tab-item').eq(index).addClass('is-active').siblings().removeClass('is-active');
    show_login(index === 0 ? 'login' : 'register');
  }
  // 头部导航
  $('#app-nav').on('click', 'li', function () {
    $(this).toggleClass('is-open').siblings().removeClass('is-open');
  });
  $('#app-nav').on('mouseleave', '.submenu', function () {
    $(this).parent().removeClass('is-open');
  });
  $('.dx-tabs').on('click', '.dx-tab-item', function () {
    const $this = $(this);
    const index = $this.index();
    $this.addClass('is-active').siblings().removeClass('is-active').parents('.dx-tabs').find('.dx-tab-content').removeClass('dx-tab-content--active').eq(index).addClass('dx-tab-content--active');
  });

  // 登录注册
  $('.btn-login').on('click', function () {
    const ctx = $(this);
    const type = ctx.data('type');
    const dismiss = ctx.data('dismiss');
    const className = ctx.data('class');
    if (dismiss) {
      $('.dx-overlay').hide();
      if (className) {
        ctx.parents('.'.concat(dismiss)).removeClass(className);
      } else {
        ctx.parents('.'.concat(dismiss)).hide();
      }
      // $(document).off('click')
    }
    const index = type === 'login' ? 0 : 1;
    show_modal_type(index);
    return false;
  });

  //  显示登录框
  function show_login() {
    let _type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'login';
    $('#login_modal').modal({
      position: 'center',
      show: true,
      backdrop: 'static'
    });
  }
  const validate = validator.useValidator({
    email: [{
      type: 'email',
      required: true,
      message: '邮箱地址不正确'
    }],
    pass: [{
      type: 'string',
      required: true,
      message: '密码不能为空'
    }, {
      min: 6,
      max: 128,
      message: '密码长度必须为(6-128)个字符'
    }],
    checkcode: {
      asyncValidator: (rule, value) => {
        return new Promise((resolve, reject) => {
          const $tab = $('#login_modal .dx-tab-item.is-active');
          if ($tab.index() === 0) {
            resolve();
          }
          const p1 = $('#register-checkcode').val();
          if (!p1 || p1.length < 6) {
            reject('邮箱验证码为6位');
          } else {
            resolve();
          }
        });
      }
    }
  });
  $('#login_modal').on('click', '.btn-change', function () {
    const type = $(this).data('type');
    $('#login_modal .modal-content').children().eq(type).show().siblings().hide();
  });

  // 登录
  $('.btn-login-submit').on('click', async function () {
    const email = $('#login-email').val();
    const pass = $('#login-password').val();
    try {
      $(this).attr('disabled', true);
      await validate({
        email,
        pass
      });
      await http({
        url: '/index/login',
        method: 'post',
        data: {
          email,
          pass
        },
        _options: {
          showError: true
        }
      });
      localStorage.setItem('is_login', 1);
      location.reload();
    } catch (error) {
      $(this).attr('disabled', false);
      console.log('_e: ', error);
    }
  });

  // 注册
  $('.btn-register-submit').on('click', async function () {
    const email = $('#register-email').val();
    const pass = $('#register-password').val();
    const checkcode = $('#register-checkcode').val();
    const aff = $('#register-aff').val();
    try {
      $(this).attr('disabled', true);
      await validate({
        email,
        pass,
        checkcode
      });
      await http({
        url: '/index/register',
        method: 'post',
        data: {
          email,
          pass,
          checkcode,
          aff
        },
        _options: {
          showError: true
        }
      });
      show_modal_type(0);
    } catch (error) {
      $(this).attr('disabled', false);
      console.log('_e: ', error);
    }
  });
  const validateCode = validator.useValidator({
    email: [{
      type: 'email',
      required: true,
      message: '邮箱地址不正确'
    }]
  });
  // 邮箱验证吗
  $('.btn-send-code').on('click', async function () {
    const type = $(this).data('type');
    const email = $('#'.concat(type, '-email')).val();
    try {
      await validateCode({
        email
      });
      $(this).attr('disabled', true);
      http({
        url: '/index/sendEmailCode',
        data: {
          email
        },
        _options: {
          showError: true,
          showSuccess: true
        }
      });
    } catch (error) {} finally {
      $(this).attr('disabled', false);
    }
  });
  const validate_reset = validator.useValidator({
    email: [{
      type: 'email',
      required: true,
      message: '邮箱地址不正确'
    }],
    pass: [{
      type: 'string',
      required: true,
      message: '密码不能为空'
    }, {
      min: 6,
      max: 128,
      message: '密码长度必须为(6-128)个字符'
    }, {
      asyncValidator: (rule, value) => {
        return new Promise((resolve, reject) => {
          const p1 = $('#back_password').val();
          const p2 = $('#back_password2').val();
          if ((p1 || p1) && p1 !== p2) {
            reject('2次输入的密码不一致');
          } else {
            resolve();
          }
        });
      }
    }],
    code: {
      asyncValidator: (rule, value) => {
        return new Promise((resolve, reject) => {
          const p1 = $('#back-checkcode').val();
          if (!p1 || p1.length < 6) {
            reject('邮箱验证码为6位');
          } else {
            resolve();
          }
        });
      }
    }
  });

  // 修改密码啊
  $('.btn-back-submit').on('click', async function () {
    const email = $('#back-email').val();
    const pass = $('#back-password').val();
    const code = $('#back-checkcode').val();
    try {
      $(this).attr('disabled', true);
      await validate_reset({
        email,
        pass,
        code
      });
      await http({
        url: '/index/resetPass',
        method: 'post',
        data: {
          email,
          pass,
          code
        },
        _options: {
          showError: true,
          showSuccess: true
        }
      });
      show_modal_type(0);
    } catch (error) {
      $(this).attr('disabled', false);
      console.log('_e: ', error);
    } finally {
      $(this).attr('disabled', false);
    }
  });

  //  搜索
  function search(keyword, page_type) {
    if (!keyword) return;
    const type = $('.search_type').data('type') || 'key_word';
    let url;
    switch (page_type) {
      case 'mv':
        if (type === 'author') {
          url = "all?merchant=".concat(keyword);
        } else {
          url = "mv/all?".concat(type, "=").concat(keyword);
        }
        break;
      case 'video_list':
        url = "video_list.html?".concat(type, "=").concat(keyword);
        break;
      case 'novel_list':
        url = "novel_list.html?".concat(type, "=").concat(keyword);
        break;
      case 'comic_list':
        url = "comic_list.html?".concat(type, "=").concat(keyword);
        break;
      default:
        url = "all?".concat(type, "=").concat(keyword);
    }
    window.location.replace(url);
  }
  $('.search-box').searchBox({
    onKeyDown: function onKeyDown(event) {
      if (event.keyCode === 13) {
        search(event.target.value, event.target.dataset.type);
      }
    }
  });
  $('.btn-search').on('click', function () {
    const search_input = $(this).siblings('.input-control').find('.search-input');
    const val = search_input.val();
    search(val, search_input.data('type'));
  });
  // 显示移动端搜索框
  $('.btn-open-search').on('click', function () {
    $('.mobile-search').toggleClass('is-open-mobile-search');
    $('.app-header').addClass('is-open-mobile-search');
    if ($('.mobile-search').hasClass('is-open-mobile-search')) {
      $('.mobile-search .search-input').focus();
    }
    $(this).parent().hide();
  });

  // 隐藏移动端搜索框
  $('.btn-close-search').on('click', function () {
    $('.mobile-search').toggleClass('is-open-mobile-search');
    $('.app-header').removeClass('is-open-mobile-search');
    $('.btn-open-search').parent().show();
  });

  // 登录、注册弹框
  $('.btn-change-type').on('click', function () {
    const ctx = $(this);
    const index = ctx.data('index');
    ctx.parents('.dx-tabs').find('.dx-tab-content').eq(index).addClass('dx-tab-content--active').siblings().removeClass('dx-tab-content--active');
    ctx.parents('.dx-tabs').find('.dx-tab-item').eq(index).addClass('is-active').siblings().removeClass('is-active');
  });

  // 左侧菜单栏
  $('.btn-menu-collapse').on('click', function () {
    const overlay = $(this).data('overlay');
    const close_class = $(this).data('class');
    $('.dx-drawer').toggleClass('dx-drawer--open');
    if (overlay) {
      $('.dx-overlay').fadeIn().data('close', overlay).data('class', close_class);
    }
    $(this).toggleClass('is-open');
    $(document.documentElement).toggleClass('overflow');
  });
  $('.dx-overlay').on('click', function () {
    const close = $(this).data('close');
    const close_class = $(this).data('class');
    $(this).fadeOut();
    if (close) {
      if (close_class) {
        $(close).removeClass(close_class);
      } else {
        $(close).hide();
      }
    }
  });
  $('.dx-drawer-close').on('click', function () {
    $(this).parents('.dx-drawer').removeClass('dx-drawer--open');
    $('.dx-overlay').fadeOut();
    return false;
  });
  $('.dx-tabs').on('click', '.dx-tab', function () {
    const $this = $(this);
    const index = $this.index();
    const text = $this.text();
    $this.addClass('btn-primary').siblings().removeClass('btn-primary').parents('.dx-tab-list').siblings('.dx-tab-content').removeClass('dx-tab-content--active').eq(index).addClass('dx-tab-content--active');
    $('.rank-title').text(text);
  });

  // 打开回复弹框
  $(document).on('click', '.btn-reply', function () {
    const reply_to = $(this).data('reply');
    const $modal = $('#reply_modal');
    $modal.find('.reply-to').text(reply_to);
    $modal.modal({
      position: 160,
      show: true,
      backdrop: 'static'
    });
    $modal.on('hidden.zui.modal', function () {
      $modal.find('textarea').val('');
      $modal.off('hidden.zui.modal');
    });
  });
  // 打开评论弹框
  $(document).on('click', '.btn-comment', function () {
    const is_login = localStorage.getItem('is_login');
    if (is_login !== '1') {
      show_login('login');
      return;
    }
    const title = $(this).data('title');
    const $modal = $('#comment_modal');
    $modal.find('.title').text(title);
    $modal.data('type', $(this).data('type'));
    $modal.modal({
      position: 160,
      show: true,
      backdrop: 'static'
    });
    $modal.on('hidden.zui.modal', function () {
      $modal.find('textarea').val('');
      $modal.off('hidden.zui.modal');
    });
  });
  const TYPE_MAP = {
    key_word: '智能',
    title: '标题',
    author: '作者'
  };
  const MV_TYPE_MAP = {
    key_word: '智能',
    title: '标题',
    merchant: '片商'
  };
  function set_search_type(type) {
    const search_input = $('.search-box').find('.search-input');
    const page_type = search_input.data('type');
    $('.search_type').data('type', type);
    if (page_type === 'mv') {
      $('.search_type').text(MV_TYPE_MAP[type]);
    } else {
      $('.search_type').text(TYPE_MAP[type]);
    }
  }
  // 顶部搜索类型
  $('.search_type').on('click', function () {
    const type = $(this).data('type');
    const search_input = $('.search-box').find('.search-input');
    const page_type = search_input.data('type');
    let typeList = ['key_word', 'title', 'author'];
    let mvTypeList = ['key_word', 'title', 'merchant'];
    let index = typeList.findIndex(ele => ele === type);
    if (index < 2) {
      index++;
    } else {
      index = 0;
    }
    if (page_type === 'mv') {
      set_search_type(mvTypeList[index]);
    } else {
      set_search_type(typeList[index]);
    }
  });

  // 小说、漫画阅读头部
  $('.btn-open-menu').on('click', function () {
    $(this).toggleClass('is-open');
    $('.dx-menu-container').toggleClass('is-open');
  });
  $('.btn-password-type').on('click', function () {
    $(this).toggleClass('is-open');
    if ($(this).hasClass('is-open')) {
      $(this).siblings('.form-control').attr('type', 'text');
    } else {
      $(this).siblings('.form-control').attr('type', 'password');
    }
  });

  // 邀请码逻辑
  function get_aff_code() {
    const params = new URLSearchParams(window.location.search);
    const aff = params.get('aff');
    if (aff) {
      $('#login_modal').find('.dx-tabs').find('.dx-tab-content').eq(1).addClass('dx-tab-content--active').siblings().removeClass('dx-tab-content--active');
      $('#login_modal').find('.dx-tab-item').eq(1).addClass('is-active').siblings().removeClass('is-active');
      $('#register-aff').val(aff);
      show_login('register');
    }
  }
  get_aff_code();

  // 筛选
  $('.dx-btn-filter').on('click', function () {
    const $this = $(this);
    const category = $this.data('cage') || 'novel';
    $(this).parents('.dx-filter').toggleClass('is-expand');
  });

  // 打开投诉弹框
  $(document).on('click', '.btn-report', function () {
    const title = $(this).data('title');
    const $modal = $('#report_modal');
    $modal.find('.title').text(title);
    $modal.data('type', $(this).data('type'));
    $modal.modal({
      position: 160,
      show: true,
      backdrop: 'static'
    });
    $modal.on('hidden.zui.modal', function () {
      $modal.find('textarea').val('');
      $modal.off('hidden.zui.modal');
    });
  });

  // 投诉
  $('#report_modal .btn-submit-report').on('click', async function () {
    var type = $('input[name="report_item"]:checked').map(function () {
      return this.value;
    }).get().join(',');
    if (!type) {
      return utils.useMessage('请选择举报原因');
    }
    const $modal = $('#report_modal');
    const target_type = $modal.data('type');
    try {
      await http({
        url: '/index/complaint',
        method: 'get',
        data: {
          type,
          target_type,
          target_id: params.get('id'),
          content: $modal.find('.content').val()
        },
        _options: {
          showError: true,
          showSuccess: true
        }
      });
      $modal.find('form').get(0).reset();
      $modal.modal('hide', 'fit');
      return false;
    } catch (error) {}
  });

  // 收藏
  $('.btn-collect').on('click', async function () {
    const type = $(this).data('type');
    try {
      await http({
        url: '/index/collect',
        method: 'get',
        data: {
          type,
          target_id: params.get('id') || params.get('novel_id')
        },
        _options: {
          showError: true,
          showSuccess: true,
          code: $(this).hasClass('text-primary') ? 201 : 200
        }
      });
      $(this).toggleClass('text-primary');
      return false;
    } catch (error) {
      console.log('error: ', error);
    }
  });

  // 收藏
  $('.btn-comment-submit').on('click', async function () {
    const type = $(this).data('type');
    const comment_content = $('#comment_modal textarea').val();
    const comment_score = $('#comment_modal .dx-rate').data('value');
    if (!comment_content) {
      return utils.useMessage('评论内容不能为空');
    }
    try {
      await http({
        url: '/index/addComments',
        method: 'get',
        data: {
          type,
          target_id: params.get('id'),
          comment_content: comment_content,
          comment_score: comment_score * 2,
          be_comment_user_id: 0
        },
        _options: {
          showError: true,
          showSuccess: true,
          code: $(this).hasClass('text-primary') ? 201 : 200
        }
      });
      $(this).toggleClass('text-primary');
      $('#comment_modal form').get(0).reset();
      $('#comment_modal').modal('hide', 'fit');
      return false;
    } catch (error) {
      console.log('error: ', error);
    }
  });
  var documentHeight = $(document).height();
  var windowHeight = $(window).height();
  var scrollTop = $(window).scrollTop();
  var lastScrollTop = 0; // 记录上一次的滚动位置

  function calc_scroll_height_percent() {
    documentHeight = $(document).height();
    windowHeight = $(window).height();
    scrollTop = $(window).scrollTop();

    // 判断滚动方向并直接设置样式
    if (scrollTop > lastScrollTop) {
      console.log('向下滚动');
      $('.dx-backtop .dx-backtop--arrow').css({
        transform: 'translate(-50%, -50%) rotate(180deg)',
        // 直接设置样式
        transition: 'transform 0.3s' // 添加过渡效果
      });
    } else if (scrollTop < lastScrollTop) {
      console.log('向上滚动');
      $('.dx-backtop .dx-backtop--arrow').css({
        transform: 'translate(-50%, -50%) rotate(0deg)',
        // 恢复样式
        transition: 'transform 0.3s' // 添加过渡效果
      });
    }
    lastScrollTop = scrollTop; // 更新上一次的滚动位置

    const percent = scrollTop / (documentHeight - windowHeight);
    $('.dx-backtop .progress-bar').css('stroke-dashoffset', (1 - percent) * 126 + 'px');
  }
  calc_scroll_height_percent();
  $(window).on('scroll', utils.throttle(calc_scroll_height_percent, 50));
  $('.comment-icon-btn').click(function () {
    const is_login = localStorage.getItem('is_login');
    if (is_login !== '1') show_login('login');
  });
  if (utils.isMobile) {
    $('#app-footer').addClass('mb-[50px]');
  }
  $('#tip_modal').on('click', '.btn-download', function (e) {
    const element = document.getElementById('tip_content');
    utils.load_amd_module(['lib/html2canvas'], function (html2canvas) {
      html2canvas(element, {
        ignoreElements: function ignoreElements(element) {
          return element.classList.contains('btn-download');
        }
      }).then(canvas => {
        canvas.toBlob(blob => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = '18mh.net.png';
          link.click();
        });
      });
    });
  });
  $(document).on('click', '.bookmark-delete-btn', function (e) {
    e.stopPropagation();
    const chapter_no = $(this).data('no');
    console.log(chapter_no, 'chapter_no');
    http({
      url: '/novel/userNovelHandleMark',
      method: 'get',
      data: {
        novel_id: params.get('novel_id'),
        chapter_no: chapter_no
      }
    }).then(response => {
      if (response.type == 'delete') {
        utils.useMessage('书签删除成功', 'success');
        $(this).closest('li.volume_box').remove();
      }
    });
  });
  const landing_modal_key = '__landing_modal_at__';
  let _timer;
  let now = utils.getCurrentDate();
  $('#tip_modal').on('hidden.zui.modal', function () {
    // 设置 cookie
    document.cookie = "".concat(landing_modal_key, "=").concat(now, "; path=/;");
    if (_timer) {
      clearTimeout(_timer);
      _timer = null;
    }
  });
  $('#tip_modal').on('click', '.btn-download', function (e) {
    const element = document.getElementById('tip_content');
    utils.load_amd_module(['lib/html2canvas'], function (html2canvas) {
      html2canvas(element, {
        ignoreElements: function ignoreElements(element) {
          return element.classList.contains('btn-download');
        }
      }).then(canvas => {
        canvas.toBlob(blob => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = '91prontv.png';
          link.click();
        });
      });
    });
  });
  // 读取 cookie 的函数
  function getCookie(name) {
    const value = "; ".concat(document.cookie);
    const parts = value.split("; ".concat(name, "="));
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  function show_landing_modal() {
    const $time = $('#tip_modal .time');
    let duration = Number($time.text());
    const cache_date = getCookie(landing_modal_key);
    if (duration > 0 && (!cache_date || cache_date !== now)) {
      $('#tip_modal').modal({
        position: 'center',
        show: true,
        backdrop: 'static'
      });
      function _tick() {
        if (duration === 0) {
          $('#tip_modal').modal('hide');
          clearTimeout(_timer);
          _timer = null;
          return;
        }
        _timer = setTimeout(() => {
          $time.text(--duration);
          _tick();
        }, 1000);
      }
      _tick();
    }
  }
  let index = 0;
  const $ads = $('.ad-dialog');
  const adCount = $ads.length;
  const adKey = '_show_ad_dialog_';
  function showAdDialog() {
    const currentDialog = $ads.eq(index);
    if (currentDialog.length) {
      currentDialog.modal({
        position: 'center',
        show: true,
        backdrop: 'static'
      });
      function hidden() {
        index++;
        currentDialog.off('hidden.zui.modal', hidden);
        if (index < adCount) {
          showAdDialog();
        } else {
          sessionStorage.setItem(adKey, '1');
          show_landing_modal();
        }
      }
      currentDialog.on('hidden.zui.modal', hidden);
    }
  }
  if (!sessionStorage.getItem(adKey)) {
    showAdDialog();
  } else {
    show_landing_modal();
  }
  const copyText = function () {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      // 现代浏览器，使用 Clipboard API
      return function (text) {
        let autoToast = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        return navigator.clipboard.writeText(text).then(() => {
          if (autoToast) {
            new $.zui.Messager('复制成功', {
              time: 3000,
              type: 'success',
              close: false
            }).show();
          }
        });
      };
    } else {
      // fallback 写法，适配旧浏览器
      return function (text) {
        let autoToast = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed'; // 避免页面滚动影响
        textarea.style.opacity = '0'; // 避免视觉干扰
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
          const success = document.execCommand('copy');
          if (autoToast) {
            new $.zui.Messager('复制成功', {
              time: 3000,
              type: 'success',
              close: false
            }).show();
          }
          return Promise.resolve(success);
        } catch (err) {
          console.error('Fallback copy failed:', err);
          return Promise.reject(err);
        } finally {
          document.body.removeChild(textarea);
        }
      };
    }
  }();
  $(document).on('click', '.btn-sign-item', function () {
    console.log(111);
    const dataset = $(this).data();
    const url = dataset.url;
    const group = dataset.group;
    const status = dataset.status; // todo 按钮上绑定 data-status 数据 对应的签到状态
    switch (group) {
      case 1:
        if (status === 1) {
          return;
        }
        http({
          url: '/api.php/api/user/single',
          data: {
            //token
          },
          crypto: true
        }).then(() => {
          // todo 刷新数据
        });
        break;
      case 2:
        if (url) copyText(url);
        break;
      case 3:
        if (url) {
          window.location.href = url;
        }
        break;
      default:
        break;
    }
  });
});