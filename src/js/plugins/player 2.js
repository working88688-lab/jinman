define(['plugins/lazyload', 'utils', 'plugins/xgplayer-common-plugin', 'xgplayer'], function (lazyload, utils, common_plugins) {
  const { Plugin, Util, Events, BasePlugin } = window.Player
  const { POSITIONS } = Plugin

   const external_at = '__player_external_at__'
  // 最后预览时间插件
  class LastPlayTime extends Plugin {
    static get pluginName() {
      return 'last_play_time'
    }

    static get defaultConfig() {
      return {
        position: POSITIONS.ROOT,
        time: '00:00'
      }
    }

    get cache_key() {
      const { config } = this
      const { key } = config

      return key ? `_video_last_view_id_${key}` : ''
    }

    get last_real_time() {
      const { config, cache_key } = this
      const { key } = config
      if (key) {
        const cache_time = localStorage.getItem(cache_key)
        return Number(cache_time || 0)
      }
      return 0
    }

    get last_time() {
      const { last_real_time } = this
      return last_real_time ? Util.format(last_real_time) : undefined
    }

    afterCreate() {
      const { config, player, last_time, cache_key, last_real_time } = this

      if (!config.key) {
        return
      }
      this.on(Events.TIME_UPDATE, e => {
        const { currentTime } = e

        if (currentTime > 0) {
          localStorage.setItem(cache_key, currentTime)
        }
      })

      if (!last_time) {
        return
      }

      this.time_update_handler = e => {
        const { currentTime } = e
        if (currentTime > 0) {
          // 如果时间超过最后一次播放时间，并且当前浏览时间显示，则隐藏
          if (currentTime >= last_real_time && !this.root.classList.contains('hidden')) {
            this.root.classList.add('hidden')

            this.unbind_events()
          }
        }
      }
      this.hide_handler = () => {
        if (!player.paused) {
          this.root.classList.add('hidden')

          this.unbind_events()
        }
      }

      this.unbind_events = () => {
        this.off(Events.PLAYER_BLUR, this.hide_handler)
        this.off(Events.TIME_UPDATE, this.time_update_handler)
        this.unbind('.dx-last-play-close-icon', 'click', this.close_handler)
        this.unbind('.dx-last-jump', 'click', this.jump_handler)
      }
      this.on(Events.PLAYER_BLUR, this.hide_handler)

      this.on(Events.TIME_UPDATE, this.time_update_handler)

      this.close_handler = () => {
        this.root.classList.add('hidden')
        this.unbind_events()
      }

      this.jump_handler = () => {
        player.play()
        player.seek(last_real_time)
      }

      this.bind('.dx-last-play-close-icon', 'click', this.close_handler)
      this.bind('.dx-last-jump', 'click', this.jump_handler)
    }

    destroy() {
      this.unbind_events()
    }

    render() {
      const { config, last_time } = this
      if (!config.key || !last_time) {
        return
      }

      return `
      <div class="dx-last-play-time">
        <div class="dx-last-play-close-icon">
           <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z" fill="currentColor"></path></svg>
        </div>
        <div class="dx-last-time">上次看到 ${last_time}</div>
        <div class="dx-last-jump">跳转播放</div>
      </div>
    `
    }
  }

  // 广告插件
  class AdPlugin extends Plugin {
    static get pluginName() {
      return 'advertise'
    }

    static get defaultConfig() {
      return {
        position: POSITIONS.ROOT,
        play_duration: 5, // 广告必看时长
        duration: 0, // 广告播放时长
        disabled: false,
        title: '查看详情' //广告链接标题
      }
    }
    cutDown() {
      const { config } = this
      let start = config.play_duration
      const el_time = this.find('.ad-time')
      const _run = () => {
        el_time.innerText = start
        start--
        if (start === -1) {
          clearTimeout(this._timer)
          this._timer = null
          this.can_skip_ad = true
          this.root.classList.add('can-skip-ad')
          return
        }
        this._timer = setTimeout(() => {
          _run()
        }, 1000)
      }
      _run()
    }

    duration_cut_down() {
      const { config } = this
      let start = config.duration
      const el_duration = this.find('.ad-duration')
      const _run = () => {
        el_duration.innerText = start
        start--
        if (start === -1) {
          clearTimeout(this._timer)
          this._duration_timer = null
          this._stop()
          return
        }
        this._duration_timer = setTimeout(() => {
          _run()
        }, 1000)
      }
      _run()
    }

    afterCreate() {
      const { config, player, playerConfig } = this
      if (config.disabled || !playerConfig.advertise) {
        return
      }

      this._stop = (autoplay = true) => {
        if (this._timer) {
          clearTimeout(this._timer)
          this._timer = null
        }
        if (this._duration_timer) {
          clearTimeout(this._duration_timer)
          this._duration_timer = null
        }
        const _stop = () => {
          if (this.ad_video) {
            this.ad_video.pause()
          }
          this.parent.classList.remove('is-playing-advertise')
          this.root.classList.remove('is-playing')
          player.unRegisterPlugin('advertise')
          const play_plugin = player.getPlugin('play')
          play_plugin.animate(player.paused)
        }
        _stop()
        if (autoplay) {
          player.play().catch(() => {})
        }
      }

      this.enter_fullscreen_handler = e => {
        player.getFullscreen()
        e.stopPropagation()
      }
      this.exist_fullscreen_handler = e => {
        player.exitFullscreen()
        e.stopPropagation()
      }
      this.volume_change = () => {
        this.ad_video.muted = !this.ad_video.muted
        this.root.classList.toggle('is-muted')
      }

      this.skip_handler = () => {
        if (this.can_skip_ad) {
          this._stop()
        }
      }

      this.play_handler = () => {
        this.init_ad()
      }

      this.ad_handler = () => {
        player.emit('ad-click')
      }

      if (config.video) {
        this.volume = this.find('.ad-volume')
        this.volume.addEventListener('click', this.volume_change)
        this.ad_video = this.find('.ad-video')
        this.ad_video.addEventListener('timeupdate', this.play_handler, { once: true })
      }

      if (config.url) {
        this.external = this.find('.ad-external')
        this.external.addEventListener('click', this.ad_handler)
        if (config.video) {
          this.video_external = this.find('.ad-video-external')
          this.video_external.addEventListener('click', this.ad_handler)
        }
      }

      if (config.play_duration) {
        this.btn_skip = this.find('.ad-skip')
        this.btn_skip.addEventListener('click', this.skip_handler)
      }
      this.fullscreen_on = this.find('.ad-fullscreen-on')
      this.fullscreen_off = this.find('.ad-fullscreen-off')

      this.fullscreen_on.addEventListener('click', this.enter_fullscreen_handler)
      this.fullscreen_off.addEventListener('click', this.exist_fullscreen_handler)
    }

    destroy() {
      const { config } = this

      if (config.video) {
        this.volume.removeEventListener('click', this.volume_change)
        this.hls && this.hls.destroy()
      }

      if (config.url) {
        if (config.video) {

          this.video_external.removeEventListener('click', this.ad_handler)
        }
        this.external.removeEventListener('click', this.ad_handler)
      }

      if (config.play_duration) {
        this.btn_skip.removeEventListener('click', this.skip_handler)
      }
      this.fullscreen_on.removeEventListener('click', this.enter_fullscreen_handler)
      this.fullscreen_off.removeEventListener('click', this.exist_fullscreen_handler)
    }

    beforePlayerInit() {
      const { playerConfig, config } = this
      if (config.disabled || !playerConfig.advertise) {
        return
      }

      if (config.video) {
        return this.register()
      }

      if (config.gif) {
        lazyload.load_image()
        return this.init_ad()
      }
    }
    register() {
      const { config } = this
      if (config.video.indexOf('.m3u8') !== -1) {
        if (this.hls) {
          this.hls.destroy()
        }
        this.hls = new Hls()
        this.hls.loadSource(config.video)
        this.hls.once(Hls.Events.MEDIA_ATTACHED, e => {
          this.play_ad()
        })

        this.hls.attachMedia(this.ad_video)
      } else {
        this.ad_video.src = config.video

        this.play_ad()
      }
    }

    init_ad() {
      const { config } = this
      if (config.play_duration) {
        this.cutDown()
      }
      if (config.duration) {
        this.duration_cut_down()
      }
      this.parent.classList.add('is-playing-advertise')
    }
    play_ad() {
      this.ad_video.muted = true
      this.ad_video.play().catch(() => {
        this._stop(false)
      })
    }

    render() {
      const { playerConfig, config } = this
      if (config.disabled || !playerConfig.advertise) {
        return
      }

      const render_video = () => {
        return `
          ${
            config.url
              ? `<a href="${config.url}" class="ad-video-external" target="__blank">
            <video autoplay muted playinline class="ad-video" autoplay="true" muted="true"></video>
          </a>`
              : '<video  class="ad-video" playinline autoplay muted autoplay="true" muted="true"></video>'
          }
        `
      }

      const render_gif = () => {
        return `<a href="${config.url}" class="ad-video-external" target="__blank"><img data-cache="1" data-src="${config.gif}" alt="" /></a>`
      }
      return `
      <div class="dx-ad-plugin is-playing is-muted" style="color: #fff">
        <div class="dx-ad-container">
          ${config.video ? render_video() : config.gif ? render_gif() : ''}
          
          <div class="ad-timer">
          ${
            config.play_duration
              ? ` <div class="dx-ad-mask ad-skip">
              <span class="ad-time">${config.play_duration}</span><span class="ad-skip-text">秒后可</span>关闭广告
            </div>`
              : ''
          }
           
            ${config.duration ? `<div class="ad-duration-container dx-ad-mask"><span class="ad-duration">${config.duration}</span>秒</div>` : ''}
            
          </div>
          <div class="ad-control">
            ${
              config.url
                ? ` <div class="dx-ad-mask ad-external">
              <a href="${config.url}" target="__blank">${config.title}</a>
            </div>`
                : ''
            }
            ${
              config.video
                ? ` <div class="dx-ad-mask ad-volume">
              <i class="ad-muted-on"><svg xmlns="http://www.w3.org/2000/svg" height="22" width="22" viewBox="0 0 22 22">
    <path fill="#ffffff" d="M10.188 4.65L6 8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1l4.188 3.35a.5.5 0 0 0 .812-.39V5.04a.498.498 0 0 0-.812-.39zM14.446 3.778a1 1 0 0 0-.862 1.804 6.002 6.002 0 0 1-.007 10.838 1 1 0 0 0 .86 1.806A8.001 8.001 0 0 0 19 11a8.001 8.001 0 0 0-4.554-7.222z"></path>
    <path fill="#ffffff" d="M15 11a3.998 3.998 0 0 0-2-3.465v6.93A3.998 3.998 0 0 0 15 11z"></path>
</svg></i>
          <i class="ad-muted-off"><svg fill="#ffffff" xmlns="http://www.w3.org/2000/svg" height="22" width="22" viewBox="0 0 22 22">
    <path d="M15 11a3.998 3.998 0 0 0-2-3.465v2.636l1.865 1.865A4.02 4.02 0 0 0 15 11z"></path>
    <path d="M13.583 5.583A5.998 5.998 0 0 1 17 11a6 6 0 0 1-.585 2.587l1.477 1.477a8.001 8.001 0 0 0-3.446-11.286 1 1 0 0 0-.863 1.805zM18.778 18.778l-2.121-2.121-1.414-1.414-1.415-1.415L13 13l-2-2-3.889-3.889-3.889-3.889a.999.999 0 1 0-1.414 1.414L5.172 8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1l4.188 3.35a.5.5 0 0 0 .812-.39v-3.131l2.587 2.587-.01.005a1 1 0 0 0 .86 1.806c.215-.102.424-.214.627-.333l2.3 2.3a1.001 1.001 0 0 0 1.414-1.416zM11 5.04a.5.5 0 0 0-.813-.39L8.682 5.854 11 8.172V5.04z"></path>
</svg></i>
            </div>`
                : ''
            }
           
            <div class="dx-ad-mask ad-fullscreen">
              <i class="ad-fullscreen-on"><svg class="icon" width="22" height="22" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
<path fill="#ffffff" d="M625.777778 256h142.222222V398.222222h113.777778V142.222222H625.777778v113.777778zM256 398.222222V256H398.222222v-113.777778H142.222222V398.222222h113.777778zM768 625.777778v142.222222H625.777778v113.777778h256V625.777778h-113.777778zM398.222222 768H256V625.777778h-113.777778v256H398.222222v-113.777778z"></path>
</svg></i>
          <i class="ad-fullscreen-off">
            <svg class="icon" width="22" height="22" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
<path fill="#ffffff" d="M768 298.666667h170.666667v85.333333h-256V128h85.333333v170.666667zM341.333333 384H85.333333V298.666667h170.666667V128h85.333333v256z m426.666667 341.333333v170.666667h-85.333333v-256h256v85.333333h-170.666667zM341.333333 640v256H256v-170.666667H85.333333v-85.333333h256z"></path>
</svg>
          </i>
            </div>
          </div>
        </div>
        ${
          config.video
            ? ` <xg-loading class="xgplayer-loading">
          <xg-loading-inner><div class="xgplayer-enter-spinner"><div class="xgplayer-enter-bar1"></div><div class="xgplayer-enter-bar2"></div><div class="xgplayer-enter-bar3"></div><div class="xgplayer-enter-bar4"></div><div class="xgplayer-enter-bar5"></div><div class="xgplayer-enter-bar6"></div><div class="xgplayer-enter-bar7"></div><div class="xgplayer-enter-bar8"></div><div class="xgplayer-enter-bar9"></div><div class="xgplayer-enter-bar10"></div><div class="xgplayer-enter-bar11"></div><div class="xgplayer-enter-bar12"></div></div></xg-loading-inner>
        </xg-loading>`
            : ''
        }
       
      </div>
    `
    }
  }

  class ExternalPlugin extends Plugin {
    static get pluginName() {
      return 'external'
    }

    static get defaultConfig() {
      return {
        position: "ROOT",
        disabled: false
      }
    }
   
    afterCreate() {
      const { player, playerConfig, disabled } = this
      const { external } = playerConfig
      if (!external || !external.href || disabled) {
        return
      }
      const ad_root = this.root
      Object.keys(external).forEach(key => {
        ad_root.setAttribute(key, external[key])
      })
      const { root } = player

      this.clickEvent = e => {
        player.play()
        player.unRegisterPlugin('external');
      }

      root.addEventListener('click', this.clickEvent, { once: true })
    }

 

    render() {
      const { playerConfig } = this

      const { external } = playerConfig
      if (!external || !external.href) {
        return
      }

      let now = utils.getCurrentDate()
      const cache_date = localStorage.getItem(external_at)
      if (cache_date === now) {
        this.disabled = true
        return
      } else {
        localStorage.setItem(external_at, now)
      }
      return `
      <a class="dx-ad-plugin" target="__blank" style="display: block;z-index: 20; background: none">
      </a>
    `
    }
  }

  const [HlsJsPlugin, ...rest_plugins] = common_plugins
  async function create_player(config = {}) {
    let player
    if (!config) {
      config = {}
      console.warn('请参入配置')
    }
    const {  ...restConfig } = config
    const plugins = rest_plugins
    const base_config = {
      isMobileSimulateMode: utils.isPc ? 'pc' : 'mobile',
      lang: 'zh',
      height: '100%',
      width: '100%',
      miniprogress: true,
      cssFullscreen: false,
      autoplay: true,
      muted: true,
      playsinline: true,
      autoplayMuted: true,
      mini_progress: true,
      inactive: 5000,
      poster: {
        poster: '/static/frontend/images/poster_loading.png',
        hideCanplay: true
      },
      controls: {
        initShow: true,
        mode: 'normal'
      },
      icons: {
        loadingIcon: `<div class="tiktok-player-loading"><div class="tiktok-player-loading-icon"></div></div>`
      },
      pipe: {
        showIcon: true
      },
      enter: {
        innerHtml: '<div class="tiktok-player-enter-icon"></div>'
      },
      volume: 1,
      plugins: [...plugins, LastPlayTime, AdPlugin, ExternalPlugin]
    }

    if (document.createElement('video').canPlayType('application/vnd.apple.mpegurl')) {
      // 原生支持 hls 播放
      player = new Player({
        ...base_config,
        ...restConfig
      })
    } else if (HlsJsPlugin.isSupported()) {
      // 第一步
      base_config.plugins.push(HlsJsPlugin),
        (player = new Player({
          ...base_config,
          ...config
        }))
    }
    if (config.poster) {
      lazyload
        .decrypto_image(config.poster)
        .then(_url => {
          player.poster = _url
        })
        .catch(() => {})
    }
    setTimeout(() => {
      if (config.track) {
        const track = document.createElement('track')
        track.kind = 'subtitles'
        track.label = config.track.label
        track.srclang = config.track.language
        track.src = config.track.url
        track.default = true
        player.media.append(track)
      }
    }, 0)
    player.usePluginHooks('error', 'showError', (plugin, info) => {
      var _info$networkDetails
      if (
        (info === null ||
        info === void 0 ||
        (_info$networkDetails = info.networkDetails) === null ||
        _info$networkDetails === void 0
          ? void 0
          : _info$networkDetails.status) === 403
      ) {
        plugin.config.type = 403
        player.i18n.MEDIA_ERR_SRC_NOT_SUPPORTED = '资源加载失败，评论区留言您所在地区，等待管理员处理'
      } else {
        player.i18n.MEDIA_ERR_SRC_NOT_SUPPORTED = '资源加载失败，评论区留言您所在地区，等待管理员处理'
        Reflect.deleteProperty(plugin.config, 'type')
      }
    })
    player.usePluginHooks('error', 'errorRetry', (plugin, info) => {
      var _plugin$config
      if (
        ((_plugin$config = plugin.config) === null || _plugin$config === void 0 ? void 0 : _plugin$config.type) === 403
      ) {
        window.location.reload()
        return false
      } else {
        return true
      }
    })
    return player
  }

  return {
    create_player
  }
})
