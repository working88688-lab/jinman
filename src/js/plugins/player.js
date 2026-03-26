define(['plugins/lazyload', 'xgplayer', 'hlsPlugin'], function (lazyload) {
  const { Plugin } = window.Player

  // 广告插件
  class AdPlugin extends Plugin {
    static get pluginName() {
      return 'advertise'
    }

    static get defaultConfig() {
      return {
        decrypt: true,
        time: 5000 // 广告播放时长，单位毫秒
      }
    }
    cutDown() {
      const { config } = this
      let start = config.time / 1000
      const _run = () => {
        this.find('.dx-ad-time').innerText = start
        start--
        if (start === -1) {
          this.parent.classList.remove('is-playing-advertise')
          clearTimeout(this._timer)
          this._timer = null
          return
        }
        this._timer = setTimeout(() => {
          _run()
        }, 1000)
      }
      _run()
    }

    afterCreate() {
      const { config, player, playerConfig } = this

      if (!playerConfig.advertise) {
        return
      }

      this._stop = () => {
        player.play()
        this.parent.removeEventListener('click', this.clickEvent, true)
        this.parent.classList.remove('is-playing-advertise')
      }

      this.clickEvent = e => {
        e.stopImmediatePropagation()

        const btn = this.find('.dx-ad-jump')
        if (btn === e.target || btn.contains(e.target)) {
          if (this._player_timer) {
            clearTimeout(this._player_timer)
            this._player_timer = null
          }
          return this._stop()
        }
        if (!this.parent.classList.contains('is-playing-advertise')) {
          this.cutDown()
          this.parent.classList.add('is-playing-advertise')
          this._player_timer = setTimeout(() => {
            this._stop()
          }, config.time)
        }
      }

      this.parent.addEventListener('click', this.clickEvent, true)
    }

    render() {
      const { playerConfig, config } = this

      if (!playerConfig.advertise) {
        return
      }
      return `
      <div class="dx-ad-plugin">
        <div class="dx-ad-container" style="background-image: url(${config.url})">
           <button class="dx-ad-jump"><span>跳过</span>(<span class="dx-ad-time">5</span>s)<div class="dx-ad-arrow"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M7.58 16.89l5.77-4.07c.56-.4.56-1.24 0-1.63L7.58 7.11C6.91 6.65 6 7.12 6 7.93v8.14c0 .81.91 1.28 1.58.82zM16 7v10c0 .55.45 1 1 1s1-.45 1-1V7c0-.55-.45-1-1-1s-1 .45-1 1z" fill="currentColor"></path></svg></div></button>
        </div>
      </div>
    `
    }
  }

  async function create_player(config = {}) {
    let player
    if (!config) {
      config = {}
      console.warn('请参入配置')
    }
    const load_queque = []
    const { advertise } = config
    if (advertise && advertise.url) {
      const { decrypt = true } = advertise
      if (decrypt) {
        const decrypt_ad = () => {
          return new Promise((resolve, reject) => {
            lazyload
              .load_image_direct(advertise.url)
              .then(_url => {
                config.advertise.url = _url
                resolve()
              })
              .catch(reject)
          })
        }
        load_queque.push(decrypt_ad())
      }
    }
    if (config.poster) {
      const decrypt_poster = () => {
        return new Promise((resolve, reject) => {
          lazyload
            .decrypto_image(config.poster)
            .then(_url => {
              config.poster = _url
              resolve()
            })
            .catch(reject)
        })
      }
      load_queque.push(decrypt_poster())
    }

    if (load_queque.length) {
      try {
        await Promise.all(load_queque)
      } catch (error) {
        console.warn('图片解密失败: ', error)
      }
    }

    const base_config = {
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
      poster: {
        poster: config.poster,
        hideCanplay: true
      },
      icons: {
        loadingIcon: `<div class="xgplayer-enter-spinner"><div class="xgplayer-enter-bar1"></div><div class="xgplayer-enter-bar2"></div><div class="xgplayer-enter-bar3"></div><div class="xgplayer-enter-bar4"></div><div class="xgplayer-enter-bar5"></div><div class="xgplayer-enter-bar6"></div><div class="xgplayer-enter-bar7"></div><div class="xgplayer-enter-bar8"></div><div class="xgplayer-enter-bar9"></div><div class="xgplayer-enter-bar10"></div><div class="xgplayer-enter-bar11"></div><div class="xgplayer-enter-bar12"></div></div>`
      },
      pipe: {
        showIcon: true
      },
      type: config.id || 'video',
      volume: 1,
      plugins: [AdPlugin]
    }
    if (document.createElement(config.id === 'audio' ? 'audio' : 'video').canPlayType('application/vnd.apple.mpegurl')) {
      // 原生支持 hls 播放
      player = new Player({
        ...base_config,
        ...config
      })
    } else if (HlsJsPlugin.isSupported()) {
      // 第一步
      base_config.plugins.push(HlsJsPlugin),
        (player = new Player({
          ...base_config,
          ...config
        }))
    }

    if (config.track) {
      const track = document.createElement('track')
      track.kind = 'subtitles'
      track.label = config.track.label
      track.srclang = config.track.language
      track.src = config.track.url
      track.default = true
      player.media.append(track)
    }
    return player
  }




  return {
    create_player
  }
})
