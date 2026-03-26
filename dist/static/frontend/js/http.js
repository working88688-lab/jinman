"use strict";

const _excluded = ["_options"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
define(['jquery', 'db', 'zui'], function ($, db) {
  function http() {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return new Promise((resolve, reject) => {
      const default_config = {
        method: 'POST',
        dataType: 'json'
      };
      const {
          _options = {}
        } = config,
        rest = _objectWithoutProperties(config, _excluded);
      $.ajax(_objectSpread(_objectSpread(_objectSpread({}, default_config), rest), {}, {
        url: "".concat(API_PREFIX).concat(config.url),
        success: function success(res) {
          const code = res.code;
          if (code === (_options.code || 200)) {
            if (_options.showSuccess) {
              new $.zui.Messager(_options.msg || res.msg, {
                time: 3000,
                type: 'success',
                close: false
              }).show();
            }
            if (_options.original) {
              return resolve(res);
            }
            resolve(res.data);
          } else if (code === 403) {
            localStorage.clear();
            sessionStorage.clear();
            document.cookie = "landing_modal_key =; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
            db.clear();
            $('.login-container').show();
            $('.logged-container').hide();
            $('#login_modal').modal({
              position: 160,
              show: true,
              backdrop: 'static'
            });
            reject(res.msg);
          } else {
            reject(res.msg);
            if (_options.showError) {
              new $.zui.Messager(res.msg, {
                time: 3000,
                type: 'danger',
                close: false
              }).show();
            }
          }
        },
        error: function error(xhr, status, _error) {
          if (_options.showError) {
            new $.zui.Messager(_error.toString(), {
              time: 3000,
              type: 'danger',
              close: false
            }).show();
          }
          reject(_error);
        }
      }));
    });
  }
  return http;
});