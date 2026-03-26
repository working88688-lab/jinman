!(function () {
  'use strict'
  var e = function (e, t) {
      var n
      if (arguments.length > 1)
        if (2 == arguments.length && 'object' == typeof t)
          for (var a in t) void 0 !== t[a] && ((n = new RegExp('({' + a + '})', 'g')), (e = e.replace(n, t[a])))
        else
          for (var o = 1; o < arguments.length; o++)
            void 0 !== arguments[o] &&
              ((n = new RegExp('({[' + (o - 1) + ']})', 'g')), (e = e.replace(n, arguments[o])))
      return e
    },
    t = function (e) {
      var t
      return null !== e && ((t = /\d*/i), e.match(t) == e)
    },
    n = { formatString: e, string: { format: e, isNum: t } }
  window.$ && window.$.zui ? $.zui(n) : (window.stringHelper = n.string),
    window.noStringPrototypeHelper ||
      (String.prototype.format ||
        (String.prototype.format = function () {
          var t = [].slice.call(arguments)
          return t.unshift(this), e.apply(this, t)
        }),
      String.prototype.isNum ||
        (String.prototype.isNum = function () {
          return t(this)
        }))
})(),
  (function (e, t, n) {
    'use strict'
    if (void 0 === e) throw new Error('ZUI requires jQuery')
    e.zui ||
      (e.zui = function (t) {
        e.isPlainObject(t) && e.extend(e.zui, t)
      })
    var a = { all: -1, left: 0, middle: 1, right: 2 },
      o = 0
    e.zui({
      uuid: function (e) {
        var t = 1e5 * (Date.now() - 1580890015292) + 10 * Math.floor(1e4 * Math.random()) + (o++ % 10)
        return e ? t : t.toString(36)
      },
      callEvent: function (e, t, a) {
        if ('function' == typeof e) {
          a !== n && (e = e.bind(a))
          var o = e(t)
          return t && (t.result = o), !(o !== n && !o)
        }
        return 1
      },
      strCode: function (e) {
        var t = 0
        if (('string' != typeof e && (e = String(e)), e && e.length))
          for (var n = 0; n < e.length; ++n) t += (n + 1) * e.charCodeAt(n)
        return t
      },
      getMouseButtonCode: function (e) {
        return 'number' != typeof e && (e = a[e]), (e !== n && null !== e) || (e = -1), e
      },
      defaultLang: 'en',
      clientLang: function () {
        var n,
          a = t.config
        if ((void 0 !== a && a.clientLang && (n = a.clientLang), !n)) {
          var o = e('html').attr('lang')
          n = o || navigator.userLanguage || navigator.userLanguage || e.zui.defaultLang
        }
        return n.replace('-', '_').toLowerCase()
      },
      langDataMap: {},
      addLangData: function (t, n, a) {
        var o = {}
        a && n && t
          ? ((o[n] = {}), (o[n][t] = a))
          : t && n && !a
            ? ((a = n),
              e.each(a, function (e) {
                ;(o[e] = {}), (o[e][t] = a[e])
              }))
            : !t ||
              n ||
              a ||
              e.each(a, function (t) {
                var n = a[t]
                e.each(n, function (e) {
                  o[e] || (o[e] = {}), (o[e][t] = n[e])
                })
              }),
          e.extend(!0, e.zui.langDataMap, o)
      },
      getLangData: function (t, n, a) {
        if (!arguments.length) return e.extend({}, e.zui.langDataMap)
        if (1 === arguments.length) return e.extend({}, e.zui.langDataMap[t])
        if (2 === arguments.length) return (o = e.zui.langDataMap[t]) ? (n ? o[n] : o) : {}
        if (3 === arguments.length) {
          n = n || e.zui.clientLang()
          var o,
            i = (o = e.zui.langDataMap[t]) ? o[n] : {}
          return e.extend(!0, {}, a[n] || a.en || a.zh_cn, i)
        }
        return null
      },
      lang: function () {
        return arguments.length && e.isPlainObject(arguments[arguments.length - 1])
          ? e.zui.addLangData.apply(null, arguments)
          : e.zui.getLangData.apply(null, arguments)
      },
      _scrollbarWidth: 0,
      checkBodyScrollbar: function () {
        if (document.body.clientWidth >= t.innerWidth) return 0
        if (!e.zui._scrollbarWidth) {
          var n = document.createElement('div')
          ;(n.className = 'scrollbar-measure'),
            document.body.appendChild(n),
            (e.zui._scrollbarWidth = n.offsetWidth - n.clientWidth),
            document.body.removeChild(n)
        }
        return e.zui._scrollbarWidth
      },
      fixBodyScrollbar: function () {
        if (e.zui.checkBodyScrollbar()) {
          var t = e('body'),
            n = parseInt(t.css('padding-right') || 0, 10)
          return e.zui._scrollbarWidth && t.css({ paddingRight: n + e.zui._scrollbarWidth, overflowY: 'hidden' }), !0
        }
      },
      resetBodyScrollbar: function () {
        e('body').css({ paddingRight: '', overflowY: '' })
      }
    }),
      (e.fn.callEvent = function (t, a, o) {
        var i = e(this),
          s = t.indexOf('.zui.'),
          r = s < 0 ? t : t.substring(0, s),
          l = e.Event(r, a)
        if ((o === n && s > 0 && (o = i.data(t.substring(s + 1))), o && o.options)) {
          var c = o.options[r]
          'function' == typeof c && (l.result = e.zui.callEvent(c, l, o))
        }
        return i.trigger(l), l
      }),
      (e.fn.callComEvent = function (e, t, a) {
        a === n || Array.isArray(a) || (a = [a])
        var o
        this.trigger(t, a)
        var i = e.options[t]
        return i && (o = i.apply(e, a)), o
      })
  })(jQuery, window, void 0),
  (function (e, t) {
    'use strict'
    var n = 'zui.pager',
      a = { page: 1, recTotal: 0, recPerPage: 10 },
      o = {
        zh_cn: {
          pageOfText: '第 {0} 页',
          prev: '上一页',
          next: '下一页',
          first: '第一页',
          last: '最后一页',
          goto: '跳转',
          pageOf: '第 <strong>{page}</strong> 页',
          totalPage: '共 <strong>{totalPage}</strong> 页',
          totalCount: '共 <strong>{recTotal}</strong> 项',
          pageSize: '每页 <strong>{recPerPage}</strong> 项',
          itemsRange: '第 <strong>{start}</strong> ~ <strong>{end}</strong> 项',
          pageOfTotal: '第 <strong>{page}</strong>/<strong>{totalPage}</strong> 页'
        }
      },
      i = function (t, a) {
        var s = this
        ;(s.name = n),
          (s.$ = e(t)),
          (a = s.options = e.extend({}, i.DEFAULTS, this.$.data(), a)),
          (s.langName = a.lang || e.zui.clientLang()),
          (s.lang = e.zui.getLangData(n, s.langName, o)),
          (s.state = {}),
          s.set(a.page, a.recTotal, a.recPerPage, !0),
          s.$.on('click', '.pager-goto-btn', function () {
            var t = e(this).closest('.pager-goto'),
              n = parseInt(t.find('.pager-goto-input').val())
            NaN !== n && s.set(n)
          })
            .on('click', '.pager-item', function () {
              var t = e(this).data('page')
              'number' == typeof t && t > 0 && s.set(t)
            })
            .on('click', '.pager-size-menu [data-size]', function () {
              var t = e(this).data('size')
              'number' == typeof t && t > 0 && s.set(-1, -1, t)
            })
      }
    ;(i.prototype.set = function (t, n, o, i) {
      var s = this
      'object' == typeof t && null !== t && ((o = t.recPerPage), (n = t.recTotal), (t = t.page))
      var r = s.state
      r || (r = e.extend({}, a))
      var l = e.extend({}, r)
      return (
        'number' == typeof o && o > 0 && (r.recPerPage = o),
        'number' == typeof n && n >= 0 && (r.recTotal = n),
        'number' == typeof t && t >= 0 && (r.page = t),
        (r.totalPage = r.recTotal && r.recPerPage ? Math.ceil(r.recTotal / r.recPerPage) : 1),
        (r.page = Math.max(0, Math.min(r.page, r.totalPage))),
        (r.pageRecCount = r.recTotal),
        r.page &&
          r.recTotal &&
          (r.page < r.totalPage
            ? (r.pageRecCount = r.recPerPage)
            : r.page > 1 && (r.pageRecCount = r.recTotal - r.recPerPage * (r.page - 1))),
        (r.skip = r.page > 1 ? (r.page - 1) * r.recPerPage : 0),
        (r.start = r.skip + 1),
        (r.end = r.skip + r.pageRecCount),
        (r.prev = r.page > 1 ? r.page - 1 : 0),
        (r.next = r.page < r.totalPage ? r.page + 1 : 0),
        (s.state = r),
        i ||
          (l.page === r.page && l.recTotal === r.recTotal && l.recPerPage === r.recPerPage) ||
          s.$.callComEvent(s, 'onPageChange', [r, l]),
        s.render()
      )
    }),
      (i.prototype.createLinkItem = function (n, a, o) {
        var i = this
        a === t && (a = n)
        var s = e('<a title="' + i.lang.pageOfText.format(n) + '" class="pager-item" data-page="' + n + '"/>')
          .attr('href', n ? i.createLink(n, i.state) : '###')
          .html(a)
        return (
          o ||
            (s = e('<li />')
              .append(s)
              .toggleClass('active', n === i.state.page)
              .toggleClass('disabled', !n || n === i.state.page)),
          s
        )
      }),
      (i.prototype.createNavItems = function (e) {
        var n = this,
          a = n.$,
          o = n.state,
          i = o.totalPage,
          s = o.page,
          r = function (e, o) {
            if (!1 !== e) {
              o === t && (o = e)
              for (var i = e; i <= o; ++i) a.append(n.createLinkItem(i))
            } else a.append(n.createLinkItem(0, o || n.options.navEllipsisItem))
          }
        e === t && (e = n.options.maxNavCount || 10),
          r(1),
          i > 1 &&
            (i <= e
              ? r(2, i)
              : s < e - 2
                ? (r(2, e - 2), r(!1), r(i))
                : s > i - e + 2
                  ? (r(!1), r(i - e + 2, i))
                  : (r(!1), r(s - Math.ceil((e - 4) / 2), s + Math.floor((e - 4) / 2)), r(!1), r(i)))
      }),
      (i.prototype.createGoto = function () {
        var t = this.state
        return e(
          '<div class="input-group pager-goto"><input value="' +
            t.page +
            '" type="number" min="1" max="' +
            t.totalPage +
            '" placeholder="' +
            t.page +
            '" class="form-control pager-goto-input"><span class="input-group-btn"><button class="btn pager-goto-btn" type="button">' +
            this.lang.goto +
            '</button></span></div>'
        )
      }),
      (i.prototype.createSizeMenu = function () {
        var t = this,
          n = this.state,
          a = e('<ul class="dropdown-menu"></ul>'),
          o = t.options.pageSizeOptions
        'string' == typeof o && (o = o.split(','))
        for (var i = 0; i < o.length; ++i) {
          var s = o[i]
          'string' == typeof s && (s = parseInt(s))
          var r = e('<li><a href="###" data-size="' + s + '">' + s + '</a></li>').toggleClass(
            'active',
            s === n.recPerPage
          )
          a.append(r)
        }
        return e(
          '<div class="btn-group pager-size-menu"><button type="button" class="btn dropdown-toggle" data-toggle="dropdown">' +
            t.lang.pageSize.format(n) +
            ' <span class="caret"></span></button></div>'
        )
          .addClass(t.options.menuDirection)
          .append(a)
      }),
      (i.prototype.createElement = function (t, n, a) {
        var o = this,
          i = o.createLinkItem.bind(o),
          s = o.lang
        switch (t) {
          case 'prev':
            return i(a.prev, s.prev)
          case 'prev_icon':
            return i(
              a.prev,
              '<img class="icon" alt="上一页" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAASCAYAAABit09LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTExIDc5LjE1ODMyNSwgMjAxNS8wOS8xMC0wMToxMDoyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplMjQyZjFjZS0zMmE4LWQ2NGMtYmNmNS1kYjE4Y2Q5ODU2MzIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTBGN0ZCRUQxODc2MTFFN0FCN0VDMEE3QjAwOTA3NkEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTBGN0ZCRUMxODc2MTFFN0FCN0VDMEE3QjAwOTA3NkEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6YzVmNTA0ODctOTQzMS0xMDRmLWIxZDktNzU0ZmJkMjYyZDNlIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6NTYzZDM2NmQtZWQ4MC0xMWU2LTg5ZTAtODVkMjUwNzBiNGE5Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ag8T0QAAAItJREFUeNpi/P//PwNWMIuRGUguAuLLDGn/O1hwKGIDkguBOALKZ2DBoWgNEPsiieoyEaFoGRDHMRGjCOjGv0zEKAJxmIhRBFFIhCKYQoKKYAqJAiCFm5H4UeDYgMQKhsIQYhQzAd3zixjFEDcSoZgRJfXgCVNGjGSGQzFm8CCcsQJJ9DIjsQkXIMAAh91Jv4ZLcGEAAAAASUVORK5CYII="/>'
            )
          case 'next':
            return i(a.next, s.next)
          case 'next_icon':
            return i(
              a.next,
              '<img class="icon" alt="下一页" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAASCAYAAABit09LAAAAWUlEQVR4AY3StQGAMBBA0UNnZhV6pGfBk0iD5Rf/qodERFVFV1m83RtUVd6qSEunN3/BvaDaVfADDgTHALhAgAsEOADCPhVhDPGn8WIQ4hvOj5BfCn7N8MU1BxnKPMtDbkgAAAAASUVORK5CYII=" />'
            )
          case 'first':
            return i(1, s.first)
          case 'first_icon':
            return i(1, '<i class="icon ' + o.options.firstIcon + '"></i>')
          case 'last':
            return i(a.totalPage, s.last)
          case 'last_icon':
            return i(a.totalPage, '<i class="icon ' + o.options.lastIcon + '"></i>')
          case 'space':
          case '|':
            return e('<li class="space" />')
          case 'nav':
          case 'pages':
            return void o.createNavItems()
          case 'total_text':
            return e(('<div class="pager-label">' + s.totalCount + '</div>').format(a))
          case 'page_text':
            return e(('<div class="pager-label">' + s.pageOf + '</div>').format(a))
          case 'total_page_text':
            return e(('<div class="pager-label">' + s.totalPage + '</div>').format(a))
          case 'page_of_total_text':
            return e(('<div class="pager-label">' + s.pageOfTotal + '</div>').format(a))
          case 'page_size_text':
            return e(('<div class="pager-label">' + s.pageSize + '</div>').format(a))
          case 'items_range_text':
            return e(('<div class="pager-label">' + s.itemsRange + '</div>').format(a))
          case 'goto':
            return o.createGoto()
          case 'size_menu':
            return o.createSizeMenu()
          default:
            return e('<li/>').html(t.format(a))
        }
      }),
      (i.prototype.createLink = function (n, a) {
        n === t && (n = this.state.page), a === t && (a = this.state)
        var o = this.options.linkCreator
        return 'string' == typeof o
          ? o.format(e.extend({}, a, { page: n }))
          : 'function' == typeof o
            ? o(n, a)
            : '#page=' + n
      }),
      (i.prototype.render = function (t) {
        var n = this,
          a = n.state,
          o = n.options.elementCreator || n.createElement,
          i = e.isPlainObject(o)
        'string' == typeof (t = t || n.elements || n.options.elements) && (t = t.split(',')),
          (n.elements = t),
          n.$.empty()
        for (var s = 0; s < t.length; ++s) {
          var r = e.trim(t[s]),
            l = ((i && o[r]) || o).call(n, r, n.$, a)
          !1 === l && (l = n.createElement(r, n.$, a)),
            l instanceof e && ('LI' !== l[0].tagName && (l = e('<li/>').append(l)), n.$.append(l))
        }
        var c = null
        return (
          n.$.children('li').each(function () {
            var t = e(this),
              n = !!t.children('.pager-item').length
            c ? c.toggleClass('pager-item-right', !n) : n && t.addClass('pager-item-left'), (c = n ? t : null)
          }),
          c && c.addClass('pager-item-right'),
          n.$.callComEvent(n, 'onRender', [a]),
          n
        )
      }),
      (i.DEFAULTS = e.extend(
        {
          elements: [
            'first_icon',
            'prev_icon',
            'pages',
            'next_icon',
            'last_icon',
            'page_of_total_text',
            'items_range_text',
            'total_text'
          ],
          prevIcon: 'icon-double-angle-left',
          nextIcon: 'icon-double-angle-right',
          firstIcon: 'icon-step-backward',
          lastIcon: 'icon-step-forward',
          navEllipsisItem: '<i class="icon icon-ellipsis-h">...</i>',
          maxNavCount: 10,
          menuDirection: 'dropdown',
          pageSizeOptions: [10, 20, 30, 50, 100]
        },
        a
      )),
      (e.fn.pager = function (t) {
        return this.each(function () {
          var a = e(this),
            o = a.data(n),
            s = 'object' == typeof t && t
          o || a.data(n, (o = new i(this, s))), 'string' == typeof t && o[t]()
        })
      }),
      (i.NAME = n),
      (i.LANG = o),
      (e.fn.pager.Constructor = i),
      e(function () {
        e('[data-ride="pager"]').pager()
      })
  })(jQuery, void 0),
  (function (e) {
    'use strict'
    ;(e.fn.emulateTransitionEnd = function (t) {
      var n = !1,
        a = this
      e(this).one('bsTransitionEnd', function () {
        n = !0
      })
      return (
        setTimeout(function () {
          n || e(a).trigger(e.support.transition.end)
        }, t),
        this
      )
    }),
      e(function () {
        ;(e.support.transition = (function () {
          var e = document.createElement('bootstrap'),
            t = {
              WebkitTransition: 'webkitTransitionEnd',
              MozTransition: 'transitionend',
              OTransition: 'oTransitionEnd otransitionend',
              transition: 'transitionend'
            }
          for (var n in t) if (void 0 !== e.style[n]) return { end: t[n] }
          return !1
        })()),
          e.support.transition &&
            (e.event.special.bsTransitionEnd = {
              bindType: e.support.transition.end,
              delegateType: e.support.transition.end,
              handle: function (t) {
                if (e(t.target).is(this)) return t.handleObj.handler.apply(this, arguments)
              }
            })
      })
  })(jQuery),
  (function (e, t) {
    'use strict'
    var n = 992,
      a = t(e),
      o = function () {
        var e = a.width()
        t('html')
          .toggleClass('screen-desktop', e >= n && e < 1200)
          .toggleClass('screen-desktop-wide', e >= 1200)
          .toggleClass('screen-tablet', e >= 768 && e < n)
          .toggleClass('screen-phone', e < 768)
          .toggleClass('device-mobile', e < n)
          .toggleClass('device-desktop', e >= n)
      },
      i = '',
      s = navigator.userAgent
    s.match(/(iPad|iPhone|iPod)/i)
      ? (i += ' os-ios')
      : s.match(/android/i)
        ? (i += ' os-android')
        : s.match(/Win/i)
          ? (i += ' os-windows')
          : s.match(/Mac/i)
            ? (i += ' os-mac')
            : s.match(/Linux/i)
              ? (i += ' os-linux')
              : s.match(/X11/i) && (i += ' os-unix'),
      'ontouchstart' in document.documentElement && (i += ' is-touchable'),
      t('html').addClass(i),
      a.resize(o),
      o()
  })(window, jQuery),
  (function (e, t) {
    'use strict'
    var n = 'zui.modal',
      a = function (a, o) {
        var i = this
        ;(i.options = o),
          (i.$body = e(document.body)),
          (i.$element = e(a)),
          (i.$backdrop = i.isShown = null),
          (i.scrollbarWidth = 0),
          o.moveable === t && (i.options.moveable = i.$element.hasClass('modal-moveable')),
          o.remote &&
            i.$element.find('.modal-content').load(o.remote, function () {
              i.$element.trigger('loaded.' + n)
            }),
          o.scrollInside &&
            e(window).on('resize.' + n, function () {
              i.isShown && i.adjustPosition(t, 100)
            })
      }
    ;(a.VERSION = '3.2.0'),
      (a.TRANSITION_DURATION = 300),
      (a.BACKDROP_TRANSITION_DURATION = 150),
      (a.DEFAULTS = { backdrop: !0, keyboard: !0, show: !0, position: 'fit' })
    var o = function (t, n) {
      var a = e(window)
      ;(n.left = Math.max(0, Math.min(n.left, a.width() - t.outerWidth()))),
        (n.top = Math.max(0, Math.min(n.top, a.height() - t.outerHeight()))),
        t.css(n)
    }
    function i(t, o, i) {
      return this.each(function () {
        var s = e(this),
          r = s.data(n),
          l = e.extend({}, a.DEFAULTS, s.data(), 'object' == typeof t && t)
        r || s.data(n, (r = new a(this, l))), 'string' == typeof t ? r[t](o, i) : l.show && r.show(o, i)
      })
    }
    ;(a.prototype.toggle = function (e, t) {
      return this.isShown ? this.hide() : this.show(e, t)
    }),
      (a.prototype.adjustPosition = function (a, i) {
        var s = this
        if ((clearTimeout(s.reposTask), i)) s.reposTask = setTimeout(s.adjustPosition.bind(s, a, 0), i)
        else {
          var r = s.options
          if ((a === t && (a = r.position), a !== t && null !== a)) {
            'function' == typeof a && (a = a(s))
            var l = s.$element.find('.modal-dialog'),
              c = e(window).height(),
              d = { maxHeight: 'initial', overflow: 'visible' },
              p = l.find('.modal-body').css(d)
            if (r.scrollInside && p.length) {
              var u = r.headerHeight,
                g = r.footerHeight,
                h = l.find('.modal-header'),
                m = l.find('.modal-footer')
              'number' != typeof u && (u = h.length ? h.outerHeight() : 'function' == typeof u ? u(h) : 0),
                'number' != typeof g && (g = m.length ? m.outerHeight() : 'function' == typeof g ? g(m) : 0),
                (d.maxHeight = c - u - g),
                (d.overflow = p[0].scrollHeight > d.maxHeight ? 'auto' : 'visible'),
                p.css(d)
            }
            var f = Math.max(0, (c - l.outerHeight()) / 2)
            if (
              ('fit' === a
                ? (a = { top: f > 50 ? Math.floor((2 * f) / 3) : f })
                : 'center' === a
                  ? (a = { top: f })
                  : e.isPlainObject(a) || (a = { top: a }),
              l.hasClass('modal-moveable'))
            ) {
              var v = null,
                b = r.rememberPos
              b &&
                (!0 === b
                  ? (v = s.$element.data('modal-pos'))
                  : e.zui.store && (v = e.zui.store.pageGet(n + '.rememberPos.' + b))),
                (a = e.extend(a, { left: Math.max(0, (e(window).width() - l.outerWidth()) / 2) }, v)),
                'inside' === r.moveable ? o(l, a) : l.css(a)
            } else l.css(a)
          }
        }
      }),
      (a.prototype.setMoveable = function () {
        e.fn.draggable || console.error('Moveable modal requires draggable.js.')
        var t = this,
          a = t.options,
          i = t.$element.find('.modal-dialog').removeClass('modal-dragged')
        i.toggleClass('modal-moveable', !!a.moveable),
          t.$element.data('modal-moveable-setup') ||
            i.draggable({
              container: t.$element,
              handle: '.modal-header',
              before: function () {
                var e = i.css('margin-top')
                e && '0px' !== e && i.css('top', e).css('margin-top', '').addClass('modal-dragged')
              },
              finish: function (o) {
                var i = a.rememberPos
                i &&
                  (t.$element.data('modal-pos', o.pos),
                  e.zui.store && !0 !== i && e.zui.store.pageSet(n + '.rememberPos.' + i, o.pos))
              },
              move:
                'inside' !== a.moveable ||
                function (e) {
                  o(i, e)
                }
            })
      }),
      (a.prototype.show = function (t, o) {
        var i = this,
          s = e.Event('show.' + n, { relatedTarget: t })
        i.$element.trigger(s),
          i.$element.toggleClass('modal-scroll-inside', !!i.options.scrollInside),
          i.isShown ||
            s.isDefaultPrevented() ||
            ((i.isShown = !0),
            i.options.moveable && i.setMoveable(),
            !1 !== i.options.backdrop && (i.setScrollbar(), i.$body.addClass('modal-open')),
            i.escape(),
            i.$element.on('click.dismiss.' + n, '[data-dismiss="modal"]', function (e) {
              i.hide(), e.stopPropagation()
            }),
            i.backdrop(function () {
              var s = e.support.transition && i.$element.hasClass('fade')
              i.$element.parent().length || i.$element.appendTo(i.$body),
                i.$element.show().scrollTop(0),
                s && i.$element[0].offsetWidth,
                i.$element.addClass('in').attr('aria-hidden', !1),
                i.adjustPosition(o),
                i.enforceFocus()
              var r = e.Event('shown.' + n, { relatedTarget: t })
              s
                ? i.$element
                    .find('.modal-dialog')
                    .one('bsTransitionEnd', function () {
                      i.$element.trigger('focus').trigger(r)
                    })
                    .emulateTransitionEnd(a.TRANSITION_DURATION)
                : i.$element.trigger('focus').trigger(r)
            }))
      }),
      (a.prototype.hide = function (t) {
        t && t.preventDefault && t.preventDefault()
        var o = this
        ;(t = e.Event('hide.' + n)),
          o.$element.trigger(t),
          o.isShown &&
            !t.isDefaultPrevented() &&
            ((o.isShown = !1),
            !1 !== o.options.backdrop && (o.$body.removeClass('modal-open'), o.resetScrollbar()),
            o.escape(),
            e(document).off('focusin.' + n),
            o.$element
              .removeClass('in')
              .attr('aria-hidden', !0)
              .off('click.dismiss.' + n),
            e.support.transition && o.$element.hasClass('fade')
              ? o.$element.one('bsTransitionEnd', o.hideModal.bind(o)).emulateTransitionEnd(a.TRANSITION_DURATION)
              : o.hideModal())
      }),
      (a.prototype.enforceFocus = function () {
        e(document)
          .off('focusin.' + n)
          .on(
            'focusin.' + n,
            function (e) {
              this.$element[0] === e.target || this.$element.has(e.target).length || this.$element.trigger('focus')
            }.bind(this)
          )
      }),
      (a.prototype.escape = function () {
        this.isShown && this.options.keyboard
          ? e(document).on(
              'keydown.dismiss.' + n,
              function (a) {
                if (27 == a.which) {
                  var o = e.Event('escaping.' + n),
                    i = this.$element.triggerHandler(o, 'esc')
                  if (i != t && !i) return
                  this.hide()
                }
              }.bind(this)
            )
          : this.isShown || e(document).off('keydown.dismiss.' + n)
      }),
      (a.prototype.hideModal = function () {
        var e = this
        this.$element.hide(),
          this.backdrop(function () {
            e.$element.trigger('hidden.' + n)
          })
      }),
      (a.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove(), (this.$backdrop = null)
      }),
      (a.prototype.backdrop = function (t) {
        var o = this,
          i = this.$element.hasClass('fade') ? 'fade' : ''
        if (this.isShown && this.options.backdrop) {
          var s = e.support.transition && i
          if (
            ((this.$backdrop = e('<div class="modal-backdrop ' + i + '" />').appendTo(this.$body)),
            this.$element.on(
              'mousedown.dismiss.' + n,
              function (e) {
                e.target === e.currentTarget &&
                  ('static' == this.options.backdrop
                    ? this.$element[0].focus.call(this.$element[0])
                    : this.hide.call(this))
              }.bind(this)
            ),
            s && this.$backdrop[0].offsetWidth,
            this.$backdrop.addClass('in'),
            !t)
          )
            return
          s ? this.$backdrop.one('bsTransitionEnd', t).emulateTransitionEnd(a.BACKDROP_TRANSITION_DURATION) : t()
        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass('in')
          var r = function () {
            o.removeBackdrop(), t && t()
          }
          e.support.transition && this.$element.hasClass('fade')
            ? this.$backdrop.one('bsTransitionEnd', r).emulateTransitionEnd(a.BACKDROP_TRANSITION_DURATION)
            : r()
        } else t && t()
      }),
      (a.prototype.setScrollbar = function () {
        e.zui.fixBodyScrollbar() && this.options.onSetScrollbar && this.options.onSetScrollbar()
      }),
      (a.prototype.resetScrollbar = function () {
        e.zui.resetBodyScrollbar(), this.options.onSetScrollbar && this.options.onSetScrollbar('')
      }),
      (a.prototype.measureScrollbar = function () {
        var e = document.createElement('div')
        ;(e.className = 'modal-scrollbar-measure'), this.$body.append(e)
        var t = e.offsetWidth - e.clientWidth
        return this.$body[0].removeChild(e), t
      })
    var s = e.fn.modal
    ;(e.fn.modal = i),
      (e.fn.modal.Constructor = a),
      (e.fn.modal.noConflict = function () {
        return (e.fn.modal = s), this
      }),
      e(document).on('click.' + n + '.data-api', '[data-toggle="modal"]', function (t) {
        var a = e(this),
          o = a.attr('href'),
          s = null
        try {
          s = e(a.attr('data-target') || (o && o.replace(/.*(?=#[^\s]+$)/, '')))
        } catch (e) {
          return
        }
        if (s.length) {
          var r = s.data(n) ? 'toggle' : e.extend({ remote: !/#/.test(o) && o }, s.data(), a.data())
          a.is('a') && t.preventDefault(),
            s.one('show.' + n, function (e) {
              e.isDefaultPrevented() ||
                s.one('hidden.' + n, function () {
                  a.is(':visible') && a.trigger('focus')
                })
            }),
            i.call(s, r, this, a.data('position'))
        }
      })
  })(jQuery, void 0),
  (function (e, t, n) {
    'use strict'
    var a = 0,
      o = { icons: {}, type: 'default', placement: 'top', time: 4e3, parent: 'body', close: !0, fade: !0, scale: !0 },
      i = {},
      s = function (t, s) {
        e.isPlainObject(t) ? (s = e.extend({}, s, t)) : t && (s ? (s.content = t) : (s = { content: t }))
        var r = this
        ;(s = r.options = e.extend({}, o, s)), (r.id = s.id || a++)
        var l = i[r.id]
        l && l.destroy(),
          (i[r.id] = r),
          (r.$ = e(
            '<div class="messager messager-{type} {placement}" style="display: none"><div class="messager-content"></div><div class="messager-actions"></div></div>'.format(
              s
            )
          )
            .toggleClass('fade', s.fade)
            .toggleClass('scale', s.scale)
            .attr('id', 'messager-' + r.id)),
          s.cssClass && r.$.addClass(s.cssClass)
        var c = !1,
          d = r.$.find('.messager-actions'),
          p = function (t) {
            var a = e('<button type="button" class="action action-' + t.name + '"/>')
            'close' === t.name && a.addClass('close'),
              t.html !== n && a.html(t.html),
              t.icon !== n && a.append('<i class="action-icon icon-' + t.icon + '"/>'),
              t.text !== n && a.append('<span class="action-text">' + t.text + '</span>'),
              t.tooltip !== n && a.attr('title', t.tooltip).tooltip(),
              a.data('action', t),
              d.append(a)
          }
        s.actions &&
          e.each(s.actions, function (e, t) {
            t.name === n && (t.name = e), 'close' == t.name && (c = !0), p(t)
          }),
          !c && s.close && p({ name: 'close', html: '&times;' }),
          r.$.on('click', '.action', function (t) {
            var n = e(this).data('action')
            ;(s.onAction && !1 === s.onAction.call(this, n.name, n, r)) ||
              ('function' == typeof n.action && !1 === n.action.call(this, r)) ||
              (r.hide(), t.stopPropagation())
          }),
          r.$.on('click', function (e) {
            s.onAction && !0 === s.onAction.call(this, 'content', null, r) && r.hide()
          }),
          r.$.data('zui.messager', r),
          s.show && r.message !== n && r.show()
      }
    ;(s.prototype.update = function (t, n) {
      e.isPlainObject(t) ? (n = t) : t && (n ? (n.content = t) : (n = { content: t }))
      var a = this,
        o = a.options
      a.$.removeClass('messager-' + o.type)
      var i = a.$.find('.messager-content')
      o.contentClass && i.removeClass(o.contentClass),
        n && (o = e.extend(o, n)),
        a.$.addClass('messager-' + o.type).toggleClass('messager-notification', !!o.notification),
        o.contentClass && i.addClass(o.contentClass)
      var s = o.title,
        r = o.icon
      if (((t = o.content), i.empty(), s)) {
        var l = e('<div class="messager-title"></div>')
        l[o.html ? 'html' : 'text'](s), i.append(l)
      }
      if (t) {
        var c = e('<div class="messager-text"></div>')
        c[o.html ? 'html' : 'text'](t), i.append(c)
      }
      var d = a.$.find('.messager-icon')
      if (r) {
        var p = e.isPlainObject(r) ? r.html : '<i class="icon-' + r + ' icon"></i>'
        d.length ? d.html(p) : i.before('<div class="messager-icon">' + p + '<div>')
      } else d.remove()
      a.$.toggleClass('messager-has-icon', !!r),
        a.updateTime || (o.onUpdate && o.onUpdate.call(a, o)),
        (a.updateTime = Date.now())
    }),
      (s.prototype.show = function (a, o) {
        var i = this,
          s = this.options
        if ('function' == typeof a) {
          var r = o
          ;(o = a), r !== n && (a = r)
        }
        if (!i.isShow) {
          i.hiding && (clearTimeout(i.hiding), (i.hiding = null)), i.update(a)
          var l = s.placement,
            c = e(s.parent),
            d = c.children('.messagers-holder.' + l)
          if (
            (d.length ||
              (d = e('<div/>')
                .attr('class', 'messagers-holder ' + l)
                .appendTo(c)),
            d.append(i.$),
            'center' === l)
          ) {
            var p = e(t).height() - d.height()
            d.css('top', Math.max(-p, p / 2))
          }
          return (
            i.$.show().addClass('in'),
            s.time &&
              (i.hiding = setTimeout(function () {
                i.hide()
              }, s.time)),
            (i.isShow = !0),
            o && o(),
            s.onShow && s.onShow.call(i, s),
            i
          )
        }
        i.hide(function () {
          i.show(a, o)
        })
      }),
      (s.prototype.hide = function (e, t) {
        !0 === e && ((t = !0), (e = null))
        var n = this,
          a = n.options
        if (n.$.hasClass('in')) {
          n.$.removeClass('in')
          var o = function () {
            var o = n.$.parent()
            n.$.detach(), o.children().length || o.remove(), e && e(!0), a.onHide && a.onHide.call(n, t)
          }
          t ? o() : setTimeout(o, 200)
        } else e && e(!1), a.onHide && a.onHide.call(n, t)
        n.isShow = !1
      }),
      (s.prototype.destroy = function () {
        var e = this
        e.hide(function () {
          e.$.remove(), (e.$ = null)
        }, !0),
          delete i[e.id]
      })
    var r = function (t) {
        if (t === n)
          e('.messager').each(function () {
            var t = e(this).data('zui.messager')
            t && t.hide && t.hide(!0)
          })
        else {
          var a = e('#messager-' + t).data('zui.messager')
          a && a.hide && a.hide()
        }
      },
      l = function (t, a) {
        'string' == typeof a && (a = { type: a }),
          e.isPlainObject(t) && ((a = e.extend({}, a, t)), (t = null)),
          (a = e.extend({}, a)).id === n && r()
        var o = i[a.id] || new s(t, a)
        return o.show(), o
      },
      c = { notification: !0, placement: 'bottom-right', time: 0, icon: 'bell icon-2x' },
      d = { show: l, hide: r }
    ;(s.all = i),
      (s.DEFAULTS = o),
      (s.NOTIFICATION_DEFAULTS = c),
      e.each(
        {
          primary: 0,
          success: 'ok-sign',
          info: 'info-sign',
          warning: 'warning-sign',
          danger: 'exclamation-sign',
          important: 0,
          special: 0
        },
        function (t, n) {
          d[t] = function (a, o) {
            return l(
              a,
              e.extend(
                { type: t, icon: s.DEFAULTS.icons[t] || n || null },
                (function (e) {
                  return 'string' == typeof e ? { placement: e } : e
                })(o)
              )
            )
          }
        }
      ),
      e.zui({
        Messager: s,
        showMessager: l,
        showNotification: function (t, n, a) {
          var o = e.extend({ id: e.zui.uuid() }, c),
            i = 'string' == typeof t
          return (
            i && 'string' == typeof n
              ? (a = e.extend(o, a, { title: t, content: n }))
              : i && e.isPlainObject(n)
                ? (a = e.extend(o, a, n, { title: t }))
                : e.isPlainObject(t)
                  ? (a = e.extend(o, a, n, t))
                  : i && (a = e.extend(o, a, { title: t })),
            l(a)
          )
        },
        messager: d
      })
  })(jQuery, window, void 0),
  (function ($) {
    'use strict'

    var NAME = 'zui.searchBox' // modal name

    // The searchbox modal class
    var SearchBox = function (element, options) {
      var that = this
      that.name = name
      that.$ = $(element)

      that.options = options = $.extend({}, SearchBox.DEFAULTS, that.$.data(), options)

      // Initialize here
      var $input = that.$.is(options.inputSelector) ? that.$ : that.$.find(options.inputSelector)
      if ($input.length) {
        var clearChangeTimer = function () {
          if (that.changeTimer) {
            clearTimeout(that.changeTimer)
            that.changeTimer = null
          }
        }

        var handleChange = function () {
          clearChangeTimer()
          var value = that.getSearch()
          if (value !== that.lastValue) {
            var isEmpty = value === ''
            $input.toggleClass('empty', isEmpty)
            that.$.callComEvent(that, 'onSearchChange', [value, isEmpty])
            that.lastValue = value
          }
        }

        that.$input = $input = $input.first()

        $input
          .on(options.listenEvent, function (params) {
            that.changeTimer = setTimeout(function () {
              handleChange()
            }, options.changeDelay)
          })
          .on('focus', function (e) {
            $input.addClass('focus')
            that.$.callComEvent(that, 'onFocus', [e])
          })
          .on('blur', function (e) {
            $input.removeClass('focus')
            that.$.callComEvent(that, 'onBlur', [e])
          })
          .on('keydown', function (e) {
            var handled = 0
            var keyCode = e.which
            if (keyCode === 27 && options.escToClear) {
              // esc
              this.setSearch('', true)
              handleChange()
              handled = 1
            } else if (keyCode === 13 && options.onPressEnter) {
              handleChange()
              that.$.callComEvent(that, 'onPressEnter', [e])
            }
            var onKeyDownResult = that.$.callComEvent(that, 'onKeyDown', [e])
            if (onKeyDownResult === false) {
              handled = 1
            }
            if (handled) {
              e.preventDefault()
            }
          })

        that.$.on('click', '.search-clear-btn', function (e) {
          that.setSearch('', true)
          handleChange()
          that.focus()
          e.preventDefault()
        })

        handleChange()
      } else {
        console.error('ZUI: search box init error, cannot find search box input element.')
      }
    }

    // default options
    SearchBox.DEFAULTS = {
      inputSelector: 'input[type="search"],input[type="text"]',
      listenEvent: 'change input paste',
      changeDelay: 500

      // onKeyDown: null,
      // onFocus: null,
      // onBlur: null,
      // onSearchChange: null,
      // onPressEnter: null,
      // escToClear: true
    }

    // Get current search string
    SearchBox.prototype.getSearch = function () {
      return this.$input && $.trim(this.$input.val())
    }

    // Set current search string
    SearchBox.prototype.setSearch = function (value, notTriggerChange) {
      var $input = this.$input
      if ($input) {
        $input.val(value)
        if (!notTriggerChange) {
          $input.trigger('change')
        }
      }
    }

    // Focus input element
    SearchBox.prototype.focus = function () {
      this.$input && this.$input.focus()
    }

    // Extense jquery element
    $.fn.searchBox = function (option) {
      return this.each(function () {
        var $this = $(this)
        var data = $this.data(NAME)
        var options = typeof option == 'object' && option

        if (!data) $this.data(NAME, (data = new SearchBox(this, options)))

        if (typeof option == 'string') data[option]()
      })
    }

    SearchBox.NAME = NAME

    $.fn.searchBox.Constructor = SearchBox
  })(jQuery)
;(function (e) {
  ;(e.fn.popup = function (t) {
    var n = e.extend({}, { position: 'bottom', animationSpeed: 300, isOpen: !1, closeOnOverlay: !0 }, t)
    return (
      (n.position = n.position || 'bottom'),
      this.each(function () {
        var t = e(this),
          a = e(t.data('popup')),
          o = a.find('.close')
        function i(e) {
          a.css({ transform: e }).addClass('is-open').show(),
            setTimeout(() => {
              a.css({ transform: 'translate(0, 0%)' })
            })
        }
        function s() {
          switch (n.position) {
            case 'top':
              a.css({ transform: 'translate(0, -100%)' })
              break
            case 'bottom':
              a.css({ transform: 'translate(0, 100%)' })
              break
            case 'left':
              a.css({ transform: 'translate(-100%, 0)' })
              break
            case 'right':
              a.css({ transform: 'translate(100%, 0)' })
          }
          setTimeout(() => {
            a.removeClass('is-open').fadeOut(), e('.dx-overlay').hide(200), (n.isOpen = !1)
          })
        }
        a.css({
          display: 'none',
          position: 'fixed',
          zIndex: 9999,
          transition: 'transform ' + n.animationSpeed + 'ms ease'
        }),
          t.on('click', function (t) {
            n.isOpen ||
              (t.preventDefault(),
              (function () {
                switch (n.position) {
                  case 'top':
                    i('translate(0, -100%)')
                    break
                  case 'bottom':
                    i('translate(0, 100%)')
                    break
                  case 'left':
                    i('translate(-100%, 0)')
                    break
                  case 'right':
                    i('translate(100%, 0)')
                }
              })(),
              e('.dx-overlay').fadeIn(200)),
              (n.isOpen = !0)
          }),
          o &&
            o.on('click', function (e) {
              s()
            }),
          n.closeOnOverlay &&
            e('.dx-overlay').on('click', function () {
              s()
            })
      })
    )
  }),
    e('.popup-trigger').popup(),
    (e.fn.goToTop = function () {
      return (
        this.each(function () {
          var t = e(this)
          t.on('click', function () {
            e('html, body').animate({ scrollTop: 0 }, 'fast')
          }),
            e(window).scroll(function () {
              e(this).scrollTop() > 100 ? t.fadeIn() : t.fadeOut()
            })
        }),
        this
      )
    }),
    (e.fn.collapse = function (t) {
      var n = e.extend({ toggleSpeed: 300, collapsed: !0 }, t)
      return this.each(function () {
        var t = e(this),
          a = t.find('.dx-collapse-toggle'),
          o = t.find('.dx-collapse-content')
        n.collapsed ? (o.hide(), t.toggleClass('collapsed')) : o.show(),
          a.on('click', function () {
            o.slideToggle(n.toggleSpeed), t.toggleClass('collapsed')
          })
      })
    }),
    e(document).ready(function () {
      e('.dx-backtop').goToTop(), e('.dx-collapse').collapse()
      var scrollTop = $(window).scrollTop()
      if (scrollTop > 100) {
        e('.dx-backtop').fadeIn()
      }
    })
})(jQuery)
;(function ($) {
  $.fn.textarea = function () {
    return this.each(function () {
      var $container = $(this)
      var $textarea = $container.find('textarea')

      var $currentSpan = $textarea.siblings('.flex').find('.current')
      var $limitSpan = $textarea.siblings('.flex').find('.limit')

      // 更新显示信息
      function updateDisplay() {
        var currentLength = $textarea.val().length
        var maxLength = $textarea.attr('maxlength') || '500' // 默认为 500

        $currentSpan.text(currentLength) // 更新当前长度
        $limitSpan.text(maxLength) // 更新最大长度
      }

      // 监听输入事件
      $textarea.on('input', updateDisplay)

      // 初始化显示
      updateDisplay()
    })
  }

  $('.dx-textarea').textarea()

  $.fn.rating = function (options) {
    // 默认选项
    var settings = $.extend(
      {
        maxStars: 5, // 最大星星数
        initialRating: 5, // 初始评分
        starOnClass: 'star_red', // 激活状态的类
        starOffClass: 'star_icon', // 非激活状态的类
        ratingTexts: ['太差了', '不太好', '一般般', '还不错', '超好看'] // 各星级对应的文本
      },
      options
    )

    return this.each(function () {
      var $container = $(this)
      var $stars = $container.find('svg')
      var $ratingTitle = $container.find('.dx-rate-title')
      var step = Number($container.data('step')) || 1
      var currentRating = ($container.data('value') || settings.initialRating) / step

      // 更新星星状态和评分文本
      function updateStars() {
        $stars.each(function (index) {
          $(this)
            .find('use')
            .attr(
              'href',
              index < currentRating
                ? '/static/frontend/icons/icons.svg#' + settings.starOnClass
                : '/static/frontend/icons/icons.svg#' + settings.starOffClass
            )
        })
        $container.data('value', currentRating)

        $ratingTitle.text(settings.ratingTexts[currentRating - 1] || '') // 更新评分文本
      }

      // 初始化星星状态
      updateStars()

      // 处理星星点击事件
      $stars.on('click', function () {
        if (!$container.data('disabled')) {
          currentRating = $(this).index()
          updateStars()
          $container.trigger('rating:change', [currentRating])
        }
      })
    })
  }

  $('.dx-rate').rating()

  $.fn.verifyCountdown = function (options) {
    // 默认设置
    var settings = $.extend(
      {
        countdownSelector: '.btn-send-code',
        countdownTime: 60,
        onSend: function () {}
      },
      options
    )

    return this.each(function () {
      var $button = $(this)
      var $countdown = $(settings.countdownSelector)
      var timer

      $button.on('click', function () {
        // 调用 onSend 方法
        settings.onSend()

        // 启动倒计时
        startCountdown()
      })

      function startCountdown() {
        var timeLeft = settings.countdownTime
        $button.prop('disabled', true).text('获取中')
        $countdown.show()

        // 更新倒计时显示
        function updateCountdown() {
          $countdown.text(timeLeft + '秒后重试')
          timeLeft -= 1
          if (timeLeft < 0) {
            clearInterval(timer)
            $button.prop('disabled', false)
            $countdown.hide()
          }
        }

        // 每秒更新一次倒计时
        timer = setInterval(updateCountdown, 1000)
      }
    })
  }
})(jQuery)
