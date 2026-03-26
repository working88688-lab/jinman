"use strict";

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/*
 * @Author: Leo
 * @LastEditors: Leo
 * @LastEditTime: 2024-09-09 20:40:29
 * @Description: 浏览记录
 */
define(['lib/dexie'], function (Dexie) {
  const DB_VERSION = 1; // 版本
  const DB_NAME = '18DM_RECORDS';
  const MAX_COUNT = 50; // 最大可存储数量
  const INDEX = 'id, _last_watched_at';
  const db = new Dexie(DB_NAME);
  db.version(DB_VERSION).stores({
    novel: INDEX,
    video: INDEX,
    comic: INDEX,
    audio: INDEX
  });
  /**
   * @description:
   * @param {*} table_name 表名 novel=小说 ｜ video=视频 ｜ comic=禁漫 ｜ audio=有声
   * @param {*} data 数据，必须带ID
   * @return {*}
   */
  const save = function save(table_name) {
    let data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Promise((resolve, reject) => {
      const table = db[table_name];
      db.transaction('rw', table, async () => {
        try {
          const item = await table.get({
            id: data.id
          });
          let flag = false;
          const _last_watched_at = Date.now();
          if (item) {
            table.where({
              id: data.id
            }).modify({
              _last_watched_at
            });
          } else {
            flag = true;
            await table.add(_objectSpread(_objectSpread({}, data), {}, {
              _last_watched_at
            }));
          }
          const items = await table.where({
            id: data.id
          }).sortBy('_last_watched_at');
          if (items.length > MAX_COUNT && flag) {
            const [first] = items;
            await table.where({
              id: data.id,
              _last_watched_at: first._last_watched_at
            }).delete();
          }
          resolve(true);
        } catch (error) {
          reject(error);
          console.warn("\u6570\u636E\u5B58\u50A8\u5931\u8D25:", error);
        }
      });
    });
  };
  const get = async function get(table_name) {
    let page = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    let page_size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
    const table = db[table_name];
    const items = await table.reverse().sortBy('_last_watch_at');
    let offset = (page - 1) * page_size;
    return {
      items: items.slice(offset, offset + page_size),
      total: items.length,
      page,
      page_size
    };
  };
  const clear = async table_name => {
    if (table_name) {
      const table = db[table_name];
      await table.clear();
    } else {
      const clear_queue = ['novel', 'video', 'comic', 'audio'].map(key => {
        return db[key].clear();
      });
      await Promise.all(clear_queue);
    }
  };
  return {
    get,
    save,
    clear
  };
});