"use strict";

requirejs.config({
  urlArgs: "v=".concat(js_assets_version),
  // 资源版本号
  baseUrl: '/static/frontend/js',
  paths: {
    jquery: 'lib/jquery',
    zui: 'lib/zui',
    lazyload: 'plugins/lazyload',
    cryptojs: 'lib/crypto'
  },
  shim: {
    zui: ['jquery']
  }
});
requirejs(['jquery', 'http', 'validate', 'common'], function ($, http, validator) {
  var media = '';
  $('#upload').on('change', function (e) {
    const file = e.target.files[0];
    if (file) {
      const file_reader = new FileReader();
      file_reader.onload = async function (e) {
        media = e.target.result;
        $('.img-preview img').attr('src', media).show();
        $('.img-preview svg').hide();
      };
      file_reader.readAsDataURL(file);
    }
  });
  const validate = validator.useValidator({
    email: [{
      type: 'email',
      required: true,
      message: '请填写正确的邮箱地址'
    }],
    question: [{
      type: 'string',
      required: true,
      message: '请填写问题描述'
    }],
    media: [{
      type: 'string',
      required: true,
      message: '请上传附件'
    }]
  });
  $('#form').on('submit', async function (event) {
    event.preventDefault();
    // var formData = new FormData(this)

    try {
      const email = $('#email').val();
      const question = $('#question').val();
      $('#btn_submit').attr('disabled', true);
      await validate({
        email: email,
        question: question,
        media: media
      });
      const formData = new FormData();
      formData.append('email', email);
      formData.append('question', question);
      formData.append('media', media);
      await http({
        data: formData,
        url: '/index/submitContact',
        contentType: false,
        processData: false,
        _options: {
          showSuccess: true
        }
      });
      $(this).get(0).reset();
      $('#upload').get(0).value = '';
      $('.img-preview img').attr('src', '').hide();
      media = '';
      $('.img-preview svg').show();
    } catch (error) {} finally {
      $('#btn_submit').attr('disabled', false);
    }
  });
});