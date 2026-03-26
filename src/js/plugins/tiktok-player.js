define(['plugins/lazyload', 'utils', 'plugins/xgplayer-common-plugin', 'xgplayer'], function (lazyload, utils, common_plugins) {
  const { Plugin, Util, Events, BasePlugin } = window.Player
  const { POSITIONS } = Plugin
  
  class AutomaticPlugin extends Plugin {
    static get pluginName () {
      return 'automatic'
    }

    static get defaultConfig () {
      return {
        position: POSITIONS.CONTROLS_RIGHT,
        index: 9,
        disable: false,
        shortcutKey: '',
      }
    }

    updateSwitchStatus(status) {
        const action = status ? 'add' : 'remove'
        this.switchDom.classList[action]('xg-switch-checked')
    }

    afterCreate() {
      this._turn = this.playerConfig.isAutomic
      this.switchDom = this.find('.xg-switch')
      if (this._turn) {
        this.switchDom.classList.add('xg-switch-checked')
      }
      this._clickhandler = () => {
        this.switchDom.classList.toggle('xg-switch-checked')
        this._turn = !this._turn
        this.player.emit('automic', this._turn)
      }
      this.root.addEventListener('click', this._clickhandler);
    }

    destroy() {
      this.root.removeEventListener('click', this._clickhandler);
    }


    render () {
        this.player.i18n.AUTOMATIC = '自动连播'
        this.player.i18nKeys.AUTOMATIC='AUTOMATIC'
        if (this.config.disable) {
          return
        }
        return `<xg-icon class='xgplayer-automatic'>
        <div class="xgplayer-icon">
        <div class="xgplayer-setting-label">
          <button aria-checked="true" class="xg-switch" aria-labelledby="xg-switch-pip" type="button">
            <span class="xg-switch-inner"></span></button><span class="xgplayer-setting-title">连播</span>
          </div>
        </div>
         ${Util.xgIconTips(this, 'AUTOMATIC', this.playerConfig.isHideTips, this.config.shortcutKey)}
        </xg-icon>`
    }
  
  }
  const [HlsJsPlugin, ...rest_plugins] = common_plugins
  function create_player(config = {}) {
    let player
    if (!config) {
      config = {}
      console.warn('请参入配置')
    }
    const { poster, ...restConfig } = config
    const plugins = [AutomaticPlugin, ...rest_plugins]
    const base_config = {
      isMobileSimulateMode: utils.isPc ? 'pc' : 'mobile',
      lang: 'zh',
      height: '100%',
      width: '100%',
      loop: false,
      miniprogress: true,
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
      cssFullscreen: false,
 
      controls: {
        initShow: true,
        mode: 'normal',
        autoHide: false
      },
      volume: {
        index: 7,
      },
      icons: {
        play: '<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" focusable="false" style="font-size:32px"><path d="M23.5 15.134C24.1667 15.5189 24.1667 16.4811 23.5 16.866L12.25 23.3612C11.5833 23.7461 10.75 23.265 10.75 22.4952L10.75 9.50481C10.75 8.73501 11.5833 8.25388 12.25 8.63878L23.5 15.134Z" fill="currentColor"></path></svg>',
        pause: '<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" focusable="false" style="font-size:32px"><path d="M10 8C9.44772 8 9 8.44772 9 9V23C9 23.5523 9.44772 24 10 24H13C13.5523 24 14 23.5523 14 23V9C14 8.44772 13.5523 8 13 8H10Z" fill="currentColor"></path><path d="M19 8C18.4477 8 18 8.44772 18 9V23C18 23.5523 18.4477 24 19 24H22C22.5523 24 23 23.5523 23 23V9C23 8.44772 22.5523 8 22 8H19Z" fill="currentColor"></path></svg>',
        volumeLarge: '<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" focusable="false" style="font-size:32px"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.6523 8.02754C15.6339 6.57433 18.4265 7.98939 18.4265 10.4467V21.5532C18.4265 24.0105 15.6339 25.4256 13.6524 23.9725L9.86308 21.1936C9.69156 21.0679 9.4844 21.0001 9.27171 21.0001H8.42645C6.7696 21.0001 5.42645 19.6569 5.42645 18.0001V14.0001C5.42645 12.3432 6.7696 11.0001 8.42645 11.0001H9.27169C9.48439 11.0001 9.69155 10.9322 9.86307 10.8064L13.6523 8.02754ZM16.4265 10.4467C16.4265 9.62761 15.4956 9.15592 14.8351 9.64033L11.0458 12.4192C10.5313 12.7966 9.90979 13.0001 9.27169 13.0001H8.42645C7.87417 13.0001 7.42645 13.4478 7.42645 14.0001V18.0001C7.42645 18.5523 7.87417 19.0001 8.42645 19.0001H9.27171C9.90979 19.0001 10.5313 19.2035 11.0458 19.5808L14.8351 22.3596C15.4956 22.844 16.4265 22.3723 16.4265 21.5532V10.4467ZM21.2263 11.8253L21.8066 12.6397C22.4855 13.5924 22.8857 14.7511 22.8857 16.0001C22.8857 17.249 22.4855 18.4078 21.8066 19.3605L21.2263 20.1749L19.5975 19.0143L20.1778 18.1999C20.6263 17.5704 20.8857 16.8142 20.8857 16.0001C20.8857 15.1859 20.6263 14.4297 20.1778 13.8003L19.5975 12.9859L21.2263 11.8253ZM24.8066 10.4994L24.2263 9.68498L22.5975 10.8456L23.1778 11.66C24.0603 12.8986 24.5736 14.392 24.5736 16.0004C24.5736 17.6089 24.0603 19.1023 23.1778 20.3408L22.5975 21.1552L24.2263 22.3158L24.8066 21.5014C25.9195 19.9396 26.5736 18.0436 26.5736 16.0004C26.5736 13.9572 25.9195 12.0612 24.8066 10.4994Z" fill="currentColor"></path></svg>',
        volumeSmall: '<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" focusable="false" style="font-size:32px"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.0367 10.4467C19.0367 7.98933 16.2441 6.57427 14.2625 8.02748L10.4733 10.8064C10.3018 10.9322 10.0946 11 9.88192 11H9.03668C7.37983 11 6.03668 12.3431 6.03668 14V18C6.03668 19.6568 7.37983 21 9.03668 21H9.88194C10.0946 21 10.3018 21.0678 10.4733 21.1936L14.2626 23.9724C16.2442 25.4256 19.0367 24.0105 19.0367 21.5532V10.4467ZM15.4453 9.64027C16.1058 9.15586 17.0367 9.62755 17.0367 10.4467V21.5532C17.0367 22.3723 16.1058 22.844 15.4453 22.3596L11.656 19.5808C11.1415 19.2034 10.52 19 9.88194 19H9.03668C8.4844 19 8.03668 18.5523 8.03668 18V14C8.03668 13.4477 8.4844 13 9.03668 13H9.88192C10.52 13 11.1415 12.7965 11.6561 12.4192L15.4453 9.64027ZM23.6663 11.6777L22.844 11.1086L21.7059 12.7532L22.5282 13.3223C23.4087 13.9317 23.9633 14.9105 23.9633 16C23.9633 17.0895 23.4087 18.0683 22.5282 18.6777L21.7059 19.2468L22.844 20.8914L23.6663 20.3223C25.0461 19.3674 25.9633 17.7937 25.9633 16C25.9633 14.2063 25.0461 12.6326 23.6663 11.6777Z" fill="currentColor"></path></svg>',
        volumeMuted: '<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" focusable="false" style="font-size:32px"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.4525 8.11043L10.7454 7.40332L9.33115 8.81753L10.0383 9.52464L23.4733 22.9597L24.1804 23.6668L25.5946 22.2526L24.8875 21.5455L22.4054 19.0634V10.6468C22.4054 8.31652 19.8647 6.87595 17.8651 8.0724L13.8292 10.4872L11.4525 8.11043ZM15.2874 11.9454L20.4054 17.0634V10.6468C20.4054 9.87002 19.5585 9.38983 18.8919 9.78865L15.2874 11.9454ZM20.0501 22.357L21.4669 23.7738C20.5453 24.6377 19.1017 24.9064 17.8651 24.1664L11.6291 20.4352H9.4054C7.74854 20.4352 6.4054 19.0921 6.4054 17.4352V14.8036C6.4054 13.1468 7.74854 11.8036 9.4054 11.8036H9.49674L11.4967 13.8036H9.4054C8.85311 13.8036 8.4054 14.2513 8.4054 14.8036V17.4352C8.4054 17.9875 8.85311 18.4352 9.4054 18.4352H11.6291C11.9907 18.4352 12.3456 18.5333 12.656 18.719L18.8919 22.4502C19.2856 22.6857 19.7422 22.6147 20.0501 22.357Z" fill="currentColor"></path></svg>',
        fullscreen: '<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" focusable="false" style="font-size:32px"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.75 8.25C9.54086 8.25 7.75 10.0409 7.75 12.25V12.75V13.75H9.75V12.75V12.25C9.75 11.1454 10.6454 10.25 11.75 10.25H12.25H13.25V8.25H12.25H11.75ZM20.25 8.25C22.4591 8.25 24.25 10.0409 24.25 12.25V12.75V13.75H22.25V12.75V12.25C22.25 11.1454 21.3546 10.25 20.25 10.25H19.75H18.75V8.25H19.75H20.25ZM7.75 19.75C7.75 21.9591 9.54086 23.75 11.75 23.75H12.25H13.25V21.75H12.25H11.75C10.6454 21.75 9.75 20.8546 9.75 19.75V19.25V18.25H7.75V19.25V19.75ZM20.25 23.75C22.4591 23.75 24.25 21.9591 24.25 19.75V19.25V18.25H22.25V19.25V19.75C22.25 20.8546 21.3546 21.75 20.25 21.75H19.75H18.75V23.75H19.75H20.25Z" fill="currentColor"></path></svg>',
        exitFullscreen: '<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" focusable="false" style="font-size:32px"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.25 13.75C11.4591 13.75 13.25 11.9591 13.25 9.75V9.25V8.25H11.25V9.25V9.75C11.25 10.8546 10.3546 11.75 9.25 11.75H8.75H7.75V13.75H8.75H9.25ZM22.75 13.75C20.5409 13.75 18.75 11.9591 18.75 9.75V9.25V8.25H20.75V9.25V9.75C20.75 10.8546 21.6454 11.75 22.75 11.75H23.25H24.25V13.75H23.25H22.75ZM13.25 22.25C13.25 20.0409 11.4591 18.25 9.25 18.25H8.75H7.75V20.25H8.75H9.25C10.3546 20.25 11.25 21.1454 11.25 22.25V22.75V23.75H13.25V22.75V22.25ZM22.75 18.25C20.5409 18.25 18.75 20.0409 18.75 22.25V22.75V23.75H20.75V22.75V22.25C20.75 21.1454 21.6454 20.25 22.75 20.25H23.25H24.25V18.25H23.25H22.75Z" fill="currentColor"></path></svg>',
        cssFullscreen: '<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32" focusable="false"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.75 8H14.6961H14.696C13.3374 7.99999 12.2417 7.99997 11.3626 8.0894C10.4552 8.18171 9.66829 8.3775 8.97215 8.84265C8.4262 9.20745 7.95745 9.6762 7.59265 10.2222C7.12751 10.9183 6.93171 11.7052 6.8394 12.6126C6.74997 13.4917 6.74999 14.5874 6.75 15.946V15.9461V16V16.0539V16.054C6.74999 17.4126 6.74997 18.5083 6.8394 19.3874C6.93171 20.2948 7.12751 21.0817 7.59265 21.7779C7.95745 22.3238 8.4262 22.7926 8.97215 23.1573C9.66829 23.6225 10.4552 23.8183 11.3626 23.9106C12.2417 24 13.3374 24 14.696 24H14.696H14.75H17.25H17.304H17.304C18.6626 24 19.7583 24 20.6374 23.9106C21.5448 23.8183 22.3317 23.6225 23.0279 23.1573C23.5738 22.7926 24.0426 22.3238 24.4073 21.7779C24.8725 21.0817 25.0683 20.2948 25.1606 19.3874C25.25 18.5083 25.25 17.4126 25.25 16.054V16.054V16V15.946V15.946C25.25 14.5874 25.25 13.4917 25.1606 12.6126C25.0683 11.7052 24.8725 10.9183 24.4073 10.2222C24.0426 9.6762 23.5738 9.20745 23.0279 8.84265C22.3317 8.3775 21.5448 8.18171 20.6374 8.0894C19.7583 7.99997 18.6626 7.99999 17.304 8H17.3039H17.25H14.75ZM10.0833 10.5056C10.396 10.2966 10.8158 10.1554 11.5651 10.0791C12.331 10.0012 13.3247 10 14.75 10H17.25C18.6753 10 19.669 10.0012 20.4349 10.0791C21.1842 10.1554 21.604 10.2966 21.9167 10.5056C22.2443 10.7245 22.5255 11.0057 22.7444 11.3333C22.9534 11.646 23.0946 12.0658 23.1709 12.8151C23.2488 13.581 23.25 14.5747 23.25 16C23.25 17.4253 23.2488 18.419 23.1709 19.1849C23.0946 19.9342 22.9534 20.354 22.7444 20.6667C22.5255 20.9943 22.2443 21.2755 21.9167 21.4944C21.604 21.7034 21.1842 21.8446 20.4349 21.9209C19.669 21.9988 18.6753 22 17.25 22H14.75C13.3247 22 12.331 21.9988 11.5651 21.9209C10.8158 21.8446 10.396 21.7034 10.0833 21.4944C9.75572 21.2755 9.47447 20.9943 9.25559 20.6667C9.04662 20.354 8.90535 19.9342 8.82913 19.1849C8.75121 18.419 8.75 17.4253 8.75 16C8.75 14.5747 8.75121 13.581 8.82913 12.8151C8.90535 12.0658 9.04662 11.646 9.25559 11.3333C9.47447 11.0057 9.75572 10.7245 10.0833 10.5056ZM10.75 14C10.75 12.8954 11.6454 12 12.75 12H13.95H14.95V14H13.95H12.75V15.2V16.2H10.75V15.2V14ZM21.25 18C21.25 19.1046 20.3546 20 19.25 20H18.05H17.05V18H18.05H19.25V16.8V15.8H21.25V16.8V18Z" fill="currentColor"></path></svg>',
        exitCssFullscreen: '<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32" focusable="false" color="#fff"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.75 8H14.6961H14.696C13.3374 7.99999 12.2417 7.99997 11.3626 8.0894C10.4552 8.18171 9.66829 8.3775 8.97215 8.84265C8.4262 9.20745 7.95745 9.6762 7.59265 10.2222C7.12751 10.9183 6.93171 11.7052 6.8394 12.6126C6.74997 13.4917 6.74999 14.5874 6.75 15.946V15.9461V16V16.0539V16.054C6.74999 17.4126 6.74997 18.5083 6.8394 19.3874C6.93171 20.2948 7.12751 21.0817 7.59265 21.7779C7.95745 22.3238 8.4262 22.7926 8.97215 23.1573C9.66829 23.6225 10.4552 23.8183 11.3626 23.9106C12.2417 24 13.3374 24 14.696 24H14.696H14.75H17.25H17.304H17.304C18.6626 24 19.7583 24 20.6374 23.9106C21.5448 23.8183 22.3317 23.6225 23.0279 23.1573C23.5738 22.7926 24.0426 22.3238 24.4073 21.7779C24.8725 21.0817 25.0683 20.2948 25.1606 19.3874C25.25 18.5083 25.25 17.4126 25.25 16.054V16.054V16V15.946V15.946C25.25 14.5874 25.25 13.4917 25.1606 12.6126C25.0683 11.7052 24.8725 10.9183 24.4073 10.2222C24.0426 9.6762 23.5738 9.20745 23.0279 8.84265C22.3317 8.3775 21.5448 8.18171 20.6374 8.0894C19.7583 7.99997 18.6626 7.99999 17.304 8H17.3039H17.25H14.75ZM10.0833 10.5056C10.396 10.2966 10.8158 10.1554 11.5651 10.0791C12.331 10.0012 13.3247 10 14.75 10H17.25C18.6753 10 19.669 10.0012 20.4349 10.0791C21.1842 10.1554 21.604 10.2966 21.9167 10.5056C22.2443 10.7245 22.5255 11.0057 22.7444 11.3333C22.9534 11.646 23.0946 12.0658 23.1709 12.8151C23.2488 13.581 23.25 14.5747 23.25 16C23.25 17.4253 23.2488 18.419 23.1709 19.1849C23.0946 19.9342 22.9534 20.354 22.7444 20.6667C22.5255 20.9943 22.2443 21.2755 21.9167 21.4944C21.604 21.7034 21.1842 21.8446 20.4349 21.9209C19.669 21.9988 18.6753 22 17.25 22H14.75C13.3247 22 12.331 21.9988 11.5651 21.9209C10.8158 21.8446 10.396 21.7034 10.0833 21.4944C9.75572 21.2755 9.47447 20.9943 9.25559 20.6667C9.04662 20.354 8.90535 19.9342 8.82913 19.1849C8.75121 18.419 8.75 17.4253 8.75 16C8.75 14.5747 8.75121 13.581 8.82913 12.8151C8.90535 12.0658 9.04662 11.646 9.25559 11.3333C9.47447 11.0057 9.75572 10.7245 10.0833 10.5056ZM15.45 14.1999C15.45 15.3045 14.5546 16.1999 13.45 16.1999H12.25H11.25V14.1999H12.25H13.45V12.9999V11.9999H15.45V12.9999V14.1999ZM16.55 17.8C16.55 16.6954 17.4454 15.8 18.55 15.8H19.75H20.75V17.8H19.75H18.55V19V20H16.55V19V17.8Z" fill="currentColor"></path></svg>',
        loadingIcon: `<div class="tiktok-player-loading"><div class="tiktok-player-loading-icon"></div></div>`
      },
      start: {
        isShowPause: true,
      },
      commonStyle: {
        playedColor: 'rgba(255,255,255,.4)',
        sliderBtnStyle: {
          boxShadow: 'none',
          background: 'rgba(255,255,255,.4)'
        },
      },
      miniprogress: false,
      plugins: plugins,
      enter: {
        innerHtml: '<div class="tiktok-player-enter-icon"></div>'
      },
      isTikTok: true,
      videoAttributes: {
        'x5-video-player-type': 'h5',
        'x5-video-player-fullscreen': 'true',
        controls: false,
         playsinline: true,
        webkitPlaysinline: true,
      }
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
          ...restConfig
        }))
    }
    if (poster) {
      lazyload
        .decrypto_image(poster)
        .then(_url => {
          player.poster = _url
          player.root.classList.add('poster-cryptoed')
        })
        .catch(() => {})
    }
 
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

    player.on('error', e => {
      console.log('e: ', e);
      player.pause()

    })
    return player
  }

  return {
    create_player
  }
})
