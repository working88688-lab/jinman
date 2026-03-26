"use strict";

define(['jquery', 'utils'], function ($, utils) {
  let timer;
  const map = new WeakMap();
  function loadHlsJs() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/js/lib/hls.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load hls.js'));
      document.head.appendChild(script);
    });
  }
  function create_simple_player($el, videoSrc, callback) {
    const video = document.createElement('video');
    video.controls = false;
    video.muted = true;
    video.autoplay = true;
    $el.append(video);
    let hls;
    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoSrc;
    } else {
      console.warn('浏览器不支持mse, 也不支持原生播放hls');
    }
    video.addEventListener('touchstart', event => {
      event.stopPropagation();
      event.preventDefault();
    });
    video.addEventListener('timeupdate', function (e) {
      callback && callback();
    }, {
      once: true
    });
    function destroy() {
      video.src = '';
      $el.empty();
      if (hls) {
        hls.destroy();
      }
    }
    map.set($el.get(0), {
      destroy
    });
  }
  function create_mp4_player($el, videoSrc, callback) {
    const video = document.createElement('video');
    video.controls = false;
    video.muted = true;
    video.autoplay = true;
    video.src = videoSrc;
    $el.append(video);
    video.addEventListener('touchstart', event => {
      event.stopPropagation();
      event.preventDefault();
    });
    video.addEventListener('timeupdate', function (e) {
      callback && callback();
    }, {
      once: true
    });
    function destroy() {
      video.src = '';
      $el.empty();
    }
    map.set($el.get(0), {
      destroy
    });
  }
  function preview(el, url, callback) {
    if (url.includes('.m3u8')) {
      utils.load_amd_module('/js/lib/hls.js', () => {
        create_simple_player(el, url, callback);
      });
    }
    if (url.includes('.mp4')) {
      create_mp4_player(el, url, callback);
    }
  }
  if (!utils.isMobile) {
    $(document).on('mouseenter', '.video-items .poster', function () {
      timer = setTimeout(() => {
        preview($(this).find('.video-preview'), $(this).data('url'), () => {
          $(this).removeClass('preloading');
        });
      }, 500);
      $(this).addClass('preloading');
    }).on('mouseleave', '.video-items .poster', function () {
      const dom = $(this).find('.video-preview').get(0);
      const instance = map.get(dom);
      if (instance) {
        instance.destroy();
        map.delete(dom);
      }
      $(this).removeClass('preloading');
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    });
  }
});