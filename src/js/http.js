define(['jquery', 'db', 'zui'], function ($, db) {
  function http(config = {}) {
    return new Promise((resolve, reject) => {
      const default_config = {
        method: 'POST',
        dataType: 'json'
      }
      const { _options = {}, ...rest } = config
      $.ajax({
        ...default_config,
        ...rest,
        url: `${API_PREFIX}${config.url}`,
        success: function (res) {
          const code = res.code
          if (code === (_options.code || 200)) {
            if (_options.showSuccess) {
              new $.zui.Messager(_options.msg || res.msg, {
                time: 3000,
                type: 'success',
                close: false
              }).show()
            }
            if (_options.original) {
              return resolve(res)
            }
            resolve(res.data)
          } else if (code === 403) {
            localStorage.clear()
            sessionStorage.clear()
            document.cookie = `landing_modal_key =; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`
            db.clear()
            $('.login-container').show()

            $('.logged-container').hide()
            $('#login_modal').modal({
              position: 160,
              show: true,
              backdrop: 'static'
            })

            reject(res.msg)
          } else {
            reject(res.msg)

            if (_options.showError) {
              new $.zui.Messager(res.msg, {
                time: 3000,
                type: 'danger',
                close: false
              }).show()
            }
          }
        },
        error: function (xhr, status, error) {
          if (_options.showError) {
            new $.zui.Messager(error.toString(), {
              time: 3000,
              type: 'danger',
              close: false
            }).show()
          }
          reject(error)
        }
      })
    })
  }

  return http
})
