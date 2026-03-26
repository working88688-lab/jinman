define(['http', 'lib/clipboard', 'jquery', 'zui', 'lib/qrcode'], function (http, Clipboard) {
  function throttle(func, delay) {
    let timerId
    let lastExecTime = 0

    return function (...args) {
      const now = Date.now()
      const timeSinceLastExecution = now - lastExecTime

      if (!timerId && timeSinceLastExecution >= delay) {
        func.apply(this, args)
        lastExecTime = now
      } else if (!timerId) {
        timerId = setTimeout(() => {
          func.apply(this, args)
          lastExecTime = Date.now()
          timerId = null
        }, delay - timeSinceLastExecution)
      }
    }
  }
  const REGEX_MOBILE1 =
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|FBAN|FBAV|fennec|hiptop|iemobile|ip(hone|od)|Instagram|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i

  // eslint-disable-next-line
  const REGEX_MOBILE2 =
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i

  function isMobile() {
    return REGEX_MOBILE1.test(navigator.userAgent) || REGEX_MOBILE2.test(navigator.userAgent.slice(0, 4))
  }

  function formatNumberWithUnit(number = 0) {
    if (number <= 0) {
      return 0
    }
    // 定义单位和对应的数字范围
    const units = ['', 'k', 'M', 'G', 'T']
    const unitThreshold = 1000

    // 初始化单位索引和初始值
    let unitIndex = 0
    let formattedNumber = number

    // 循环直到找到合适的单位
    while (formattedNumber >= unitThreshold && unitIndex < units.length - 1) {
      formattedNumber /= unitThreshold
      unitIndex++
    }

    // 保留一位小数，并且去掉多余的0
    formattedNumber = parseFloat(formattedNumber.toFixed(1))

    // 返回带单位的格式化数字
    return `${formattedNumber}${units[unitIndex]}`
  }

  function format_url_search_params(merge_params = {}) {
    const params = new URLSearchParams(window.location.search)
    const result = {}
    for (const [key, value] of params.entries()) {
      result[key] = value
    }

    const merged_params = {
      ...result,
      ...merge_params
    }
    const entries = Object.entries(merged_params)
    const paramString = entries
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')
    return paramString
  }

  const LOGIN_KEY = 'is_login'
  function check_login(callback, show_modal = true) {
    const is_login = localStorage.getItem(LOGIN_KEY)
    if (is_login) {
      if (typeof callback === 'function') {
        callback()
      }
    } else {
      if (show_modal) {
        $('#login_modal').modal({
          position: 160,
          show: true,
          backdrop: 'static'
        })
      }
    }
  }

   function getCurrentDate() {
     const now = new Date()
     const year = now.getFullYear()
     const month = String(now.getMonth() + 1).padStart(2, '0')
     const day = String(now.getDate()).padStart(2, '0')
     return ''.concat(year, '-').concat(month, '-').concat(day)
   }

  function useShare(url, selector = '.btn-share', tips = '分享链接复制成功') {
    const clipboard = new Clipboard(selector, {
      text: function text() {
        return String(url)
      }
    })
    clipboard.on('success', function (e) {
      new $.zui.Messager(tips, {
        time: 2000,
        close: false,
        type: 'success'
      }).show()
    })
  }

  function useQrcode(text, el = '#qrCode', config = {}) {
    new QRCode(document.querySelector(el), {
      text,
      width: 120,
      height: 120,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H,
      ...config
    })
  }

  function front_logout() {
    localStorage.clear()
    sessionStorage.clear()
    db.clear()
    document.cookie = `landing_modal_key =; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`
  }
  function useMessage(msg, type = 'danger', config = {}) {
    new $.zui.Messager(msg, {
      time: 3000,
      type,
      close: false,
      ...config
    }).show()
  }
  async function get_user_info() {
    try {
      const res = await http({
        url: '/index/info'
      })
      return res
    } catch (error) {
      return Promise.reject(error)
    }
  }

  function load_amd_module(module_paths, resolve_callback) {
    if (module_paths && typeof resolve_callback === 'function') {
      module_paths = Array.isArray(module_paths) ? module_paths : [module_paths]
      require(module_paths, resolve_callback)
    }
  }
  return {
    throttle,
    check_login,
    useShare,
    front_logout,
    useMessage,
    useQrcode,
    isMobile: isMobile(),
    formatNumberWithUnit,
    format_url_search_params,
    get_user_info,
    load_amd_module,
    getCurrentDate
  }
})
