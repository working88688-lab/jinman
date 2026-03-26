"use strict";

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
define([], function () {
  function set(_ref) {
    let {
      db_name,
      db_version = 1,
      table_name,
      data = {}
    } = _ref;
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(db_name, db_version);
      request.onsuccess = function (res) {
        const db = res.target.result;
        const transaction = db.transaction([table_name], 'readwrite');
        const store = transaction.objectStore(table_name);
        const request = store.add(_objectSpread(_objectSpread({}, data), {}, {
          id: data.id
        }));
        request.onsuccess = resolve;
        request.onerror = reject;
      };
      request.onupgradeneeded = function (res) {
        const _db = res.target.result;
        if (!_db.objectStoreNames.contains(table_name)) {
          _db.createObjectStore(table_name, {
            keyPath: 'id',
            unique: true
          });
        }
      };
      request.onerror = reject;
    });
  }
  function get(_ref2) {
    let {
      db_name,
      db_version = 1,
      table_name,
      options = {}
    } = _ref2;
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(db_name, db_version);
      request.onsuccess = function (res) {
        const db = res.target.result;
        var store = db.transaction([table_name]).objectStore(table_name);
        var request = store.getAll();
        request.onsuccess = event => {
          const {
            offset = 1,
            limit = 20
          } = options;
          const res = event.target.result;
          const start = (offset - 1) * limit;
          const end = start + limit;
          resolve(res.slice(start, end));
        };
        request.onerror = reject;
      };
      request.onupgradeneeded = function (res) {
        const _db = res.target.result;
        if (!_db.objectStoreNames.contains(table_name)) {
          _db.createObjectStore(table_name, {
            keyPath: 'id',
            unique: true
          });
        }
      };
      request.onerror = reject;
    });
  }
  return {
    set,
    get
  };
});