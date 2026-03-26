"use strict";

requirejs.config({
  urlArgs: "v=".concat(js_assets_version),
  // 资源版本号
  baseUrl: '/static/frontend/js',
  paths: {
    jquery: 'lib/jquery',
    zui: 'lib/zui'
  },
  shim: {
    zui: ['jquery']
  }
});
requirejs(['jquery', 'plugins/lazyload', 'validate', 'utils', 'http', 'lib/cropper', 'common'], function ($, lazyload, validator, utils, http, Cropper) {
  var cropper = null;
  const validate = validator.useValidator({
    original: [{
      required: true,
      message: '原始密码不能为空'
    }, {
      min: 6,
      max: 128,
      message: '密码长度必须为(8-128)个字符'
    }],
    new_password: [{
      min: 6,
      max: 128,
      message: '密码长度必须为(8-128)个字符'
    }, {
      asyncValidator: (rule, value) => {
        return new Promise((resolve, reject) => {
          const p1 = $('#new_password').val();
          const p2 = $('#confirm_password').val();
          if ((p1 || p1) && p1 !== p2) {
            reject('2次输入的密码不一致');
          } else {
            resolve();
          }
        });
      }
    }]
  });
  const TITLE_MAP = {
    name: '修改昵称',
    gender: '修改性别',
    password: '修改密码',
    avatar: '修改头像'
  };
  const API_MAP = {
    name: {
      url: '/index/resetMemberInfo'
    }
  };
  const MESSAGE_TYPE = {
    name: '昵称不能为空'
  };
  $('.btn-open').on('click', function () {
    const type = $(this).data('type');
    const $modal = $('#common_modal');
    $modal.data('type', type);
    if (type === 'avatar') {
      $('#avatarReader').click();
      return false;
    }
    $modal.find('.title').text(TITLE_MAP[type]);
    $modal.find(".".concat(type)).show().siblings('div').hide();
    if (type === 'gender') {
      const _gender = $('.user_gender').data('gender');
      $("input[name=\"gender\"][value=\"".concat(_gender, "\"]")).prop('checked', true);
    }
    $modal.modal({
      position: 160,
      show: true,
      backdrop: 'static'
    });
  });
  $('.btn-update').on('click', async function () {
    const $modal = $('#common_modal');
    const type = $modal.data('type');
    console.log('type: ', type);
    let url = API_MAP[type] && API_MAP[type].url || '/index/resetMemberInfo';
    let data = {};
    let clear = [];
    if (type === 'name') {
      const input = $('#common_modal .name .form-control');
      const name = input.val();
      clear.push(input);
      if (!name) {
        return utils.useMessage(MESSAGE_TYPE[type]);
      } else {
        data.value = name;
        data.type = 'nick_name';
      }
    }
    if (type === 'gender') {
      var gender = $('input[name="gender"]:checked').val();
      data.value = gender;
      data.type = 'gender';
    }
    if (type === 'password') {
      const original = $('#original').val();
      const new_password = $('#new_password').val();
      const confirm_password = $('#confirm_password').val();
      try {
        await validate({
          original,
          new_password,
          confirm_password
        });
      } catch (error) {
        return;
      }
      data.type = 'pass';
      data.value = original;
      data.new_pass = new_password;
    }
    if (type === 'avatar') {
      cropper.getCroppedCanvas().toBlob(async blob => {
        $(this).attr('disabled', true).text('上传中');
        try {
          const formData = new FormData();
          formData.append('type', 'avatar');
          formData.append('value', blob);
          let res = await http({
            url,
            data: formData,
            contentType: false,
            processData: false,
            _options: {
              showError: true
            }
          });
          $('.user_avatar').attr('src', URL.createObjectURL(blob));
          utils.useMessage('上传成功', 'success');
          $('#common_modal .modal-dialog .close').click();
        } catch (e) {} finally {
          $(this).attr('disabled', false).text('保存');
        }
      });
      return;
    }
    try {
      $(this).attr('disabled', true);
      await http({
        url,
        data,
        _options: {
          showError: true
        }
      });
      clear.forEach(_input => {
        _input.val('');
      });
      utils.useMessage('更改成功', 'success');
      $modal.modal('hide', 'fit');
      init();
    } catch (error) {
      console.log('error: ', error);
    } finally {
      $(this).attr('disabled', false);
    }
  });

  // 上传头像
  $('#avatarReader').on('change', function (e) {
    // 上传 头像文件
    var file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const $modal = $('#common_modal');
      $('#cropper_image').attr('src', url);
      $modal.find('.avatar').show().siblings('div').hide();
      $modal.modal({
        position: 160,
        show: true,
        backdrop: 'static'
      });
      cropper = new Cropper($('#cropper_image').get(0), {
        aspectRatio: 1 / 1,
        scalable: false,
        zoomable: false,
        minContainerWidth: 300,
        minContainerHeight: 300,
        minCanvasWidth: 300,
        minCanvasHeight: 300,
        viewMode: 1,
        responsive: true,
        autoCropArea: 1
      });
    }
  });
  $('#common_modal').on('hidden.zui.modal', function () {
    $('#avatarReader').get(0).value = '';
    if (cropper) {
      cropper.destroy();
      cropper = null;
    }
    $('#cropper_image').attr('src', '');
  });
  function init() {
    utils.get_user_info().then(res => {
      console.log('res: ', res);
      $('.user_id').text(res.id);
      $('.user_avatar').attr('data-src', res.avatar_str);
      $('.user_name').text(res.nick_name);
      $('.user_email').text(res.email);
      $('.user_reg_time').text(res.reg_time.split(' ')[0]);
      $('.user_group').text(res.group);
      $('.user_coin').text(res.money);
      $('.user_gender').text(res.gender === 1 ? '男' : '女').data('gender', res.gender);
      lazyload.load_image();
    });
  }
  init();
});