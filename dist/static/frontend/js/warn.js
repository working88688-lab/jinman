"use strict";

define(['jquery'], function () {
  $(document).ready(function () {
    function setCookie(name, value) {
      let days = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 30;
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // 30天
      const expires = "expires=" + date.toUTCString();
      document.cookie = "".concat(name, "=").concat(encodeURIComponent(value), "; ").concat(expires, "; path=/");
    }
    function getCookie(name) {
      const cname = name + "=";
      const decodedCookie = decodeURIComponent(document.cookie);
      const ca = decodedCookie.split(';');
      for (let c of ca) {
        c = c.trim();
        if (c.indexOf(cname) === 0) {
          return c.substring(cname.length, c.length);
        }
      }
      return null;
    }
    const WARN_AT = 'WARN_AT';
    const i18n = {
      Chinese: {
        title: "这是个成人网站",
        content: '本网站包含有年龄限制的内容，包括裸体和露骨色情素材的内容。点击继续即表示您确认您已年满 18 岁，或在您访问本网站时所在的司法管辖区已是成年人',
        confirm: '我已年满18岁-进入',
        cancel: '我未满18岁-退出'
      },
      English: {
        title: "This is an adult website",
        content: 'This website contains age-restricted materials including nudity and explicit depictions of sexual activity. By entering, you affirm that you are at least 18 years of age or the age of majority in the jurisdiction you are accessing the website from and you consent to viewing sexually explicit content.',
        confirm: '18 or older - Enter',
        cancel: 'under 18 - Exit'
      }
    };
    if (!getCookie(WARN_AT)) {
      $('body').append("<div id=\"age-warning\">\n        <div class=\"warning-container\">\n          <div class=\"warning-flex-box\"><img class=\"lang-icon\" src=\"/static/frontend/images/lang.png\" alt=\"\">\n            <select id=\"lang\">\n              <option value=\"Chinese\">Chinese</option>\n              <option value=\"English\">English</option>\n            </select>\n          </div>\n          <div class=\"content-container\"><img class=\"warn-logo\" src=\"/static/frontend/images/warningLogo.png\" alt=\"\">\n            <p class=\"warn-title\">\u8FD9\u662F\u4E2A\u6210\u4EBA\u7F51\u7AD9</p>\n            <p class=\"warn-content\">\u672C\u7F51\u7AD9\u5305\u542B\u6709\u5E74\u9F84\u9650\u5236\u7684\u5185\u5BB9\uFF0C\u5305\u62EC\u88F8\u4F53\u548C\u9732\u9AA8\u8272\u60C5\u7D20\u6750\u7684\u5185\u5BB9\u3002 \u70B9\u51FB\u7EE7\u7EED\u5373\u8868\u793A\u60A8\u786E\u8BA4\u60A8\u5DF2\u5E74\u6EE1 18 \u5C81\uFF0C\u6216\u5728\u60A8\u8BBF\u95EE\u672C\u7F51\u7AD9\u65F6\u6240\u5728\u7684\u53F8\u6CD5\u7BA1\u8F96\u533A\u5DF2\u662F\u6210\u5E74\u4EBA</p>\n            <div class=\"warn-btn-group\"> \n              <button class=\"btn-age-confirm btn-item\">\u6211\u5DF2\u5E74\u6EE118\u5C81-\u8FDB\u5165</button>\n              <button class=\"btn-age-cancel btn-item\">\u6211\u672A\u6EE118\u5C81-\u9000\u51FA</button>\n            </div>\n          </div>\n        </div>\n      </div>");
      $('body').css({
        'overflow': 'hidden',
        height: '100vh'
      });
      $('#lang').on('change', function () {
        const lang = $(this).val();
        $('.warn-title').text(i18n[lang].title);
        $('.warn-content').text(i18n[lang].content);
        $('.btn-age-confirm').text(i18n[lang].confirm);
        $('.btn-age-cancel').text(i18n[lang].cancel);
      });
      $('.btn-age-confirm').on('click', function () {
        setCookie(WARN_AT, 1);
        $("#age-warning").css({
          display: 'none'
        });
        $('body').css({
          'overflow': 'auto',
          height: 'unset'
        });
      });
      $('.btn-age-cancel').on('click', function () {
        history.back();
      });
    }
  });
});