
define(['jquery'], function() {
  $(document).ready(function () {
    function setCookie(name, value, days = 30) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // 30天
      const expires = "expires=" + date.toUTCString();
      document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/`;
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
    const WARN_AT = 'WARN_AT'
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
    }
    if (!getCookie(WARN_AT)) {
      $('body').append(`<div id="age-warning">
        <div class="warning-container">
          <div class="warning-flex-box"><img class="lang-icon" src="/static/frontend/images/lang.png" alt="">
            <select id="lang">
              <option value="Chinese">Chinese</option>
              <option value="English">English</option>
            </select>
          </div>
          <div class="content-container"><img class="warn-logo" src="/static/frontend/images/warningLogo.png" alt="">
            <p class="warn-title">这是个成人网站</p>
            <p class="warn-content">本网站包含有年龄限制的内容，包括裸体和露骨色情素材的内容。 点击继续即表示您确认您已年满 18 岁，或在您访问本网站时所在的司法管辖区已是成年人</p>
            <div class="warn-btn-group"> 
              <button class="btn-age-confirm btn-item">我已年满18岁-进入</button>
              <button class="btn-age-cancel btn-item">我未满18岁-退出</button>
            </div>
          </div>
        </div>
      </div>`)
  
      $('body').css({
        'overflow': 'hidden',
        height: '100vh'
      })
  
      $('#lang').on('change', function () {
        const lang = $(this).val()
        $('.warn-title').text(i18n[lang].title)
        $('.warn-content').text(i18n[lang].content)
        $('.btn-age-confirm').text(i18n[lang].confirm)
        $('.btn-age-cancel').text(i18n[lang].cancel)
      })
  
      $('.btn-age-confirm').on('click', function () {
        setCookie(WARN_AT, 1)
        $("#age-warning").css({
          display: 'none'
        })
        $('body').css({
          'overflow': 'auto',
          height: 'unset'
        })
      })
      $('.btn-age-cancel').on('click', function () {
        history.back()
      })
    }
  
  });
})
