/*
 * @Author: Leo
 * @LastEditors: Leo
 * @LastEditTime: 2024-09-09 20:40:29
 * @Description: 浏览记录
 */
define(['lib/dexie'], function (Dexie) {
  const DB_VERSION = 1 // 版本
  const DB_NAME = '18DM_RECORDS'

  const MAX_COUNT = 50 // 最大可存储数量
  const INDEX = 'id, _last_watched_at'
  const db = new Dexie(DB_NAME)

  db.version(DB_VERSION).stores({
    novel: INDEX,
    video: INDEX,
    comic: INDEX,
    audio: INDEX
  })
  /**
   * @description:
   * @param {*} table_name 表名 novel=小说 ｜ video=视频 ｜ comic=禁漫 ｜ audio=有声
   * @param {*} data 数据，必须带ID
   * @return {*}
   */
  const save = (table_name, data = {}) => {
    return new Promise((resolve, reject) => {
      const table = db[table_name]

      db.transaction('rw', table, async () => {
        try {
          const item = await table.get({
            id: data.id
          })
          let flag = false
          const _last_watched_at = Date.now()
          if (item) {
            table
              .where({
                id: data.id
              })
              .modify({
                _last_watched_at
              })
          } else {
            flag = true
            await table.add({
              ...data,
              _last_watched_at
            })
          }
          const items = await table
            .where({
              id: data.id
            })
            .sortBy('_last_watched_at')

          if (items.length > MAX_COUNT && flag) {
            const [first] = items
            await table
              .where({
                id: data.id,
                _last_watched_at: first._last_watched_at
              })
              .delete()
          }

          resolve(true)
        } catch (error) {
          reject(error)
          console.warn(`数据存储失败:`, error)
        }
      })
    })
  }

  const get = async (table_name, page = 1, page_size = 10) => {
    const table = db[table_name]

    const items = await table.reverse().sortBy('_last_watch_at')
    let offset = (page - 1) * page_size
    return {
      items: items.slice(offset, offset + page_size),
      total: items.length,
      page,
      page_size
    }
  }

  const clear = async table_name => {
    if (table_name) {
      const table = db[table_name]
      await table.clear()
    } else {
      const clear_queue = ['novel', 'video', 'comic', 'audio'].map(key => {
        return db[key].clear()
      })
      await Promise.all(clear_queue)
    }
  }
  return {
    get,
    save,
    clear
  }
})
